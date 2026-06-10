// Keeps project cards usable when an image path is missing or fails to load.
export function useFallbackProjectImage(event) {
  event.currentTarget.src = '/silh.png';
}
