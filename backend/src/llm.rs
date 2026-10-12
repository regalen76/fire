//! Screenshot → structured data, via a vision model on an OpenAI-compatible endpoint.

use async_openai::{
    config::OpenAIConfig,
    types::chat::{
        ChatCompletionRequestAssistantMessageArgs, ChatCompletionRequestMessage,
        ChatCompletionRequestMessageContentPartImage, ChatCompletionRequestMessageContentPartText,
        ChatCompletionRequestSystemMessageArgs, ChatCompletionRequestUserMessageArgs,
        ChatCompletionRequestUserMessageContent, ChatCompletionRequestUserMessageContentPart,
        CreateChatCompletionRequestArgs, ImageDetail, ImageUrl, ResponseFormat,
        ResponseFormatJsonSchema,
    },
    Client,
};
use async_trait::async_trait;
use base64::Engine;
use serde::{Deserialize, Serialize};

use crate::{
    config::{JsonMode, LlmConfig},
    money,
};

pub const CATEGORY_IDS: &[&str] = &[
    "food",
    "groceries",
    "transport",
    "bills",
    "subs",
    "shopping",
    "health",
    "entertainment",
    "other",
    "salary",
    "income",
    "transfer",
];

#[derive(Clone, Copy, Debug, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "lowercase")]
pub enum Direction {
    In,
    Out,
    Internal,
}

impl Direction {
    pub fn as_str(self) -> &'static str {
        match self {
            Direction::In => "in",
            Direction::Out => "out",
            Direction::Internal => "internal",
        }
    }

    pub fn parse(s: &str) -> Option<Self> {
        match s {
            "in" => Some(Direction::In),
            "out" => Some(Direction::Out),
            "internal" => Some(Direction::Internal),
            _ => None,
        }
    }

    /// Sign applied to stored amounts: out < 0, everything else > 0.
    pub fn sign(self) -> i64 {
        if self == Direction::Out {
            -1
        } else {
            1
        }
    }
}

/// What the model returns. Amounts are decimal strings; Rust converts them.
#[derive(Clone, Debug, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct Extraction {
    pub is_receipt: bool,
    pub direction: Direction,
    pub merchant: String,
    pub occurred_at: Option<String>,
    pub currency: String,
    pub total: String,
    pub base_currency_total: Option<String>,
    pub items: Vec<ExtractedItem>,
    pub category: String,
    pub payment_method: Option<String>,
}

#[derive(Clone, Debug, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct ExtractedItem {
    pub name: String,
    pub quantity: Option<f64>,
    pub amount: Option<String>,
}

impl Extraction {
    /// Checks what the schema can't express. Errors are fed back to the model on retry.
    pub fn validate(&self) -> Result<(), String> {
        if !self.is_receipt {
            return Ok(());
        }
        if self.merchant.trim().is_empty() {
            return Err("merchant must not be empty".into());
        }
        if self.currency.len() != 3 || !self.currency.bytes().all(|b| b.is_ascii_uppercase()) {
            return Err(format!(
                "currency must be an ISO 4217 code like IDR or USD, got {:?}",
                self.currency
            ));
        }
        match money::parse_minor(&self.total) {
            Some(v) if v > 0 => {}
            _ => {
                return Err(format!(
                    "total must be a positive decimal like \"25000.00\", got {:?}",
                    self.total
                ))
            }
        }
        if let Some(b) = &self.base_currency_total {
            if money::parse_minor(b).is_none() {
                return Err(format!(
                    "baseCurrencyTotal must be a decimal or null, got {b:?}"
                ));
            }
        }
        if !CATEGORY_IDS.contains(&self.category.as_str()) {
            return Err(format!(
                "category {:?} is not one of the allowed ids",
                self.category
            ));
        }
        Ok(())
    }
}

/// Per-request facts the prompt needs.
#[derive(Clone, Debug)]
pub struct PromptContext {
    pub owner_names: Vec<String>,
    pub default_currency: String,
    pub base_currency: String,
    /// Owner's local date, for inferring a missing year.
    pub today: String,
}

