export function isHTMLElementInViewport<TElement extends HTMLElement>(element: TElement): boolean {
  const boundingClientRect = element.getBoundingClientRect();

  const isHTMLElementInViewport =
    boundingClientRect.top >= 0 &&
    boundingClientRect.left >= 0 &&
    boundingClientRect.bottom <= document.documentElement.clientHeight &&
    boundingClientRect.right <= document.documentElement.clientWidth;

  return isHTMLElementInViewport;
}
