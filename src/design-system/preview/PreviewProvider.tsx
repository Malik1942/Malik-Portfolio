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
import { tokenBundle } from "../generated/token-manifest.generated";
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
  bundle: TokenBundle;
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

function readInitialDraft(): { draft: LocalTokenDraft; discarded: string[] } {
  const stored = loadDraft(window.localStorage);
  if (!stored) return { draft: createDraft(tokenBundle.tokenHash, {}), discarded: [] };
  return rebaseDraft(stored, tokenBundle);
}

export function PreviewProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [initial] = useState(readInitialDraft);
  const [draft, setDraft] = useState(initial.draft);
  const [receivedOverrides, setReceivedOverrides] = useState<LocalTokenDraft["overrides"] | null>(null);
  const discarded = initial.discarded;
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
    saveDraft(window.localStorage, draft);
  }, [draft]);

  useLayoutEffect(() => {
    const root = document.documentElement;
    if (appliesLocally) applyDraftToRoot(root, tokenBundle, activeOverrides);
    else clearDraftFromRoot(root, tokenBundle);

    return () => clearDraftFromRoot(root, tokenBundle);
  }, [activeOverrides, appliesLocally]);

  useEffect(() => {
    if (!embedded) return;

    const receivePreview = (event: MessageEvent) => {
      if (
        event.origin !== window.location.origin ||
        event.source !== window.parent ||
        !isDesignPreviewMessage(event.data)
      ) return;

      try {
        applyOverrides(tokenBundle, event.data.overrides);
      } catch (error) {
        if (error instanceof TokenCompilationError) return;
        throw error;
      }
      setReceivedOverrides(structuredClone(event.data.overrides));
    };

    window.addEventListener("message", receivePreview);
    return () => window.removeEventListener("message", receivePreview);
  }, [embedded]);

  const replaceOverrides = useCallback((overrides: LocalTokenDraft["overrides"]) => {
    applyOverrides(tokenBundle, overrides);
    setReceivedOverrides(null);
    setDraft(createDraft(tokenBundle.tokenHash, overrides));
  }, []);

  const setOverride = useCallback((path: string, value: DtcgValue) => {
    const next = { ...draft.overrides, [path]: structuredClone(value) };
    try {
      replaceOverrides(next);
      return true;
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
    clearDraftFromRoot(document.documentElement, tokenBundle);
    const next = new URL(currentUrl);
    next.searchParams.delete("design-preview");
    next.searchParams.delete("embedded");
    navigate(`${next.pathname}${next.search}${next.hash}`, { replace: true });
  }, [currentUrl, navigate]);

  const context = useMemo<PreviewDraftContextValue>(() => ({
    draft,
    bundle: tokenBundle,
    setOverride,
    resetToken,
    resetCategory,
    resetAll,
    exitPreview,
    discarded,
    previewActive,
    embedded,
  }), [discarded, draft, embedded, exitPreview, previewActive, resetAll, resetCategory, resetToken, setOverride]);

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