#[derive(Clone, Debug)]
pub struct ExtractOutput {
    /// Raw model reply that produced `extraction`, kept on the receipt for debugging.
    pub raw: String,
    pub extraction: Extraction,
}

#[async_trait]
pub trait Extractor: Send + Sync {
    fn model(&self) -> &str;
    async fn extract(
        &self,
        image: &[u8],
        mime: &str,
        ctx: &PromptContext,
    ) -> anyhow::Result<ExtractOutput>;
}

pub struct OpenAiExtractor {
    client: Client<OpenAIConfig>,
    cfg: LlmConfig,
}

impl OpenAiExtractor {
    pub fn new(cfg: LlmConfig) -> Self {
        let client = Client::with_config(
            OpenAIConfig::new()
                .with_api_base(&cfg.base_url)
                .with_api_key(&cfg.api_key),
        );
        Self { client, cfg }
    }

    async fn complete(
        &self,
        messages: Vec<ChatCompletionRequestMessage>,
    ) -> anyhow::Result<String> {
        let response_format = match self.cfg.json_mode {
            JsonMode::Schema => ResponseFormat::JsonSchema {
                json_schema: ResponseFormatJsonSchema {
                    description: Some("Data read from a receipt or transfer screenshot".into()),
                    name: "receipt".into(),
                    schema: schema(),
                    strict: Some(true),
                },
            },
            JsonMode::Object => ResponseFormat::JsonObject,
        };
        let request = CreateChatCompletionRequestArgs::default()
            .model(&self.cfg.model)
            .messages(messages)
            .response_format(response_format)
            .temperature(0.0_f32)
            .build()?;
        let response = self.client.chat().create(request).await?;
        response
            .choices
            .into_iter()
            .next()
            .and_then(|c| c.message.content)
            .ok_or_else(|| anyhow::anyhow!("model returned no content"))
    }
}

#[async_trait]
impl Extractor for OpenAiExtractor {
    fn model(&self) -> &str {
        &self.cfg.model
    }

    async fn extract(
        &self,
        image: &[u8],
        mime: &str,
        ctx: &PromptContext,
    ) -> anyhow::Result<ExtractOutput> {
        let data_url = format!(
            "data:{mime};base64,{}",
            base64::engine::general_purpose::STANDARD.encode(image)
        );
        let mut messages: Vec<ChatCompletionRequestMessage> = vec![
            ChatCompletionRequestSystemMessageArgs::default()
                .content(system_prompt(ctx))
                .build()?
                .into(),
            ChatCompletionRequestUserMessageArgs::default()
                .content(ChatCompletionRequestUserMessageContent::Array(vec![
                    ChatCompletionRequestUserMessageContentPart::Text(
                        ChatCompletionRequestMessageContentPartText {
                            text: "Read this screenshot and return the JSON.".into(),
                            ..Default::default()
                        },
                    ),
                    ChatCompletionRequestUserMessageContentPart::ImageUrl(
                        ChatCompletionRequestMessageContentPartImage {
                            image_url: ImageUrl {
                                url: data_url,
                                detail: Some(ImageDetail::High),
                            },
                            ..Default::default()
                        },
                    ),
                ]))
                .build()?
                .into(),
        ];

        // One retry with the validation error appended, then give up.
        let mut last_err = String::new();
        for attempt in 0..2 {
            let raw = self.complete(messages.clone()).await?;
            match parse_reply(&raw) {
                Ok(extraction) => return Ok(ExtractOutput { raw, extraction }),
                Err(e) => {
                    tracing::warn!(attempt, "invalid extraction: {e}");
                    last_err = e.clone();
                    messages.push(
                        ChatCompletionRequestAssistantMessageArgs::default()
                            .content(raw)
                            .build()?
                            .into(),
                    );
                    messages.push(
                        ChatCompletionRequestUserMessageArgs::default()
                            .content(format!(
                                "That JSON is invalid: {e}. Return the corrected JSON only."
                            ))
                            .build()?
                            .into(),
                    );
                }
            }
        }
        anyhow::bail!("model returned invalid JSON twice: {last_err}")
    }
}

