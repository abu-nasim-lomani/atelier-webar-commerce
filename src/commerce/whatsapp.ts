/**
 * WhatsApp deep-link builder — the locked primary close.
 *
 * Constructs a `wa.me` URL with a pre-filled message. The phone number is a
 * placeholder for the scaffold; replace with the brand's real number before
 * deploy (via env var in a later phase). Pure function, no side effects.
 *
 * Locked: conversational handoff is the PRIMARY conversion path (BD market),
 * not a Western checkout funnel — this URL is the close.
 */

// The brand's WhatsApp business number in international E.164 form, no leading
// `+` (Bangladesh = 880 + the local number without its leading 0, so the local
// 01788188820 becomes 8801788188820). Overridable per environment via
// NEXT_PUBLIC_WHATSAPP_NUMBER.
const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '8801788188820';

/** Build a `wa.me` URL that opens WhatsApp with the message pre-filled. */
export function buildWhatsAppUrl(message: string): string {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;
}
