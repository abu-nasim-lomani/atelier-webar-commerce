/**
 * Stage — the scene graph.
 *
 * C2: the true-scale placeholder + its grounding contact shadow live on the
 * named seams. Crucially, NONE of this bleeds across the page — `StageView`
 * scissors all rendering to the Hero `.stage` rect, so off that window the
 * page is pixel-identical to the approved A2 floor.
 *
 * Seams:
 *  - `product-anchor`      → Placeholder now; the real GLB drops in here later
 *  - `contact-shadow-slot` → soft grounded shadow
 *  - `environment-slot`    → future HDRI / IBL (still empty)
 *
 * No `react` import; R3F intrinsics only.
 */
import { Lighting } from './Lighting';
import { Placeholder } from './Placeholder';
import { Sofa } from './Sofa';
import { ContactShadow } from './ContactShadow';

export function Stage() {
  return (
    <>
      <Lighting />

      <group name="product-anchor">
        {/* Visible until the real GLB loads, then hidden by <Sofa>. */}
        <Placeholder />
        <Sofa />
      </group>
      <group name="contact-shadow-slot">
        <ContactShadow />
      </group>

      {/* Reserved, still-empty seam for later phases. */}
      <group name="environment-slot" />
    </>
  );
}
