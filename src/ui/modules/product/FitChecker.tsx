/**
 * FitChecker — the locked "will it fit?" mechanism.
 *
 * One controlled numeric input (room width in metres) → a calm token-coloured
 * verdict. Directly answers the #1 abandonment cause in furniture commerce.
 * Pure presentational: receives the product width, current value, computed
 * verdict (from commerce in the orchestrator), and an onChange handler.
 */
import type { ReactElement, ChangeEvent } from 'react';
import { Stack, Text } from '@/ui/primitives';
import { cx } from '@/lib/cx';
import type { FitView, FitVerdict } from './types';
import styles from './FitChecker.module.css';

interface FitCheckerProps {
  readonly productWidthMeters: number;
  readonly value: number | null;
  readonly result: FitView | null;
  readonly onChange: (m: number | null) => void;
}

const verdictCopy = (verdict: FitVerdict, clearance: number): string => {
  const c = clearance.toFixed(2);
  switch (verdict) {
    case 'fits':
      return `Fits comfortably — ${c} m of clearance.`;
    case 'tight':
      return `A tight fit — only ${c} m of clearance.`;
    case 'tooLarge':
      return 'Too large for that space.';
  }
};

// CSS-module `styles[k]` is `string | undefined` under noUncheckedIndexedAccess.
// `cx()` filters undefined already, so the return type matches reality.
const verdictTone = (verdict: FitVerdict): string | undefined => {
  switch (verdict) {
    case 'fits':
      return styles.confirm;
    case 'tight':
      return styles.caution;
    case 'tooLarge':
      return styles.alert;
  }
};

export function FitChecker({
  productWidthMeters,
  value,
  result,
  onChange,
}: FitCheckerProps): ReactElement {
  const inputValue = value === null ? '' : String(value);

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const raw = event.target.value;
    if (raw === '') {
      onChange(null);
      return;
    }
    const num = Number(raw);
    if (Number.isFinite(num) && num >= 0) {
      onChange(num);
    }
  };

  return (
    <Stack gap="s3">
      <Text variant="overline" tone="inkMuted">
        Will it fit
      </Text>
      <Text variant="body" tone="inkSoft">
        This piece is {productWidthMeters.toFixed(2)} m wide. Enter your space
        width to check.
      </Text>
      <label className={styles.field}>
        <span className={styles.fieldLabel}>
          <Text variant="caption" tone="inkMuted">
            Your space (m)
          </Text>
        </span>
        <input
          type="number"
          inputMode="decimal"
          step="0.1"
          min="0"
          className={styles.input}
          placeholder="e.g. 3.20"
          value={inputValue}
          onChange={handleChange}
        />
      </label>
      {result !== null && (
        <div className={cx(styles.verdict, verdictTone(result.verdict))}>
          <span className={styles.dot} aria-hidden="true" />
          <Text variant="body">
            {verdictCopy(result.verdict, result.clearanceMeters)}
          </Text>
        </div>
      )}
    </Stack>
  );
}
