/**
 * FinishSelector — the locked configurator chips.
 *
 * Horizontal, thumb-reachable strip on mobile. Each chip: a swatch (token-
 * sourced colour passed in by data, via the StyleVars custom-property bridge)
 * + label + story word. Selected state is a quiet `accent-wash` fill +
 * `accent` ring — exactly the locked "selected = accent" rule.
 *
 * Pure presentational: receives finishes + selectedId + onSelect.
 */
import type { ReactElement } from 'react';
import type { StyleVars } from '@/types';
import { cx } from '@/lib/cx';
import { Text } from '@/ui/primitives';
import type { FinishOption } from './types';
import styles from './FinishSelector.module.css';

interface FinishSelectorProps {
  readonly finishes: readonly FinishOption[];
  readonly selectedId: string;
  readonly onSelect: (id: string) => void;
}

export function FinishSelector({
  finishes,
  selectedId,
  onSelect,
}: FinishSelectorProps): ReactElement {
  return (
    <section
      className={styles.section}
      aria-label="Finish"
    >
      <Text variant="overline" tone="inkMuted">
        Finish
      </Text>
      <ul className={styles.strip} role="radiogroup" aria-label="Finish">
        {finishes.map((finish) => {
          const isSelected = finish.id === selectedId;
          const swatchStyle: StyleVars = { '--swatch-color': finish.sRGBHex };
          return (
            <li key={finish.id} className={styles.item}>
              <button
                type="button"
                role="radio"
                aria-checked={isSelected}
                className={cx(styles.chip, isSelected && styles.selected)}
                onClick={() => {
                  onSelect(finish.id);
                }}
              >
                <span className={styles.swatch} style={swatchStyle} />
                <span className={styles.text}>
                  <Text variant="body">{finish.label}</Text>
                  <Text variant="caption" tone="inkMuted">
                    {finish.story}
                  </Text>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
