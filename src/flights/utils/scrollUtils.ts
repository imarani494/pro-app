const SCROLL_OFFSET = 20;
const SCROLL_DELAY = 150;
const SCROLL_DURATION = 600;
const SCROLL_BEHAVIOR: ScrollBehavior = 'smooth';

const easeInOutQuint = (t: number): number => {
  return t < 0.5
    ? 16 * t * t * t * t * t
    : 1 - Math.pow(-2 * t + 2, 5) / 2;
};

const smoothScrollTo = (
  element: HTMLElement,
  targetPosition: number,
  duration: number = SCROLL_DURATION
): void => {
  const startPosition = element.scrollTop;
  const distance = targetPosition - startPosition;
  let startTime: number | null = null;

  const animateScroll = (currentTime: number) => {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);
    const easedProgress = easeInOutQuint(progress);
    const currentPosition = startPosition + distance * easedProgress;
    
    element.scrollTop = currentPosition;

    if (progress < 1) {
      requestAnimationFrame(animateScroll);
    }
  };

  requestAnimationFrame(animateScroll);
};

export const scrollToElement = (
  targetElementId: string,
  scrollContainer: HTMLElement | null,
  offset: number = SCROLL_OFFSET,
  useCustomAnimation: boolean = true
): void => {
  if (!scrollContainer) return;

  const targetElement = document.getElementById(targetElementId);
  if (!targetElement) return;

  const containerRect = scrollContainer.getBoundingClientRect();
  const elementRect = targetElement.getBoundingClientRect();
  const scrollTop = scrollContainer.scrollTop;
  const targetScroll = Math.max(0, scrollTop + elementRect.top - containerRect.top - offset);

  if (useCustomAnimation) {
    smoothScrollTo(scrollContainer, targetScroll);
  } else {
    scrollContainer.scrollTo({
      top: targetScroll,
      behavior: SCROLL_BEHAVIOR,
    });
  }
};

export const scrollToElementWithDelay = (
  targetElementId: string,
  scrollContainer: HTMLElement | null,
  delay: number = SCROLL_DELAY
): void => {
  setTimeout(() => {
    scrollToElement(targetElementId, scrollContainer);
  }, delay);
};

export const findScrollContainer = (selector: string): HTMLElement | null => {
  return document.querySelector(selector) as HTMLElement | null;
};

