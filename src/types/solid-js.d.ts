declare module 'solid-js' {
  export function createSignal<T>(initial: T): [() => T, (v: T) => void];
  export function onCleanup(fn: () => void): void;
  export function onMount(fn: () => void): void;

  // minimal jsx types to satisfy TSX parsing
  export namespace JSX {
    interface IntrinsicElements {
      [tag: string]: any;
    }
  }
} 