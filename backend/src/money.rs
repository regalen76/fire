//! Decimal strings ↔ integer minor units (×100 for every currency).

/// Parses a non-negative decimal amount into minor units.
///
/// The LLM is asked for plain decimals (`"25000.00"`), but Indonesian receipts
/// write `Rp 25.000,00`, so this also accepts `.` as a thousands separator and
/// `,` as the decimal mark when the shape makes that unambiguous.
pub fn parse_minor(input: &str) -> Option<i64> {
    let s: String = input
        .trim()
        .trim_start_matches(|c: char| c.is_alphabetic() || c == '$' || c.is_whitespace())
        .chars()
        .filter(|c| !c.is_whitespace())
        .collect();
    if s.is_empty() || s.starts_with('-') {
        return None;
    }

    let dots = s.matches('.').count();
    let commas = s.matches(',').count();
    let (int_part, frac_part) = match (dots, commas) {
        (0, 0) => (s.clone(), String::new()),
        // "25000.50" or "25.000" (IDR thousands).
        (1, 0) => split_single(&s, '.'),
        (0, 1) => split_single(&s, ','),
        // "1.234.567" or "1,234,567".
        (_, 0) => (grouped(&s, '.')?, String::new()),
        (0, _) => (grouped(&s, ',')?, String::new()),
        // Both present: whichever comes last is the decimal mark.
        _ => {
            let last_dot = s.rfind('.')?;
            let last_comma = s.rfind(',')?;
            let (thousands, decimal) = if last_comma > last_dot {
                ('.', ',')
            } else {
                (',', '.')
            };
            let (i, f) = s.rsplit_once(decimal)?;
            if f.contains(thousands) {
                return None;
            }
            (grouped(i, thousands)?, f.to_string())
        }
    };

    if int_part.is_empty() || !int_part.bytes().all(|b| b.is_ascii_digit()) {
        return None;
    }
    if frac_part.len() > 2 || !frac_part.bytes().all(|b| b.is_ascii_digit()) {
        return None;
    }
    let major: i64 = int_part.parse().ok()?;
    let minor: i64 = format!("{frac_part:0<2}").parse().ok()?;
    major.checked_mul(100)?.checked_add(minor)
}

/// One separator: three digits after it means thousands ("25.000"), otherwise decimals.
fn split_single(s: &str, sep: char) -> (String, String) {
    let (i, f) = s.split_once(sep).unwrap();
    if f.len() == 3 {
        (format!("{i}{f}"), String::new())
    } else {
        (i.to_string(), f.to_string())
    }
}

/// "1.234.567" → "1234567", only if every group after the first has three digits.
fn grouped(s: &str, sep: char) -> Option<String> {
    let mut parts = s.split(sep);
    let first = parts.next()?;
    if first.is_empty() || first.len() > 3 {
        return None;
    }
    let mut out = first.to_string();
    for p in parts {
        if p.len() != 3 {
            return None;
        }
        out.push_str(p);
    }
    Some(out)
}

#[cfg(test)]
mod tests {
    use super::parse_minor;

    #[test]
    fn plain_decimals() {
        assert_eq!(parse_minor("25000"), Some(2_500_000));
        assert_eq!(parse_minor("25000.00"), Some(2_500_000));
        assert_eq!(parse_minor("12.8"), Some(1280));
        assert_eq!(parse_minor("12.80"), Some(1280));
        assert_eq!(parse_minor("0.99"), Some(99));
    }

    #[test]
    fn indonesian_and_us_grouping() {
        assert_eq!(parse_minor("25.000"), Some(2_500_000));
        assert_eq!(parse_minor("Rp 1.250.000"), Some(125_000_000));
        assert_eq!(parse_minor("Rp25.000,50"), Some(2_500_050));
        assert_eq!(parse_minor("1,234,567.89"), Some(123_456_789));
        assert_eq!(parse_minor("$1,299.00"), Some(129_900));
        assert_eq!(parse_minor("12,80"), Some(1280));
    }

    #[test]
    fn rejects_garbage() {
        assert_eq!(parse_minor(""), None);
        assert_eq!(parse_minor("-5"), None);
        assert_eq!(parse_minor("abc"), None);
        assert_eq!(parse_minor("1.2.3"), None);
        assert_eq!(parse_minor("12.345.6"), None);
        assert_eq!(parse_minor("1.234"), Some(123_400));
    }
}
