function easeInOutQuad(t: number): number {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

function smoothScrollToElement(
  element: HTMLElement,
  scrollTop: number,
  duration: number = 500,
): void {
  const start = element.scrollTop;
  const change = scrollTop - start;
  const startTime = performance.now();
  function animateScroll(timestamp: number): void {
    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / duration, 1); // 0 ~ 1
    const ease = easeInOutQuad(progress);
    element.scrollTop = start + change * ease;
    if (progress < 1) {
      requestAnimationFrame(animateScroll);
    }
  }
  requestAnimationFrame(animateScroll);
}

export default smoothScrollToElement;
