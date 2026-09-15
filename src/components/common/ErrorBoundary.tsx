import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * Last line of defence against a blank screen. Technical details go to the
 * console for developers; the user sees a plain recovery message.
 */
export class ErrorBoundary extends Component<Props, State> {
  override state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  override componentDidCatch(error: Error, info: ErrorInfo): void {
    // eslint-disable-next-line no-console
    console.error('[VOIDCARD] Unhandled UI error', error, info.componentStack);
  }

  override render(): ReactNode {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="flex min-h-dvh items-center justify-center px-6">
        <div className="max-w-md text-center">
          <p className="font-mono text-[12px] tracking-[0.2em] text-void-500 uppercase">
            Unexpected error
          </p>
          <h1 className="mt-4 text-2xl">Something broke on this page</h1>
          <p className="mt-3 text-[14px] leading-relaxed text-void-300">
            The rest of the store is still fine. Reloading usually clears it — if it keeps
            happening, let support know what you were doing.
          </p>
          <button
            type="button"
            onClick={() => {
              window.location.reload();
            }}
            className="mt-7 inline-flex h-11 items-center rounded-[11px] bg-accent-500 px-5 text-sm font-medium text-void-950"
          >
            Reload the page
          </button>
        </div>
      </div>
    );
  }
}
