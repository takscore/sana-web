// Same retry approach as scrollToFeatureCards: waits (up to ~30 animation
// frames) for the products section to exist, so it also works when called
// right as a navigation from another page is still completing.
export function scrollToProducts() {
  let attempts = 0;

  function tryScroll() {
    const el = document.getElementById('products-section');
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