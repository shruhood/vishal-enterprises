import { useEffect } from "react";

interface SeoOptions {
  title: string;
  description?: string;
  /** Path-only, e.g. "/about". Omit for the homepage. */
  path?: string;
}

const SITE = "https://vishal-enterprises-web-2ha.pages.dev";
const SITE_NAME = "Vishal Enterprises";

function ensureMeta(selector: string, attr: "name" | "property", key: string): HTMLElement {
  let tag = document.head.querySelector<HTMLElement>(selector);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attr, key);
    document.head.appendChild(tag);
  }
  return tag;
}

function setMeta(attr: "name" | "property", key: string, content: string) {
  const tag = ensureMeta(`meta[${attr}="${key}"]`, attr, key);
  tag.setAttribute("content", content);
}

function setCanonical(path: string) {
  const url = path === "/" ? SITE + "/" : SITE + path;
  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    document.head.appendChild(link);
  }
  link.setAttribute("href", url);
}

function injectJsonLd() {
  if (document.getElementById("ve-jsonld")) return;
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: SITE_NAME,
        url: SITE,
        description:
          "Industrial workforce and manpower solutions for manufacturing, engineering, EPC, infrastructure and construction organizations.",
        sameAs: [],
      },
      {
        "@type": "WebSite",
        name: SITE_NAME,
        url: SITE,
      },
      {
        "@type": "Service",
        name: "Industrial Workforce & Manpower Solutions",
        serviceType: "Workforce / Manpower Supply",
        provider: { "@type": "Organization", name: SITE_NAME, url: SITE },
        areaServed: "India",
      },
    ],
  };
  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.id = "ve-jsonld";
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
}

/**
 * Per-page SEO: title, meta description, canonical URL, and site-wide
 * JSON-LD structured data (injected once). Open Graph / Twitter tags and
 * favicon live in index.html; this hook keeps them consistent per route.
 */
export function useSeo({ title, description, path = "/" }: SeoOptions) {
  useEffect(() => {
    document.title = `${title} | ${SITE_NAME}`;
    if (description) setMeta("name", "description", description);
    setCanonical(path);
    injectJsonLd();
  }, [title, description, path]);
}
