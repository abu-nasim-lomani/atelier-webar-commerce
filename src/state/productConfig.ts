'use client';

/**
 * Product configuration store (locked: zustand-class coarse slice).
 *
 * Holds only the buyer's selections — not catalog/finish data (that lives in
 * the commerce domain). Empty `finishId` means "use the product's default";
 * the orchestrator resolves the fallback when reading. `roomWidthMeters` is
 * null until the buyer enters their space width (locked fit-checker mechanic).
 *
 * Pure store: framework-agnostic creation, just needs React for the hook
 * binding. Phase 6: this slice infrequently re-renders the UI; per-frame
 * values (camera/anim) never live here.
 */
import { create } from 'zustand';

export interface ProductConfigState {
  /** Buyer-selected finish id; '' means "fall back to product default". */
  readonly finishId: string;
  /** Buyer-entered room width in metres; null = not yet entered. */
  readonly roomWidthMeters: number | null;
  setFinish: (id: string) => void;
  setRoomWidth: (m: number | null) => void;
}

export const useProductConfig = create<ProductConfigState>()((set) => ({
  finishId: '',
  roomWidthMeters: null,
  setFinish: (id) => {
    set({ finishId: id });
  },
  setRoomWidth: (m) => {
    set({ roomWidthMeters: m });
  },
}));
