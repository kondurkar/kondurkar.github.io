// useSEO — call at the top of any page component to set
// page-specific <title>, <meta description>, and og tags dynamically

export function useSEO({ title, description, url, type = "website" }) {
  const base = "https://kondurkar.github.io";
  const fullUrl = url ? `${base}${url}` : base;

  // Title
  document.title = title;

  // Helper to set/create meta tag
  const setMeta = (attr, value, content) => {
    let el = document.querySelector(`meta[${attr}="${value}"]`);
    if (!el) {
      el = document.createElement("meta");
      el.setAttribute(attr, value);
      document.head.appendChild(el);
    }
    el.setAttribute("content", content);
  };

  setMeta("name",     "description",       description);
  setMeta("property", "og:title",          title);
  setMeta("property", "og:description",    description);
  setMeta("property", "og:url",            fullUrl);
  setMeta("property", "og:type",           type);
  setMeta("name",     "twitter:title",     title);
  setMeta("name",     "twitter:description", description);

  // Canonical
  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement("link");
    canonical.setAttribute("rel", "canonical");
    document.head.appendChild(canonical);
  }
  canonical.setAttribute("href", fullUrl);
}
