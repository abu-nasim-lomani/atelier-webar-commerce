/**
 * Shared structural types. Leaf module — depends on nothing.
 * Domain/commerce/render types live in their own layers, not here.
 */
import type {
  ElementType,
  ComponentPropsWithoutRef,
  CSSProperties,
} from 'react';

/**
 * A style object that may also carry CSS custom properties. The only
 * sanctioned way to set a `--token` var inline while staying type-safe.
 */
export type StyleVars = CSSProperties & Record<`--${string}`, string>;

/**
 * Props for a polymorphic component: an `as` element plus that element's
 * native props, with the component's own props taking precedence.
 */
export type PolymorphicProps<
  TElement extends ElementType,
  TOwn,
> = TOwn & {
  readonly as?: TElement;
} & Omit<ComponentPropsWithoutRef<TElement>, keyof TOwn | 'as'>;
