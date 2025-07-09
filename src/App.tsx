/** @jsxImportSource solid-js */
import { createSignal } from "solid-js";
import { CameraInput } from "./components/CameraInput";

export default function App() {
  const [result, setResult] = createSignal<any>(null);

  return (
    <main class="min-h-screen flex flex-col items-center justify-center gap-4 p-4 text-white bg-black">
      <h1 class="text-3xl font-bold">DogScan</h1>
      <CameraInput modelUrl="/model/model.json" onResult={setResult} />
      {result() && (
        <pre class="text-sm bg-gray-800 p-2 rounded">
          {JSON.stringify(result(), null, 2)}
        </pre>
      )}
    </main>
  );
} 