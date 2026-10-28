/*
 * Shared constants for the Sugar Control Accelerator sales page (/sca).
 *
 * Kept in a plain module (not the "use server" lib/sca-actions.ts, whose exports
 * must all be async) so the server action, the thank-you page and the client
 * order widget can all read the same price. SCA is a standalone campaign offer,
 * not a catalogue service, so its price lives here rather than in lib/services.
 */

/** Display price, shown on the page and in the WhatsApp hand-off message. */
export const SCA_PRICE_LABEL = "₦20,500";

/** The same amount in kobo (Paystack charges in kobo; ₦1 = 100 kobo). */
export const SCA_AMOUNT_KOBO = 2_050_000;
