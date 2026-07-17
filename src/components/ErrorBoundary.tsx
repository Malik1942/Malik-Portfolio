import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

// Catches render-time errors in any route so a single broken page degrades to a
// friendly recovery screen instead of a blank white page.
class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error("Route error:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-5 px-6 text-center">
          <p className="text-sm uppercase tracking-eyebrow text-foreground/72 font-medium">
            Something went wrong
          </p>
          <p className="text-sm text-foreground/55 max-w-[360px] leading-relaxed">
            This page hit an unexpected error. Try reloading, or head back home.
          </p>
          <a
            href="/"
            className="text-sm text-foreground/72 hover:text-foreground transition-colors underline underline-offset-4"
          >
            ← Back home
          </a>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
