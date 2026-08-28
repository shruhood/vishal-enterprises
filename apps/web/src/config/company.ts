/**
 * Centralized company configuration.
 *
 * Nothing here is fabricated — every real-world detail (phone, address,
 * registration numbers, etc.) is a placeholder until Vishal Enterprises
 * supplies the actual value. Components must read from this file rather
 * than hard-coding company facts, so a single edit updates the whole site.
 *
 * TODO: replace all bracketed placeholders before production launch.
 */

export const companyConfig = {
  name: "Vishal Enterprises",
  tagline: "Reliable Workforce. Responsible Management.",

  contact: {
    phone: "[COMPANY_PHONE]",
    whatsapp: "[COMPANY_WHATSAPP]",
    email: "[COMPANY_EMAIL]",
    address: "[OFFICE_ADDRESS]",
  },

  legal: {
    registration: "[GOVERNMENT_REGISTRATION_DETAILS]",
  },

  brand: {
    primaryColor: "orange",
  },

  serviceAreas: ["Daman", "Vapi", "Bhilad", "Silvassa", "Nearby Industrial Areas"] as const,

  messaging: {
    headline: "Reliable Workforce Solutions for Industry",
    subheadline:
      "Skilled, semi-skilled and unskilled manpower solutions backed by experienced management and continuous workforce support.",
    primaryCta: "Request Manpower",
    secondaryCta: "Register as Worker",
  },

  serviceCategories: {
    skilled: [
      "Machine Operators",
      "CNC/VMC Operators",
      "Electricians",
      "Fitters",
      "Welders",
      "Technicians",
      "Maintenance Workers",
    ],
    semiSkilled: [
      "Production Assistants",
      "Packaging Workers",
      "Warehouse Workers",
      "Material Handling Workers",
    ],
    unskilled: [
      "General Labour",
      "Production Helpers",
      "Packaging Helpers",
      "Loading/Unloading Workers",
      "Utility Workers",
      "Housekeeping Workers",
    ],
  },

  // Potential workforce-solution categories, not a client list.
  industries: [
    "Pharmaceuticals",
    "Chemicals",
    "Engineering",
    "Manufacturing",
    "Textile",
    "Plastic",
    "Packaging",
    "Food Processing",
    "FMCG",
    "Warehousing",
    "Logistics",
    "Automobile",
    "Auto Components",
    "Metal",
    "Electrical",
    "Fabrication",
    "Construction",
    "Industrial Maintenance",
    "Industrial Housekeeping",
    "Facility Management",
  ],
} as const;

export type CompanyConfig = typeof companyConfig;
