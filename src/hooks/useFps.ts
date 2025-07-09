import { createSignal, onCleanup } from "solid-js";

export function useFps() {
  const [fps, setFps] = createSignal(0);
  let frames = 0;
  let last = performance.now();

  // --- Detect the actual panel refresh rate once -------------------------
  let Hz = 60;
  (function measureRefresh() {
    const t0 = performance.now();
    let count = 0;
    const sample = (t: number) => {
      count++;
      if (t - t0 < 250) {
        requestAnimationFrame(sample);
      } else {
        Hz = count * 4; // extrapolate to ~1 s sample
        schedule();     // re-schedule with the correct API
      }
    };
    requestAnimationFrame(sample);
  })();

  // --- Frame accounting --------------------------------------------------
  const tick = () => {
    frames++;
    const now = performance.now();
    if (now - last >= 1000) {
      setFps(frames);
      (window as any).__fps = frames;
      frames = 0;
      last = now;
    }
  };

  // --- Scheduler ---------------------------------------------------------
  let loopId: any;
  const schedule = () => {
    if (Hz === 120) {
      loopId = requestAnimationFrame(function rafLoop() {
        tick();
        loopId = requestAnimationFrame(rafLoop);
      });
    } else {
      loopId = setInterval(() => tick(), 1000 / 120);
    }
  };

  schedule();

  // --- Cleanup -----------------------------------------------------------
  onCleanup(() => {
    if (Hz === 120) {
      cancelAnimationFrame(loopId);
    } else {
      clearInterval(loopId);
    }
  });

  return fps;
} 