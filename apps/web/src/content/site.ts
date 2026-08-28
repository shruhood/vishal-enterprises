/**
 * Centralized content for the enterprise website redesign.
 *
 * Nothing here is fabricated as fact about Vishal Enterprises' history,
 * client list, certifications or statistics. Metrics that are not
 * verified are intentionally expressed as qualitative trust indicators.
 * Imagery uses free industrial photography (Unsplash CDN) as a temporary,
 * swappable stand-in until real company photos are supplied — these URLs
 * are the single place to replace them.
 */

export const siteImages = {
  hero:
    "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=1600&q=70",
  about:
    "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1000&q=70",
  industries:
    "https://images.unsplash.com/photo-1565514020179-026b92b84bb6?auto=format&fit=crop&w=1200&q=70",
  cta:
    "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?auto=format&fit=crop&w=1600&q=70",
} as const;

export const capabilities = [
  {
    no: "01",
    title: "Skilled Manpower",
    desc: "Qualified personnel for technical and operational requirements across industrial settings.",
  },
  {
    no: "02",
    title: "Industrial Workforce",
    desc: "Workforce deployment for factories, plants and continuous industrial operations.",
  },
  {
    no: "03",
    title: "Project Staffing",
    desc: "Scalable teams for engineering, EPC, infrastructure and project environments.",
  },
  {
    no: "04",
    title: "Contract Workforce",
    desc: "Flexible workforce models aligned with operational and project requirements.",
  },
  {
    no: "05",
    title: "Workforce Management",
    desc: "Workforce coordination, deployment support, attendance and operational administration.",
  },
  {
    no: "06",
    title: "Rapid Mobilization",
    desc: "Fast workforce deployment for urgent and time-sensitive requirements.",
  },
] as const;

export const industries = [
  {
    title: "Manufacturing",
    desc: "Production, operations and maintenance workforce for shop-floor and plant environments.",
  },
  {
    title: "Engineering & EPC",
    desc: "Project-based technical manpower for engineering, procurement and construction scope.",
  },
  {
    title: "Infrastructure",
    desc: "Large-scale infrastructure workforce for roads, utilities and public works.",
  },
  {
    title: "Construction",
    desc: "Site-ready skilled and semi-skilled personnel for active construction projects.",
  },
  {
    title: "Energy",
    desc: "Technical and operational workforce for energy and utility operations.",
  },
  {
    title: "Logistics & Warehousing",
    desc: "Operational, warehouse and material-handling workforce for supply-chain operations.",
  },
] as const;

export const processSteps = [
  {
    no: "01",
    title: "Understand",
    desc: "We understand project scope, workforce requirements, location, skills and timelines.",
  },
  {
    no: "02",
    title: "Source",
    desc: "Candidates are identified against defined role and skill requirements.",
  },
  {
    no: "03",
    title: "Screen",
    desc: "Skills, experience and documentation are reviewed before mobilization.",
  },
  {
    no: "04",
    title: "Deploy",
    desc: "Selected personnel are mobilized to the required location on schedule.",
  },
  {
    no: "05",
    title: "Manage",
    desc: "Ongoing workforce coordination and operational support throughout engagement.",
  },
] as const;

export const safetyItems = [
  "Worker Verification",
  "Documentation",
  "Skill Verification",
  "Safety Orientation",
  "PPE Compliance",
  "Site Compliance",
  "Attendance Management",
  "Client Requirements",
] as const;

export const whyItems = [
  {
    title: "Workforce Reliability",
    desc: "Consistent workforce availability and operational support you can plan around.",
  },
  {
    title: "Skilled Personnel",
    desc: "Personnel aligned with defined role and skill requirements.",
  },
  {
    title: "Scalable Deployment",
    desc: "Ability to support changing project and workforce requirements.",
  },
  {
    title: "Faster Mobilization",
    desc: "Structured sourcing and deployment process reduces lead time.",
  },
  {
    title: "Site-Level Support",
    desc: "Ongoing coordination throughout the workforce engagement.",
  },
  {
    title: "Compliance Focus",
    desc: "Structured documentation and workforce processes.",
  },
] as const;

export const enterpriseAudiences = [
  "PROCUREMENT",
  "HR / HR OPERATIONS",
  "PLANT MANAGEMENT",
  "PROJECT MANAGEMENT",
  "EPC CONTRACTORS",
  "OPERATIONS",
] as const;

// Qualitative trust indicators — NOT fabricated statistics.
export const trustIndicators = [
  "Industrial Experience",
  "Multi-Sector Capability",
  "Scalable Deployment",
  "Project-Ready Workforce",
] as const;
