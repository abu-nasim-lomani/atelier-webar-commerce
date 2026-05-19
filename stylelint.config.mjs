// @ts-check

/**
 * CSS guardrails — component CSS may only consume design tokens.
 *
 * `stylelint-declaration-strict-value` makes a raw hex / raw spacing /
 * raw radius / raw shadow value in component CSS a build failure. The
 * generated token file and the reset are the only files exempt.
 *
 * @type {import('stylelint').Config}
 */
export default {
  extends: ['stylelint-config-standard'],
  plugins: ['stylelint-declaration-strict-value'],
  ignoreFiles: ['src/tokens/tokens.generated.css', 'src/styles/reset.css'],
  rules: {
    'color-no-hex': true,
    'scale-unlimited/declaration-strict-value': [
      [
        '/color/',
        'fill',
        'stroke',
        'box-shadow',
        'border-radius',
        'font-size',
        'line-height',
        'letter-spacing',
        'font-family',
        'z-index',
        'transition-timing-function',
        'transition-duration',
      ],
      {
        ignoreValues: ['inherit', 'transparent', 'currentColor', 'none', '0', 'unset'],
        disableFix: true,
        message:
          'Use a design token via var(--token). Raw values are forbidden in component CSS.',
      },
    ],
    'custom-property-pattern': null,
    'selector-class-pattern': null,
  },
};
