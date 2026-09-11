import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { TOKEN_HASH } from "../generated/token-hash.generated";
import { applyOverrides, TokenCompilationError } from "../tokens/compiler";
import type { DtcgValue, TokenBundle } from "../tokens/types";
import {
  createDraft,
  loadDraft,
  rebaseDraft,
  saveDraft,
  type LocalTokenDraft,
} from "./draft";
import {
  applyDraftToRoot,
  clearDraftFromRoot,
  isDesignPreviewMessage,
  isLocalPreviewUrl,
} from "./runtime";

interface PreviewDraftContextValue {
  draft: LocalTokenDraft;
  /** The token manifest, once something has asked for it (see `loadBundle`);
   *  null on an ordinary visit. The workbench reads it through
   *  `usePreviewBundle`, which it may only do once `ready`. */
  bundle: TokenBundle | null;
  /** The manifest is loaded and any stored draft has been rebased on it. */
  ready: boolean;
  setOverride: (path: string, value: DtcgValue) => boolean;
  resetToken: (path: string) => void;
  resetCategory: (category: string) => void;
  resetAll: () => void;
  exitPreview: () => void;
  discarded: string[];
  previewActive: boolean;
  embedded: boolean;
}

const PreviewDraftContext = createContext<PreviewDraftContextValue | null>(null);

// The manifest is a hundred kilobytes of JavaScript that only the token
// workbench reads, yet it shipped in the main chunk of every visit because
// this provider, mounted at the app root, imported it statically. It is now
// fetched on demand: when the route is the design-system page, when the URL
// asks for a local preview, or when a stored draft has to be rebased on it.
// An ordinary visit never downloads it. Live editing is unchanged once it has
// arrived; until then the workbench waits on `ready`, and a stored draft is
// carried as it was saved, neither applied nor re-saved, so nothing is lost
// or written against the wrong token hash in the meantime.
const loadBundle = () =>
  import("../generated/token-manifest.generated").then((module) => module.tokenBundle);

