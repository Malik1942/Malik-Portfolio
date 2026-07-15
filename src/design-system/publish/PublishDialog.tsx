import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { createPortal } from "react-dom";
import { tokenBundle, tokenSourceCommit } from "../generated/token-manifest.generated";
import { usePreviewDraft } from "../preview/PreviewProvider";
import { applyOverrides, TokenCompilationError } from "../tokens/compiler";
import {
  PublishError,
  publishTokenDraft,
  type PublishRequest,
  type PublishSuccess,
} from "./client";

type PublishFunction = typeof publishTokenDraft;

interface PublishDialogProps {
  open: boolean;
  onClose: () => void;
  publish?: PublishFunction;
  baseCommitSha?: string;
  baseTokenHash?: string;
}

interface DiffRow {
  path: string;
  production: string;
  draft: string;
}

export function PublishDialog({
  open,
  onClose,
  publish = publishTokenDraft,
  baseCommitSha = tokenSourceCommit,
  baseTokenHash = tokenBundle.tokenHash,
}: PublishDialogProps) {
  const { bundle, draft } = usePreviewDraft();
  const [password, setPassword] = useState("");
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [acknowledged, setAcknowledged] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<PublishError | null>(null);
  const [result, setResult] = useState<PublishSuccess | null>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const successLinkRef = useRef<HTMLAnchorElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const requestVersionRef = useRef(0);
  const submittingRef = useRef(false);
  const abortRef = useRef<AbortController | null>(null);

  const diffRows = useMemo<DiffRow[] | null>(() => {
    const paths = Object.keys(draft.overrides).sort();
    if (paths.length === 0) return [];
    try {
      const compiled = applyOverrides(bundle, draft.overrides);
      const productionTokens = new Map(bundle.tokens.map((token) => [token.path, token]));
      const draftTokens = new Map(compiled.tokens.map((token) => [token.path, token]));
      return paths.map((path) => ({
        path,
        production: productionTokens.get(path)!.cssValue,
        draft: draftTokens.get(path)!.cssValue,
      }));
    } catch (caught) {
      if (caught instanceof TokenCompilationError) return null;
      throw caught;
    }
  }, [bundle, draft.overrides]);

  const commitProvenanceValid = isPublishableCommit(baseCommitSha);
  const tokenProvenanceValid = /^[0-9a-f]{8}$/.test(baseTokenHash) &&
    draft.baseTokenHash === baseTokenHash;
  const provenanceValid = commitProvenanceValid && tokenProvenanceValid;
  const titleValid = title.trim().length >= 8 && title.trim().length <= 120;
  const summaryValid = summary.trim().length >= 12 && summary.trim().length <= 2000;
  const draftValid = diffRows !== null && diffRows.length > 0;
  const canSubmit = password.length > 0 && titleValid && summaryValid &&
    acknowledged && draftValid && provenanceValid && !pending;

  const closeDialog = useCallback(() => {
    requestVersionRef.current += 1;
    abortRef.current?.abort();
    abortRef.current = null;
    submittingRef.current = false;
    setPending(false);
    setPassword("");
    setAcknowledged(false);
    setError(null);
    setResult(null);
    onClose();
  }, [onClose]);

  useEffect(() => {
    setAcknowledged(false);
  }, [draft.overrides]);

  useEffect(() => {
    if (open && result) successLinkRef.current?.focus();
  }, [open, result]);

  useEffect(() => () => {
    requestVersionRef.current += 1;
    abortRef.current?.abort();
    abortRef.current = null;
    submittingRef.current = false;
  }, []);

  useEffect(() => {
    if (!open) return;
    returnFocusRef.current = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    passwordRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeDialog();
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = getFocusableElements(dialogRef.current);
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!dialogRef.current?.contains(document.activeElement)) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
        return;
      }
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      returnFocusRef.current?.focus();
      returnFocusRef.current = null;
    };
  }, [closeDialog, open]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit || submittingRef.current) return;

    submittingRef.current = true;
    setPending(true);
    setError(null);
    const requestVersion = requestVersionRef.current + 1;
    requestVersionRef.current = requestVersion;
    const controller = new AbortController();
    abortRef.current = controller;
    const request: PublishRequest = {
      password,
      baseCommitSha,
      baseTokenHash,
      title: title.trim(),
      summary: summary.trim(),
      overrides: structuredClone(draft.overrides),
    };

    try {
      const publishPromise = publish(request, { signal: controller.signal });
      setPassword("");
      request.password = "";
      const nextResult = await publishPromise;
      if (requestVersionRef.current !== requestVersion) return;
      setPassword("");
      setResult(nextResult);
    } catch (caught) {
      if (requestVersionRef.current !== requestVersion || isAbortError(caught)) return;
      setPassword("");
      setError(caught instanceof PublishError
        ? caught
        : new PublishError(0, "request_failed", "The publish request could not be completed."));
    } finally {
      if (requestVersionRef.current === requestVersion) {
        abortRef.current = null;
        submittingRef.current = false;
        setPending(false);
      }
    }
  };

  if (!open) return null;

  return createPortal((
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-lightbox-backdrop px-4 py-6 sm:px-6 sm:py-10">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="publish-dialog-title"
        aria-describedby="publish-dialog-description"
        className="mx-auto w-full max-w-[720px] rounded-lg border border-border bg-popover p-5 shadow-2xl sm:p-8"
      >
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="text-[10px] uppercase tracking-[0.22em] text-foreground/44 text-body">Admin · publish only</p>
            <h2 id="publish-dialog-title" className="mt-3 text-3xl font-light tracking-[-0.025em] text-foreground text-display sm:text-4xl">Review token publish</h2>
            <p id="publish-dialog-description" className="mt-3 max-w-[560px] text-sm leading-relaxed text-foreground/60 text-body">Your local editing tools stay public. This credential authorizes one server-side request to open a GitHub pull request.</p>
          </div>
          <button
            type="button"
            onClick={closeDialog}
            aria-label="Close publish review"
            className="min-h-[44px] min-w-[44px] rounded-md border border-border text-xl text-foreground/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>

        {result ? (
          <div role="status" className="mt-8 rounded-lg border border-border bg-background p-5">
            <p className="text-lg text-foreground text-body">Pull request #{result.pullRequestNumber} is ready.</p>
            <p className="mt-2 text-sm text-foreground/60 text-body">{formatTokenCount(result.changedTokens.length)} on <code className="break-all">{result.branch}</code>.</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a
                ref={successLinkRef}
                href={result.pullRequestUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[44px] items-center rounded-md bg-foreground px-4 text-sm text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Open pull request #{result.pullRequestNumber}
              </a>
              <button type="button" onClick={closeDialog} className="min-h-[44px] rounded-md border border-border px-4 text-sm text-foreground/72">Dismiss</button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-7">
            {!commitProvenanceValid ? (
              <p role="alert" className="rounded-md border border-destructive/50 p-3 text-sm text-foreground/75 text-body">This build has no publishable Git commit provenance.</p>
            ) : null}
            {commitProvenanceValid && !tokenProvenanceValid ? (
              <p role="alert" className="rounded-md border border-destructive/50 p-3 text-sm text-foreground/75 text-body">This build has no publishable token-bundle provenance.</p>
            ) : null}

            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block text-sm text-foreground/72 text-body">
                Pull request title
                <input
                  aria-label="Pull request title"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  maxLength={122}
                  aria-describedby="publish-title-guidance"
                  className="mt-2 min-h-[44px] w-full rounded-md border border-border bg-background px-3 text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
                <span id="publish-title-guidance" className="mt-1 block text-xs text-foreground/44">8–120 characters after trimming</span>
              </label>
              <label className="block text-sm text-foreground/72 text-body">
                Publish password
                <input
                  ref={passwordRef}
                  aria-label="Publish password"
                  type="password"
                  autoComplete="off"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="mt-2 min-h-[44px] w-full rounded-md border border-border bg-background px-3 text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
                <span className="mt-1 block text-xs text-foreground/44">Held only for this request</span>
              </label>
            </div>

            <label className="block text-sm text-foreground/72 text-body">
              Rationale
              <textarea
                aria-label="Rationale"
                value={summary}
                onChange={(event) => setSummary(event.target.value)}
                maxLength={2002}
                rows={4}
                aria-describedby="publish-summary-guidance"
                className="mt-2 w-full resize-y rounded-md border border-border bg-background p-3 text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <span id="publish-summary-guidance" className="mt-1 block text-xs text-foreground/44">12–2000 characters after trimming</span>
            </label>

            <section aria-labelledby="publish-diff-title">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <h3 id="publish-diff-title" className="text-lg text-foreground text-body">Final token diff</h3>
                  <p className="mt-1 text-sm text-foreground/52 text-body">Only direct edits are submitted; aliases are resolved again on the server.</p>
                </div>
                <span className="font-mono text-xs text-foreground/55">{diffRows?.length ?? 0}</span>
              </div>
              {!draftValid ? (
                <p className="mt-4 rounded-md border border-destructive/50 p-4 text-sm text-foreground/70 text-body">Make at least one valid token change before publishing.</p>
              ) : (
                <ul className="mt-4 space-y-3">
                  {diffRows.map((row) => (
                    <li key={row.path} data-testid={`publish-diff-${row.path}`} className="rounded-md border border-border/60 p-4">
                      <code className="block break-all text-xs text-foreground/85">{row.path}</code>
                      <div className="mt-3 grid gap-3 text-xs sm:grid-cols-2">
                        <p><span className="block text-foreground/44">Production</span><code className="mt-1 block overflow-x-auto whitespace-nowrap text-foreground/65">{row.production}</code></p>
                        <p><span className="block text-foreground/44">Draft</span><code className="mt-1 block overflow-x-auto whitespace-nowrap text-foreground">{row.draft}</code></p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <label className="flex items-start gap-3 rounded-md border border-border/60 p-4 text-sm leading-relaxed text-foreground/70 text-body">
              <input
                type="checkbox"
                checked={acknowledged}
                onChange={(event) => setAcknowledged(event.target.checked)}
                className="mt-1 h-4 w-4 accent-foreground"
              />
              <span>I reviewed this final diff and want to open a pull request for Vercel preview review.</span>
            </label>

            {error ? (
              <div role="alert" className="rounded-md border border-destructive/50 p-4 text-sm leading-relaxed text-foreground/75 text-body">
                <p>{error.message}</p>
                {error.recoveryBranch ? <p className="mt-2">A token commit was created on branch <code className="break-all">{error.recoveryBranch}</code>. It can be recovered in GitHub without republishing the token commit.</p> : null}
              </div>
            ) : null}

            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border/60 pt-5">
              <p aria-live="polite" className="text-xs text-foreground/50 text-body">{pending ? "Opening pull request…" : "Nothing writes directly to main."}</p>
              <button
                type="submit"
                disabled={!canSubmit}
                className="min-h-[44px] rounded-md bg-foreground px-5 text-sm text-background disabled:cursor-not-allowed disabled:opacity-35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {pending ? "Publishing…" : "Open publish PR"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  ), document.body);
}

function isPublishableCommit(value: string): boolean {
  return /^[0-9a-f]{40}$/.test(value);
}

function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === "AbortError" ||
    error !== null && typeof error === "object" && "name" in error && error.name === "AbortError";
}

function formatTokenCount(count: number): string {
  return `${count} changed ${count === 1 ? "token" : "tokens"}`;
}

function getFocusableElements(root: HTMLElement | null): HTMLElement[] {
  if (!root) return [];
  return Array.from(root.querySelectorAll<HTMLElement>(
    'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
  )).filter((element) => !element.hasAttribute("hidden"));
}
