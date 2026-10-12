import { useEffect, useState, type FormEvent } from 'react';
import { Button } from '@design/components/core/Button';
import { Input } from '@design/components/core/Input';
import { createTransaction, type Direction } from './api';
import { useBaseCurrency, useCategories, useRefresh } from './data';
import { Drawer } from './Drawer';
import { localInputNow } from './format';
import { FieldLabel, FormError, Segmented, Select } from './ui';

const CURRENCIES = ['IDR', 'USD', 'EUR', 'SGD', 'MYR', 'AUD', 'JPY', 'GBP'];

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated: (id: number) => void;
}

/** Manual entry, mainly income that arrives without a screenshot. */
export function AddTransaction({ open, onClose, onCreated }: Props) {
  const categories = useCategories();
  const base = useBaseCurrency();
  const { refresh } = useRefresh();
  const [direction, setDirection] = useState<Direction>('in');
  const [merchant, setMerchant] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState(base);
  const [categoryId, setCategoryId] = useState('');
  const [occurredAt, setOccurredAt] = useState(localInputNow);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const options = categories.forDirection(direction);

  // Fresh form each time it opens.
  useEffect(() => {
    if (!open) return;
    setDirection('in');
    setMerchant('');
    setAmount('');
    setCurrency(base);
    setOccurredAt(localInputNow());
    setPaymentMethod('');
    setNote('');
    setError(null);
  }, [open, base]);

  // Keep the category valid for the chosen direction.
  useEffect(() => {
    if (!options.some((c) => c.id === categoryId)) setCategoryId(options[0]?.id ?? '');
  }, [direction, options.length]); // eslint-disable-line react-hooks/exhaustive-deps

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const t = await createTransaction({
        direction,
        merchant: merchant.trim(),
        amount: amount.trim(),
        currency,
        categoryId,
        occurredAt: occurredAt || undefined,
        paymentMethod: paymentMethod.trim() || undefined,
        note: note.trim() || undefined,
      });
      refresh();
      onCreated(t.id);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const who = direction === 'in' ? 'From' : direction === 'out' ? 'Paid to' : 'Description';

  return (
    <Drawer open={open} onClose={onClose} title="Add Transaction" subtitle="For money that came without a screenshot">
      <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <FieldLabel>Type</FieldLabel>
          <Segmented<Direction>
            value={direction}
            onChange={setDirection}
            options={[
              { value: 'in', label: 'Income' },
              { value: 'out', label: 'Spending' },
              { value: 'internal', label: 'Internal' },
            ]}
          />
        </div>
        <Input label={who} required placeholder={direction === 'in' ? 'e.g. PT Maju Jaya' : 'e.g. Warung Sate'} value={merchant} onChange={(e) => setMerchant(e.target.value)} />
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 110px', gap: 12 }}>
          <Input label="Amount" required inputMode="decimal" placeholder={currency === 'IDR' ? '7.500.000' : '12.80'} value={amount} onChange={(e) => setAmount(e.target.value)} />
          <Select label="Currency" value={currency} onChange={(e) => setCurrency(e.target.value)}>
            {(CURRENCIES.includes(base) ? CURRENCIES : [base, ...CURRENCIES]).map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        </div>
        <Select label="Category" required value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
          {options.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </Select>
        <Input label="Date and time" type="datetime-local" value={occurredAt} onChange={(e) => setOccurredAt(e.target.value)} />
        <Input label="Payment method (optional)" placeholder="e.g. BCA, GoPay, PayPal" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} />
        <Input label="Note (optional)" value={note} onChange={(e) => setNote(e.target.value)} />
        <FormError>{error}</FormError>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <Button type="submit" disabled={busy || !merchant.trim() || !amount.trim() || !categoryId}>
            {busy ? 'Saving…' : 'Save Transaction'}
          </Button>
          <Button type="button" variant="text" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </Drawer>
  );
}
