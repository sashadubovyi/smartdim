export interface Spec {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  title: string;
  category: string;
  /** Short tag line shown above the title on the card (e.g. brand / series). */
  tagline?: string;
  description: string;
  price: number;
  oldPrice?: number;
  images: string[];
  specs: Spec[];
  featured?: boolean;
  createdAt: number;
}

export interface Advantage {
  id: string;
  icon: string; // key into the icon map
  title: string;
  text?: string;
}

export interface Contacts {
  phone: string;
  telegram: string;
  whatsapp: string;
  viber: string;
}

/** A generic icon + title (+ optional note) row, used for delivery/payment. */
export interface InfoItem {
  id: string;
  icon: string;
  title: string;
  text?: string;
}

export interface SiteContent {
  siteTitle: string;
  currency: string;
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
  };
  advantagesTitle: string;
  advantages: Advantage[];
  deliveryPaymentTitle: string;
  deliveryTitle: string;
  delivery: InfoItem[];
  paymentTitle: string;
  payment: InfoItem[];
  contacts: Contacts;
  footer: {
    about: string;
    rights: string;
  };
}

export interface Credentials {
  login: string;
  /** Stored as a lightweight hash — see lib/auth.ts. */
  passwordHash: string;
}

export interface AppData {
  version: number;
  products: Product[];
  content: SiteContent;
  credentials: Credentials;
}
