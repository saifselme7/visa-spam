/** First tab stop on every page. */
export function SkipLink() {
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-200 focus:rounded-[10px] focus:bg-accent-500 focus:px-4 focus:py-2.5 focus:text-sm focus:font-medium focus:text-void-950"
    >
      Skip to main content
    </a>
  );
}
