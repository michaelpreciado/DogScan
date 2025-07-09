export function addPassiveListener<K extends keyof HTMLElementEventMap>(
  target: HTMLElement | Document | Window,
  type: K,
  listener: (ev: HTMLElementEventMap[K]) => any,
  options: AddEventListenerOptions = {}
) {
  const opts = { passive: true, ...options } as AddEventListenerOptions;
  target.addEventListener(type, listener as EventListener, opts);
  return () => target.removeEventListener(type, listener as EventListener, opts);
} 