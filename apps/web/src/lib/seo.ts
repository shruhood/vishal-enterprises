import { useEffect } from "react";

interface SeoOptions {
  title: string;
  description?: string;
}

/**
 * Minimal SEO hook for the app shell phase — sets document title and meta
 * description per page. Will be extended with Open Graph tags, canonical
 * URLs and structured data once the content/CRM layer exists.
 */
export function useSeo({ title, description }: SeoOptions) {
  useEffect(() => {
    document.title = `${title} | Vishal Enterprises`;

    if (description) {
      let tag = document.querySelector('meta[name="description"]');
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("name", "description");
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", description);
    }
  }, [title, description]);
}
