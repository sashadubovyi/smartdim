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
