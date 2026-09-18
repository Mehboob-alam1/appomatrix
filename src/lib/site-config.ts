export const siteConfig = {
  name: "Appo Matrix",
  tagline: "Software that ships. Teams that care.",
  description:
    "Appo Matrix is a software development agency in Gilgit-Baltistan, Pakistan, building web, mobile, and SaaS products for global clients.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://appomatrix.com",
  locale: "en_US",
  contact: {
    email: "hello@appomatrix.com",
    phone: "+92 300 0000000",
    whatsapp: "923000000000",
    address: "Gilgit, Gilgit-Baltistan, Pakistan",
  },
  social: {
    linkedin: "https://linkedin.com/company/appomatrix",
    github: "https://github.com/appomatrix",
    twitter: "https://twitter.com/appomatrix",
  },
  calendlyUrl: process.env.NEXT_PUBLIC_CALENDLY_URL ?? "",
  analytics: {
    plausibleDomain: process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN ?? "",
    gaMeasurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "",
  },
  nav: [
    { label: "Services", href: "/services" },
    { label: "Work", href: "/work" },
    { label: "Blog", href: "/blog" },
    { label: "About", href: "/about" },
    { label: "Testimonials", href: "/testimonials" },
    { label: "Contact", href: "/contact" },
  ],
  stats: [
    { label: "Projects delivered", value: "120+" },
    { label: "Years building software", value: "8+" },
    { label: "Countries served", value: "15+" },
    { label: "Client retention", value: "94%" },
  ],
} as const;