export function PreviewProvider({
  children,
  bundle: preloadedBundle = null,
}: {
  children: ReactNode;
  /** A manifest the host already holds, so the context is ready on the first
   *  render instead of after the import. The app never passes one; the
   *  workbench and dialog tests do, to stay synchronous. */
  bundle?: TokenBundle | null;
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const [stored] = useState(() => loadDraft(window.localStorage));
  const [draft, setDraft] = useState<LocalTokenDraft>(() => stored ?? createDraft(TOKEN_HASH, {}));
  const [discarded, setDiscarded] = useState<string[]>([]);
  const [rebased, setRebased] = useState(!stored);
  const [bundle, setBundle] = useState<TokenBundle | null>(preloadedBundle);
  const [receivedOverrides, setReceivedOverrides] = useState<LocalTokenDraft["overrides"] | null>(null);
  const currentUrl = useMemo(
    () => new URL(`${location.pathname}${location.search}${location.hash}`, window.location.origin),
    [location.hash, location.pathname, location.search],
  );
  const urlPreviewActive = isLocalPreviewUrl(currentUrl);
  const urlEmbedded = currentUrl.searchParams.get("embedded") === "1";
  const activeOverrides = receivedOverrides ?? draft.overrides;
  const [previewSessionActive, setPreviewSessionActive] = useState(urlPreviewActive);
  const [embeddedSessionActive, setEmbeddedSessionActive] = useState(urlPreviewActive && urlEmbedded);
  const previewActive = urlPreviewActive || previewSessionActive;
  const embedded = urlEmbedded || embeddedSessionActive;
  const appliesLocally = location.pathname === "/design-system" || previewActive;
  const needsBundle = appliesLocally || stored !== null;
  const ready = bundle !== null && rebased;

  useEffect(() => {
    if (!needsBundle || bundle) return;
    let cancelled = false;
    loadBundle().then((loaded) => {
      if (!cancelled) setBundle(loaded);
    });
    return () => {
      cancelled = true;
    };
  }, [bundle, needsBundle]);

  useEffect(() => {
    if (!bundle || rebased || !stored) return;
    const next = rebaseDraft(stored, bundle);
    setDraft(next.draft);
    setDiscarded(next.discarded);
    setRebased(true);
  }, [bundle, rebased, stored]);

  useEffect(() => {
    if (urlPreviewActive) setPreviewSessionActive(true);
    if (urlPreviewActive && urlEmbedded) setEmbeddedSessionActive(true);
  }, [urlEmbedded, urlPreviewActive]);

  useEffect(() => {
    if (!previewSessionActive || urlPreviewActive && (!embeddedSessionActive || urlEmbedded)) return;
    const next = new URL(currentUrl);
    next.searchParams.set("design-preview", "local");
    if (embeddedSessionActive) next.searchParams.set("embedded", "1");
    navigate(`${next.pathname}${next.search}${next.hash}`, { replace: true, state: location.state });
  }, [currentUrl, embeddedSessionActive, location.state, navigate, previewSessionActive, urlEmbedded, urlPreviewActive]);

  useEffect(() => {
    if (!previewSessionActive) return;
    const preserveNativeNavigation = (event: MouseEvent) => {
      if (
        event.defaultPrevented || event.button !== 0 || event.metaKey ||
        event.ctrlKey || event.shiftKey || event.altKey
      ) return;
      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest("a[href]") as HTMLAnchorElement | null;
      if (!anchor || anchor.target || anchor.hasAttribute("download")) return;
      const destination = new URL(anchor.href, currentUrl);
      if (destination.origin !== currentUrl.origin) return;

      event.preventDefault();
      destination.searchParams.set("design-preview", "local");
      if (embeddedSessionActive) destination.searchParams.set("embedded", "1");
      navigate(`${destination.pathname}${destination.search}${destination.hash}`);
    };
    document.addEventListener("click", preserveNativeNavigation);
    return () => document.removeEventListener("click", preserveNativeNavigation);
  }, [currentUrl, embeddedSessionActive, navigate, previewSessionActive]);

  useEffect(() => {
    if (!rebased) return;
    saveDraft(window.localStorage, draft);
  }, [draft, rebased]);

  useLayoutEffect(() => {
    if (!bundle || !rebased) return;
    const root = document.documentElement;
    if (appliesLocally) applyDraftToRoot(root, bundle, activeOverrides);
    else clearDraftFromRoot(root, bundle);

    return () => clearDraftFromRoot(root, bundle);
  }, [activeOverrides, appliesLocally, bundle, rebased]);

  useEffect(() => {
    if (!embedded || !bundle) return;

    const receivePreview = (event: MessageEvent) => {
      if (
        event.origin !== window.location.origin ||
        event.source !== window.parent ||
        !isDesignPreviewMessage(event.data)
      ) return;

      try {
        applyOverrides(bundle, event.data.overrides);
      } catch (error) {
        if (error instanceof TokenCompilationError) return;
        throw error;
      }
      setReceivedOverrides(structuredClone(event.data.overrides));
    };

    window.addEventListener("message", receivePreview);
    return () => window.removeEventListener("message", receivePreview);
  }, [bundle, embedded]);

  // Every edit compiles against the manifest first, so nothing can happen to
  // the draft before it has arrived; the workbench never renders before then.
  const replaceOverrides = useCallback((overrides: LocalTokenDraft["overrides"]) => {
    if (!bundle) return false;
    applyOverrides(bundle, overrides);
    setReceivedOverrides(null);
    setDraft(createDraft(bundle.tokenHash, overrides));
    return true;
  }, [bundle]);

  const setOverride = useCallback((path: string, value: DtcgValue) => {
    const next = { ...draft.overrides, [path]: structuredClone(value) };
    try {
      return replaceOverrides(next);
    } catch (error) {
      if (error instanceof TokenCompilationError) return false;
      throw error;
    }
  }, [draft.overrides, replaceOverrides]);

  const resetToken = useCallback((path: string) => {
    const next = { ...draft.overrides };
    delete next[path];
    replaceOverrides(next);
  }, [draft.overrides, replaceOverrides]);

  const resetCategory = useCallback((category: string) => {
    replaceOverrides(Object.fromEntries(
      Object.entries(draft.overrides).filter(([path]) => path.split(".")[0] !== category),
    ));
  }, [draft.overrides, replaceOverrides]);

  const resetAll = useCallback(() => replaceOverrides({}), [replaceOverrides]);
  const exitPreview = useCallback(() => {
    setPreviewSessionActive(false);
    setEmbeddedSessionActive(false);
    setReceivedOverrides(null);
    if (bundle) clearDraftFromRoot(document.documentElement, bundle);
    const next = new URL(currentUrl);
    next.searchParams.delete("design-preview");
    next.searchParams.delete("embedded");
    navigate(`${next.pathname}${next.search}${next.hash}`, { replace: true });
  }, [bundle, currentUrl, navigate]);

  const context = useMemo<PreviewDraftContextValue>(() => ({
    draft,
    bundle,
    ready,
    setOverride,
    resetToken,
    resetCategory,
    resetAll,
    exitPreview,
    discarded,
    previewActive,
    embedded,
  }), [bundle, discarded, draft, embedded, exitPreview, previewActive, ready, resetAll, resetCategory, resetToken, setOverride]);

  return (
    <PreviewDraftContext.Provider value={context}>
      {children}
    </PreviewDraftContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function usePreviewDraft(): PreviewDraftContextValue {
  const context = useContext(PreviewDraftContext);
  if (!context) throw new Error("usePreviewDraft must be used within PreviewProvider.");
  return context;
}

/** The manifest, for the workbench. Only valid once the context is `ready`. */
// eslint-disable-next-line react-refresh/only-export-components
export function usePreviewBundle(): TokenBundle {
  const { bundle } = usePreviewDraft();
  if (!bundle) throw new Error("usePreviewBundle must not be used before the preview context is ready.");
  return bundle;
}
