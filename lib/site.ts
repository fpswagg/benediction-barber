/** What the pages show, built from the SSS showcase (types only: safe for client components). */

export type Service = {
  id: string;
  name: string;
  description: string;
  price: number | null;
  currency: string;
  duration: number | null;
  popular: boolean;
};

export type ServiceCategory = { id: string; name: string; description: string; icon: string; services: Service[] };

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  bio: string;
  experience: string;
  specialties: string[];
  imageUrl: string | null;
  available: boolean;
  backOn: string | null;
};

export type GalleryItem = { url: string; caption: string; category: string };

export type DayHours = { key: string; label: string; slots: { from: string; to: string }[] };

export type OpenStatus = {
  state: "open" | "closed" | "paused" | string;
  reason: string | null;
  opensAt: string | null;
  closesAt: string | null;
};

export type AssistantInfo = {
  publicKey: string;
  name: string;
  avatarUrl: string | null;
  greeting: string;
  suggestions: string[];
};

export type Site = {
  name: string;
  description: string;
  about: string;
  heroSubtitle: string;
  logoUrl: string | null;
  bannerUrl: string | null;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  address: string | null;
  city: string;
  country: string;
  extras: string[];
  categories: ServiceCategory[];
  team: TeamMember[];
  gallery: GalleryItem[];
  hours: DayHours[];
  hoursText: string;
  status: OpenStatus | null;
  payments: string[];
  /** Payment methods with their number / details when the salon gave them. */
  paymentMethods: { id: string; label: string; details: string }[];
  socials: { id: string; label: string; url: string }[];
  exceptions: { date: string; closed: boolean; note: string }[];
  faq: { q: string; a: string }[];
  assistant: AssistantInfo | null;
  /** false when SSS could not be reached and the built-in demo content is shown. */
  live: boolean;
};