/// Parses and validates a model reply. Tolerates ```json fences from providers
/// that ignore `response_format`.
pub fn parse_reply(raw: &str) -> Result<Extraction, String> {
    let trimmed = raw.trim();
    let body = trimmed
        .strip_prefix("```json")
        .or_else(|| trimmed.strip_prefix("```"))
        .and_then(|s| s.strip_suffix("```"))
        .unwrap_or(trimmed)
        .trim();
    let extraction: Extraction = serde_json::from_str(body).map_err(|e| e.to_string())?;
    extraction.validate()?;
    Ok(extraction)
}

fn system_prompt(ctx: &PromptContext) -> String {
    let owner = if ctx.owner_names.is_empty() {
        "(not configured; guess from context)".to_string()
    } else {
        ctx.owner_names.join(", ")
    };
    format!(
        r#"You read screenshots for a personal finance app and return one JSON object.

The screenshot is one of:
- a purchase receipt, bill, invoice or payment confirmation (QRIS, e-wallet, card, PayPal);
- a bank or e-wallet transfer confirmation (e.g. "Transfer Berhasil");
- something else (chat, photo, home screen). Then set isReceipt to false and fill the other fields with placeholders.

The owner of the app is: {owner}.

Fields:
- direction: "out" if money left the owner (purchase, bill, transfer to someone else), "in" if the owner received money (the owner is the recipient of a transfer, salary, refund), "internal" if both sides are the owner (top-up of the owner's own e-wallet, moving money between the owner's own accounts, PayPal withdrawal to the owner's bank).
- merchant: the store or service name, or for transfers the other person or company. Short and human-readable, no account numbers.
- occurredAt: local date and time shown on the screenshot as "YYYY-MM-DDTHH:MM", or null if none is shown. If the year is missing, use the most recent such date not after {today}.
- currency: ISO 4217 code of the total. "Rp" means IDR, "$" means USD unless the screenshot says otherwise. If no currency is shown, use {default_currency}.
- total: the final amount actually paid or received, after tax, discounts and fees, as a plain decimal string with "." as the decimal mark and no thousands separators. Indonesian formats use "." for thousands and "," for decimals: "Rp 25.000" is "25000", "Rp 1.250.000,50" is "1250000.50".
- baseCurrencyTotal: if the currency is not {base_currency} and the screenshot also shows the amount converted to {base_currency}, that converted amount as a plain decimal string; otherwise null.
- items: line items if the receipt lists them (name, quantity or null, amount as a plain decimal string or null). Empty array for transfers or when none are listed.
- category: exactly one of:
  food (restaurants, cafes, food delivery), groceries (supermarkets, minimarkets), transport (ride hailing, fuel, parking, tolls, transit, flights), bills (electricity, water, internet, phone credit, rent), subs (recurring subscriptions and software), shopping (marketplaces, clothes, electronics), health (pharmacy, doctor, insurance), entertainment (movies, games, events), other (anything else spent),
  salary (pay from an employer), income (any other money received),
  transfer (only for direction "internal").
- paymentMethod: the bank, e-wallet or card used if shown (e.g. "BCA", "GoPay", "OVO", "PayPal", "Visa •••• 1234"), else null.

Return only the JSON object."#,
        today = ctx.today,
        default_currency = ctx.default_currency,
        base_currency = ctx.base_currency,
    )
}

/// JSON schema for `response_format`. Strict mode needs every property listed in
/// `required` and `additionalProperties: false`; optional values are nullable.
pub fn schema() -> serde_json::Value {
    serde_json::json!({
        "type": "object",
        "additionalProperties": false,
        "required": [
            "isReceipt", "direction", "merchant", "occurredAt", "currency", "total",
            "baseCurrencyTotal", "items", "category", "paymentMethod"
        ],
        "properties": {
            "isReceipt": { "type": "boolean" },
            "direction": { "type": "string", "enum": ["in", "out", "internal"] },
            "merchant": { "type": "string" },
            "occurredAt": { "type": ["string", "null"] },
            "currency": { "type": "string" },
            "total": { "type": "string" },
            "baseCurrencyTotal": { "type": ["string", "null"] },
            "items": {
                "type": "array",
                "items": {
                    "type": "object",
                    "additionalProperties": false,
                    "required": ["name", "quantity", "amount"],
                    "properties": {
                        "name": { "type": "string" },
                        "quantity": { "type": ["number", "null"] },
                        "amount": { "type": ["string", "null"] }
                    }
                }
            },
            "category": { "type": "string", "enum": CATEGORY_IDS },
            "paymentMethod": { "type": ["string", "null"] }
        }
    })
}

#[cfg(test)]
pub mod fake {
    use super::*;
    use std::sync::Mutex;

    /// Returns queued results in order (or the last one forever).
    pub struct FakeExtractor {
        pub results: Mutex<Vec<Result<Extraction, String>>>,
    }

    impl FakeExtractor {
        pub fn new(results: Vec<Result<Extraction, String>>) -> Self {
            Self {
                results: Mutex::new(results),
            }
        }
    }

    #[async_trait]
    impl Extractor for FakeExtractor {
        fn model(&self) -> &str {
            "fake-model"
        }

        async fn extract(
            &self,
            _image: &[u8],
            _mime: &str,
            _ctx: &PromptContext,
        ) -> anyhow::Result<ExtractOutput> {
            let mut q = self.results.lock().unwrap();
            let next = if q.len() > 1 {
                q.remove(0)
            } else {
                q[0].clone()
            };
            match next {
                Ok(extraction) => Ok(ExtractOutput {
                    raw: serde_json::to_string(&extraction)?,
                    extraction,
                }),
                Err(e) => Err(anyhow::anyhow!(e)),
            }
        }
    }

    pub fn coffee() -> Extraction {
        Extraction {
            is_receipt: true,
            direction: Direction::Out,
            merchant: "Kopi Kenangan".into(),
            occurred_at: Some("2026-10-09T16:36".into()),
            currency: "IDR".into(),
            total: "25000".into(),
            base_currency_total: None,
            items: vec![ExtractedItem {
                name: "Kopi Susu".into(),
                quantity: Some(1.0),
                amount: Some("25000".into()),
            }],
            category: "food".into(),
            payment_method: Some("GoPay".into()),
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn parses_fenced_reply() {
        let json = serde_json::to_string(&fake::coffee()).unwrap();
        assert_eq!(
            parse_reply(&format!("```json\n{json}\n```")).unwrap(),
            fake::coffee()
        );
    }

    #[test]
    fn rejects_bad_fields() {
        let mut e = fake::coffee();
        e.category = "coffee".into();
        assert!(e.validate().unwrap_err().contains("category"));
        let mut e = fake::coffee();
        e.total = "lots".into();
        assert!(e.validate().unwrap_err().contains("total"));
        let mut e = fake::coffee();
        e.currency = "Rp".into();
        assert!(e.validate().unwrap_err().contains("currency"));
    }

    #[test]
    fn non_receipts_skip_validation() {
        let mut e = fake::coffee();
        e.is_receipt = false;
        e.total = String::new();
        assert!(e.validate().is_ok());
    }

    #[test]
    fn schema_lists_every_field_as_required() {
        let s = schema();
        let props = s["properties"].as_object().unwrap();
        let required: Vec<&str> = s["required"]
            .as_array()
            .unwrap()
            .iter()
            .map(|v| v.as_str().unwrap())
            .collect();
        for k in props.keys() {
            assert!(required.contains(&k.as_str()), "{k} missing from required");
        }
    }
}
