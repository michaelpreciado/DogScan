// A very light placeholder worker for classification. Replace with real model logic.
import * as tf from "@tensorflow/tfjs";

let model: tf.GraphModel | null = null;

self.addEventListener("message", async (e: MessageEvent) => {
  const { type, video, modelUrl } = e.data as any;

  if (type === "load" && modelUrl) {
    model = await tf.loadGraphModel(modelUrl);
    (self as any).postMessage({ type: "loaded" });
  }

  if (type === "classify" && model && video) {
    const tensor = tf.browser.fromPixels(video).resizeNearestNeighbor([224, 224]).expandDims();
    const prediction = (await model.executeAsync(tensor)) as tf.Tensor;
    const data = (await prediction.data()) as Float32Array;
    const score = data[0];
    (self as any).postMessage({ label: score > 0.5 ? "happy" : "sad", score });
  }
}); 