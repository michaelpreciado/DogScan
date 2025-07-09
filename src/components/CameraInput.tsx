/** @jsxImportSource solid-js */
import { createSignal, onCleanup, onMount } from "solid-js";
import { classify, MoodResult } from "../hooks/useModel";
import React from "react";

interface CameraInputProps {
  onResult: (result: MoodResult) => void;
  modelUrl: string;
}

export function CameraInput(props: CameraInputProps) {
  let videoEl: HTMLVideoElement | undefined;
  const [ready, setReady] = createSignal(false);

  onMount(async () => {
    try {
      // Prefer 480p to reduce GPU bandwidth on mobile Safari
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 640, max: 640 },
          height: { ideal: 480, max: 480 },
          frameRate: { ideal: 60, max: 120 },
        },
        audio: false,
      });
      if (!videoEl) return;
      videoEl.srcObject = mediaStream;
      await videoEl.play();
      setReady(true);
      startLoop();
    } catch (err) {
      console.error("Camera init failed", err);
    }
  });

  let lastInference = 0;
  let canceled = false;

  function startLoop() {
    const loop = async (now: DOMHighResTimeStamp) => {
      if (canceled) return;
      if (ready() && videoEl) {
        if (now - lastInference > 33) {
          classifyModel(videoEl!);
          lastInference = now;
        }
      }
      videoEl!.requestVideoFrameCallback(loop);
    };
    videoEl!.requestVideoFrameCallback(loop);
  }

  async function classifyModel(video: HTMLVideoElement) {
    try {
      // Lazy load model inside classification if not provided externally
      const model = (await import("../hooks/useModel")).useModel(props.modelUrl)();
      if (model) {
        const result = await classify(model, video);
        props.onResult(result);
      }
    } catch (e) {
      console.error("classify error", e);
    }
  }

  onCleanup(() => {
    canceled = true;
    if (videoEl && videoEl.srcObject) {
      (videoEl.srcObject as MediaStream).getTracks().forEach((t) => t.stop());
    }
  });

  return (
    <div class="camera-wrapper">
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <video ref={videoEl!} playsInline muted class="w-full h-auto" />
    </div>
  );
} 