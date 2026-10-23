/**
 * The salon's content (services, team, hours, gallery, contact, assistant) comes
 * from SSS, business "benediction-barber" (public showcase, no key needed).
 * These are only the connection settings.
 */
export const SSS_API_URL = (process.env.NEXT_PUBLIC_SSS_API_URL || "https://sss-api.fpswagg.site").replace(/\/$/, "");
export const SSS_STORE_SLUG = process.env.NEXT_PUBLIC_SSS_STORE_SLUG || "benediction-barber";
/** Seconds a page keeps the showcase before asking SSS again. */
export const SSS_REVALIDATE = Number(process.env.SSS_REVALIDATE || 60);

export const BUSINESS_NAME = "Bénédiction Barber";

/** wa.me link for a number written any way ("+237 691 89 32 41", "691893241"). */
export function whatsappUrl(number: string | null | undefined, text?: string): string | null {
  let digits = (number ?? "").replace(/\D/g, "");
  if (!digits) return null;
  if (digits.length === 9) digits = `237${digits}`;
  return `https://wa.me/${digits}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
}

export function telUrl(number: string | null | undefined): string | null {
  const digits = (number ?? "").replace(/[^\d+]/g, "");
  return digits ? `tel:${digits}` : null;
}
