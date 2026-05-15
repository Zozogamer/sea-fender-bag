const planSection = document.getElementById('planScroll');
const planTrack = document.getElementById('planTrack');
const planViewer = document.querySelector('.mechanism-plan__viewer');

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function updatePlanPan() {
  if (!planSection || !planTrack || !planViewer) return;

  const rect = planSection.getBoundingClientRect();
  const scrollable = planSection.offsetHeight - window.innerHeight;
  const progress = scrollable > 0 ? clamp(-rect.top / scrollable, 0, 1) : 0;
  const maxShift = Math.max(planTrack.scrollWidth - planViewer.clientWidth, 0);

  planTrack.style.transform = `translate3d(${-maxShift * progress}px, 0, 0)`;
}

window.addEventListener('scroll', updatePlanPan, { passive: true });
window.addEventListener('resize', updatePlanPan);
window.addEventListener('load', updatePlanPan);
updatePlanPan();
