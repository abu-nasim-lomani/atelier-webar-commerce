/**
 * Persistent shell — the site chrome.
 *
 * Owns the persistent header (so it survives client nav) and the safe-area-
 * padded content layer. The 3D canvas is NOT mounted here any more — each
 * route's stage div owns its own canvas (DOM-flow containment), so the canvas
 * scrolls with the page and stays framed without scissor sync.
 */
import type { ReactNode, ReactElement } from 'react';
import { SITE } from '@config/site';
import { SiteHeader } from '@/ui/modules/chrome';
import styles from './RootShell.module.css';

export function RootShell({
  children,
}: {
  readonly children: ReactNode;
}): ReactElement {
  return (
    <div className={styles.shell}>
      <div className={styles.content}>
        <SiteHeader
          brand={SITE.name}
          productHref="/product/hero-sofa"
          productLabel="The Sofa"
        />
        {children}
      </div>
    </div>
  );
}
