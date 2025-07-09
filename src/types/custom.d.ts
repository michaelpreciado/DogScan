// Minimal type stubs so compilation succeeds without full deps

declare module "@tensorflow/tfjs" {
  export type TFTensor = any;
  export type GraphModel = any;
  export function setBackend(name: string): Promise<void>;
  export function ready(): Promise<void>;
  export namespace browser {
    function fromPixels(video: HTMLVideoElement): any;
  }
  export interface Tensor {
    resizeNearestNeighbor(shape: [number, number]): Tensor;
    expandDims(): Tensor;
    data(): Promise<Float32Array>;
  }
  export function loadGraphModel(url: string): Promise<GraphModel>;
}

interface Navigator {
  gpu?: unknown;
}

// requestIdleCallback stub for non-supporting browsers / types
interface IdleDeadline {
  readonly didTimeout: boolean;
  timeRemaining(): DOMHighResTimeStamp;
}

type IdleCallbackHandle = number;

declare function requestIdleCallback(
  callback: (deadline: IdleDeadline) => void,
  options?: { timeout: number }
): IdleCallbackHandle;

declare function cancelIdleCallback(handle: IdleCallbackHandle): void; 