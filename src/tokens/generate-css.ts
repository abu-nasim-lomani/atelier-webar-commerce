/**
 * TOKEN → CSS-VARIABLE GENERATOR.
 *
 * The TS token modules are the single source of truth. This script derives the
 * CSS-variable channel consumed by all component CSS. The output is committed
 * (`tokens.generated.css`) so the app builds without a codegen step; `--check`
 * verifies the committed file has not drifted from the source.
 *
 *   pnpm tokens:build    → write
 *   pnpm tokens:check    → fail if committed file is stale
 *
 * Framework-free Node script (run via tsx). Not shipped to the client.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { color, ar } from './color';
import { elevation } from './elevation';
import {
  space,
  radius,
  touch,
  fontFamily,
  fontWeight,
  typeScale,
  easing,
  duration,
  zIndex,
} from './primitive';

const kebab = (s: string): string =>
  s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

interface Group {
  title: string;
  entries: string[];
}

const decl = (name: string, value: string): string => `--${name}: ${value};`;

const groups: Group[] = [
  {
    title: 'Colour — neutral spine + accent',
    entries: Object.entries(color).map(([k, v]) => decl(`color-${kebab(k)}`, v)),
  },
  {
    title: 'AR / cinematic overlay (separate namespace)',
    entries: Object.entries(ar).map(([k, v]) => decl(`ar-${kebab(k)}`, v)),
  },
  {
    title: 'Elevation — UI shadows only',
    entries: Object.entries(elevation).map(([k, v]) =>
      decl(`elevation-${kebab(k)}`, v),
    ),
  },
  {
    title: 'Space — 4pt base',
    entries: Object.entries(space).map(([k, v]) =>
      decl(`space-${k}`, `${String(v)}px`),
    ),
  },
  {
    title: 'Radius',
    entries: Object.entries(radius).map(([k, v]) =>
      decl(`radius-${kebab(k)}`, v === 0 ? '0' : `${String(v)}px`),
    ),
  },
  {
    title: 'Touch ergonomics',
    entries: Object.entries(touch).map(([k, v]) =>
      decl(`touch-${kebab(k)}`, `${String(v)}px`),
    ),
  },
  {
    title: 'Typography',
    entries: [
      ...Object.entries(fontFamily).map(([k, v]) => decl(`font-${kebab(k)}`, v)),
      ...Object.entries(fontWeight).map(([k, v]) =>
        decl(`font-weight-${kebab(k)}`, String(v)),
      ),
      ...Object.entries(typeScale).flatMap(([variant, t]) => [
        decl(`type-${kebab(variant)}-size`, t.size),
        decl(`type-${kebab(variant)}-lh`, t.lh),
        decl(`type-${kebab(variant)}-tracking`, t.tracking),
      ]),
    ],
  },
  {
    title: 'Motion',
    entries: [
      ...Object.entries(easing).map(([k, v]) => decl(`ease-${kebab(k)}`, v)),
      ...Object.entries(duration).map(([k, v]) =>
        decl(`duration-${kebab(k)}`, `${String(v)}ms`),
      ),
    ],
  },
  {
    title: 'Z-index hierarchy',
    entries: Object.entries(zIndex).map(([k, v]) =>
      decl(`z-${kebab(k)}`, String(v)),
    ),
  },
];

const build = (): string => {
  const lines: string[] = [
    '/**',
    ' * AUTO-GENERATED — DO NOT EDIT BY HAND.',
    ' * Source of truth: src/tokens/*.ts · regenerate with `pnpm tokens:build`.',
    ' */',
    '',
    ':root {',
  ];
  groups.forEach((g, i) => {
    if (i > 0) lines.push('');
    lines.push(`  /* ${g.title} */`);
    g.entries.forEach((e) => lines.push(`  ${e}`));
  });
  lines.push('}');
  return lines.join('\n') + '\n';
};

const here = dirname(fileURLToPath(import.meta.url));
const target = join(here, 'tokens.generated.css');
const css = build();
const isCheck = process.argv.includes('--check');

if (isCheck) {
  let current = '';
  try {
    current = readFileSync(target, 'utf8');
  } catch {
    current = '';
  }
  if (current !== css) {
    console.error(
      '✗ tokens.generated.css is stale. Run `pnpm tokens:build` and commit the result.',
    );
    process.exit(1);
  }
  console.log('✓ tokens.generated.css is in sync with the token source.');
} else {
  writeFileSync(target, css, 'utf8');
  console.log('✓ tokens.generated.css written from token source.');
}
