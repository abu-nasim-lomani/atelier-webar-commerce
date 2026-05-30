/**
 * Dimensions — a calm read-only W × D × H block.
 *
 * Tabular numerals (via [data-numeric]) so values never jitter on update.
 * Pure presentational; metres only, two-decimal display.
 */
import type { ReactElement } from 'react';
import { Stack, Text, Divider } from '@/ui/primitives';
import styles from './Dimensions.module.css';

interface DimensionsProps {
  readonly dimensionsMeters: {
    readonly width: number;
    readonly depth: number;
    readonly height: number;
  };
}

const ROWS = [
  { key: 'width', label: 'Width' },
  { key: 'depth', label: 'Depth' },
  { key: 'height', label: 'Height' },
] as const;

export function Dimensions({ dimensionsMeters }: DimensionsProps): ReactElement {
  return (
    <Stack gap="s4">
      <Text variant="overline" tone="inkMuted">
        Dimensions
      </Text>
      <ul className={styles.list}>
        {ROWS.map((row, i) => {
          const value = dimensionsMeters[row.key];
          return (
            <li key={row.key} className={styles.row}>
              {i > 0 && <Divider />}
              <div className={styles.line}>
                <Text variant="body" tone="inkSoft">
                  {row.label}
                </Text>
                <Text variant="body" numeric>
                  {value.toFixed(2)} m
                </Text>
              </div>
            </li>
          );
        })}
      </ul>
    </Stack>
  );
}
