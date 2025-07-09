declare module "solid-js" {
  export function createSignal<T>(value: T): [() => T, (v: T) => void];
  export function onMount(fn: () => void): void;
  export function onCleanup(fn: () => void): void;
  export function createEffect(fn: () => void): void;
}

declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
} 