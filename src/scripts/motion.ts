const pulseAnimations = new WeakMap<HTMLElement, Animation>()

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function setupMotion(): void {
  document.querySelectorAll<HTMLElement>('[data-motion="pulse"]').forEach((element) => {
    if (prefersReducedMotion() || pulseAnimations.has(element)) return

    const animation = element.animate(
      [
        { transform: 'scale(1)', opacity: 0.65 },
        { transform: 'scale(2.4)', opacity: 0 },
      ],
      {
        duration: 1600,
        easing: 'cubic-bezier(0, 0, 0.2, 1)',
        iterations: Infinity,
      },
    )
    pulseAnimations.set(element, animation)
  })
}

document.addEventListener('astro:page-load', setupMotion)
setupMotion()
