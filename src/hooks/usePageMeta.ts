import { useEffect } from "react";

/**
 * Give a route its own document title and description, and put the defaults
 * back on unmount. The site has no Helmet; index.html ships static meta, so a
 * route that should read well in tabs, search, and shared previews sets its own.
 */
export function usePageMeta(title: string, description: string) {
  useEffect(() => {
    const prevTitle = document.title;

    const setMeta = (selector: string, attr: string, name: string, content: string) => {
      let el = document.head.querySelector<HTMLMetaElement>(selector);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      const prev = el.getAttribute("content");
      el.setAttribute("content", content);
      return { el, prev };
    };

    document.title = title;
    const restorers = [
      setMeta('meta[name="description"]', "name", "description", description),
      setMeta('meta[property="og:title"]', "property", "og:title", title),
      setMeta('meta[property="og:description"]', "property", "og:description", description),
      setMeta('meta[name="twitter:title"]', "name", "twitter:title", title),
      setMeta('meta[name="twitter:description"]', "name", "twitter:description", description),
    ];

    return () => {
      document.title = prevTitle;
      restorers.forEach(({ el, prev }) => {
        if (prev !== null) el.setAttribute("content", prev);
      });
    };
  }, [title, description]);
}
