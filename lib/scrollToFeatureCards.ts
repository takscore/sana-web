// Waits (across up to ~30 animation frames) for the feature-cards section
// to exist in the DOM before scrolling to it. This matters because this
// helper can be called from pages other than the homepage — the caller
// triggers a route change to "/" first, and that navigation needs a moment
// to complete before the target element is actually on the page.
export function scrollToFeatureCards() {
  let attempts = 0;

  function tryScroll() {
    const el = document.getElementById('feature-cards');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    if (attempts < 30) {
      attempts++;
      requestAnimationFrame(tryScroll);
    }
  }

  requestAnimationFrame(tryScroll);
}