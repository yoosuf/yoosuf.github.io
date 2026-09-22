const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

function animate(element: Element, keyframes: Keyframe[], options: KeyframeAnimationOptions): void {
  if (reducedMotion || !('animate' in element)) return
  element.animate(keyframes, options)
}

function setupMotion(): void {
  const firstLoad = document.documentElement.classList.contains('yt-first')
  const main = document.getElementById('site-main')
  if (firstLoad && main) {
    animate(main, [{ opacity: 0 }, { opacity: 1 }], { duration: 450, easing: 'ease-out', fill: 'both' })
  }

  document.querySelectorAll<HTMLElement>('[data-motion="pulse"]').forEach((element) => {
    if (!reducedMotion) {
      element.animate([{ transform: 'scale(1)', opacity: 0.75 }, { transform: 'scale(2)', opacity: 0 }], {
        duration: 1200,
        easing: 'cubic-bezier(0, 0, 0.2, 1)',
        iterations: Infinity,
      })
    }
  })
}

document.addEventListener('astro:page-load', setupMotion)
setupMotion()
