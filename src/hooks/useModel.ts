import * as tf from "@tensorflow/tfjs";
import { createSignal } from "solid-js";

// GraphModel loader ---------------------------------------------------------
export function useModel(modelUrl: string) {
  const [model, setModel] = createSignal<tf.GraphModel | null>(null);

  (async () => {
    // Try WebGPU first when available
    if (navigator.gpu) {
      try {
        await tf.setBackend("webgpu");
        await tf.ready();
      } catch {
        await tf.setBackend("webgl");
      }
    } else {
      await tf.setBackend("webgl");
    }

    const m = await tf.loadGraphModel(modelUrl);
    setModel(m);
  })();

  return model;
}

// ---------------------------------------------------------------------------
// Classification helper with Worker / main-thread fallback
// ---------------------------------------------------------------------------

const inWorker = typeof OffscreenCanvas !== "undefined";
let worker: Worker | null = null;

if (inWorker) {
  // Lazily initialise the worker the first time it's needed
  worker = new Worker(new URL("../workers/classify.worker.ts", import.meta.url), {
    type: "module",
  });
}

export interface MoodResult {
  label: string;
  score: number;
}

async function runOnce(model: tf.GraphModel, video: HTMLVideoElement): Promise<MoodResult> {
  // Placeholder implementation – replace with real preprocessing & inference
  const tensor = tf.browser.fromPixels(video).resizeNearestNeighbor([224, 224]).expandDims();
  const prediction = (await model.executeAsync(tensor)) as tf.Tensor;
  const data = (await prediction.data()) as Float32Array;
  const score = data[0];
  return { label: score > 0.5 ? "happy" : "sad", score };
}

export async function classify(
  model: tf.GraphModel,
  video: HTMLVideoElement
): Promise<MoodResult> {
  if (inWorker && worker) {
    return new Promise<MoodResult>((resolve, reject) => {
      const handleMessage = (e: MessageEvent<MoodResult>) => {
        worker!.removeEventListener("message", handleMessage);
        resolve(e.data);
      };
      worker.addEventListener("message", handleMessage);
      worker.postMessage({ type: "classify", video }, [video]);
    });
  } else {
    return new Promise<MoodResult>((res) => {
      (requestIdleCallback || setTimeout)(async () => res(await runOnce(model, video)), {
        timeout: 30,
      } as any);
    });
  }
} 