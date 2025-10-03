export const PUBLIC_BUSINESS_NAME =
  process.env.NEXT_PUBLIC_BUSINESS_NAME || "Bénédiction Barber";
export const PUBLIC_ADDRESS_LINE_1 =
  process.env.NEXT_PUBLIC_ADDRESS_LINE_1 || "Quartier Bastos, Avenue Kennedy";
export const PUBLIC_ADDRESS_CITY_COUNTRY =
  process.env.NEXT_PUBLIC_ADDRESS_CITY_COUNTRY || "Yaoundé, Cameroun";
export const PUBLIC_PHONE_PRIMARY =
  process.env.NEXT_PUBLIC_PHONE_PRIMARY || "+237 6XX XXX XXX";
export const PUBLIC_PHONE_SECONDARY =
  process.env.NEXT_PUBLIC_PHONE_SECONDARY || "+237 6YY YYY YYY";
export const PUBLIC_EMAIL_PRIMARY =
  process.env.NEXT_PUBLIC_EMAIL_PRIMARY || "contact@benedictionbarber.cm";
export const PUBLIC_EMAIL_SECONDARY =
  process.env.NEXT_PUBLIC_EMAIL_SECONDARY || "info@benedictionbarber.cm";
export const PUBLIC_WHATSAPP_COUNTRY_CODE =
  process.env.NEXT_PUBLIC_WHATSAPP_COUNTRY_CODE || "237";
export const PUBLIC_WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "600000000";
export const PUBLIC_HOURS_WEEKDAY =
  process.env.NEXT_PUBLIC_HOURS_WEEKDAY || "Lundi - Samedi: 9h00 - 20h00";
export const PUBLIC_HOURS_SUNDAY =
  process.env.NEXT_PUBLIC_HOURS_SUNDAY || "Dimanche: 10h00 - 18h00";

export function getWhatsAppUrlWithText(text: string): string {
  const message = encodeURIComponent(text);
  const fullNumber = `${PUBLIC_WHATSAPP_COUNTRY_CODE}${PUBLIC_WHATSAPP_NUMBER}`;
  return `https://wa.me/${fullNumber}?text=${message}`;
}
