/**
 * URL-as-state — the locked "backend-free V1" mechanism.
 *
 * The product configuration (selected finish, optional room width) round-trips
 * through the URL search params, so a product page is shareable, the QR
 * handoff carries state from desktop → mobile, and the WhatsApp deep-link
 * resumes the exact view. No server, no auth — the URL IS the state.
 *
 * Pure functions; UI/state layers consume these.
 */

export interface ProductConfiguration {
  readonly finishId: string;
  /** Optional: the buyer's room width in metres (for the fit checker). */
  readonly roomWidthMeters?: number;
}

const PARAM_FINISH = 'finish';
const PARAM_ROOM = 'room';
/** Two decimal places is the resolution we ever show to users (cm precision). */
const ROOM_DECIMALS = 2;

export function encodeConfiguration(config: ProductConfiguration): string {
  const params = new URLSearchParams();
  params.set(PARAM_FINISH, config.finishId);
  if (config.roomWidthMeters !== undefined) {
    params.set(PARAM_ROOM, config.roomWidthMeters.toFixed(ROOM_DECIMALS));
  }
  return params.toString();
}

export function decodeConfiguration(search: string): ProductConfiguration {
  const params = new URLSearchParams(search);
  const finish = params.get(PARAM_FINISH);
  const roomRaw = params.get(PARAM_ROOM);
  const roomNum = roomRaw === null ? Number.NaN : Number(roomRaw);
  const room: Pick<ProductConfiguration, 'roomWidthMeters'> = Number.isFinite(
    roomNum,
  )
    ? { roomWidthMeters: roomNum }
    : {};
  return {
    finishId: finish ?? '',
    ...room,
  };
}
