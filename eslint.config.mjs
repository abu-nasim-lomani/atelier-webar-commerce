// @ts-check
import boundaries from 'eslint-plugin-boundaries';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';

/**
 * Architectural boundary enforcement (Phase 6 dependency rule, lint-enforced).
 *
 * Layers are leaves or composition roots. Forbidden dependencies fail CI so the
 * locked architecture cannot drift:
 *   - render / commerce are FRAMEWORK-FREE (no `react`)
 *   - `three` / `@react-three/*` live ONLY in `render` (none installed in A1)
 *   - ui never imports render or ar
 *   - analytics is a one-way sink; capability/tokens are read-only leaves
 */
const layerElements = [
  { type: 'app', pattern: 'app/**' },
  { type: 'tokens', pattern: 'src/tokens/**' },
  { type: 'config', pattern: 'config/**' },
  { type: 'lib', pattern: 'src/lib/**' },
  { type: 'types', pattern: 'src/types/**' },
  { type: 'analytics', pattern: 'src/analytics/**' },
  { type: 'capability', pattern: 'src/capability/**' },
  { type: 'render', pattern: 'src/render/**' },
  { type: 'motion', pattern: 'src/motion/**' },
  { type: 'state', pattern: 'src/state/**' },
  { type: 'commerce', pattern: 'src/commerce/**' },
  { type: 'ar', pattern: 'src/ar/**' },
  { type: 'hooks', pattern: 'src/hooks/**' },
  { type: 'ui', pattern: 'src/ui/**' },
];

const allowedDependencies = [
  { from: 'tokens', allow: ['tokens'] },
  { from: 'config', allow: ['config', 'tokens', 'types'] },
  { from: 'lib', allow: ['lib', 'types'] },
  { from: 'types', allow: ['types'] },
  { from: 'analytics', allow: ['lib', 'types'] },
  { from: 'capability', allow: ['lib', 'types'] },
  { from: 'render', allow: ['render', 'tokens', 'config', 'lib', 'types'] },
  { from: 'motion', allow: ['motion', 'tokens', 'lib', 'types'] },
  { from: 'state', allow: ['state', 'tokens', 'lib', 'types'] },
  { from: 'commerce', allow: ['commerce', 'tokens', 'config', 'lib', 'types'] },
  {
    from: 'ar',
    allow: ['ar', 'render', 'tokens', 'state', 'capability', 'config', 'lib', 'types'],
  },
  { from: 'hooks', allow: ['hooks', 'tokens', 'capability', 'lib', 'types'] },
  {
    from: 'ui',
    allow: ['ui', 'tokens', 'motion', 'state', 'hooks', 'lib', 'types'],
  },
  // app is the composition root — it may wire any layer together.
  {
    from: 'app',
    allow: [
      'app', 'ui', 'tokens', 'motion', 'state', 'commerce', 'ar',
      'render', 'capability', 'analytics', 'hooks', 'lib', 'types', 'config',
    ],
  },
];

export default [
  { ignores: ['.next/**', 'node_modules/**', 'src/tokens/tokens.generated.css'] },
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: { project: './tsconfig.json', ecmaFeatures: { jsx: true } },
    },
    plugins: { '@typescript-eslint': tsPlugin, boundaries },
    settings: {
      'boundaries/elements': layerElements,
      'boundaries/include': ['app/**', 'src/**', 'config/**'],
    },
    rules: {
      ...tsPlugin.configs['strict-type-checked'].rules,
      ...tsPlugin.configs['stylistic-type-checked'].rules,
      'boundaries/no-unknown': 'error',
      'boundaries/no-private': 'error',
      'boundaries/element-types': [
        'error',
        { default: 'disallow', rules: allowedDependencies },
      ],
      // No raw hex colour literals anywhere — tokens are the only source.
      'no-restricted-syntax': [
        'error',
        {
          selector:
            "Literal[value=/^#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/]",
          message:
            'Raw hex colour is forbidden. Define it in src/tokens/primitive.ts and consume the semantic token.',
        },
      ],
      // Default: 3D libraries are forbidden everywhere. Overridden ONLY for
      // src/render below. Reliable across flat-config matching (no extglob).
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['three', 'three/*', '@react-three/*'],
              message: '3D libraries are only permitted in src/render (Phase B+).',
            },
          ],
        },
      ],
    },
  },
  {
    // render MAY use three but must stay React-free (overrides the global rule).
    files: ['src/render/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            { name: 'react', message: 'render/ must be framework-free.' },
            { name: 'react-dom', message: 'render/ must be framework-free.' },
          ],
        },
      ],
    },
  },
  {
    // commerce is framework-free AND has no 3D (re-asserts both bans).
    files: ['src/commerce/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            { name: 'react', message: 'commerce/ must be framework-free.' },
            { name: 'react-dom', message: 'commerce/ must be framework-free.' },
          ],
          patterns: [
            {
              group: ['three', 'three/*', '@react-three/*'],
              message: '3D libraries are only permitted in src/render (Phase B+).',
            },
          ],
        },
      ],
    },
  },
  {
    // primitive.ts is the single sanctioned home of raw values.
    files: ['src/tokens/primitive.ts'],
    rules: { 'no-restricted-syntax': 'off' },
  },
];
