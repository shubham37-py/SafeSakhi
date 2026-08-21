import { useEffect, useRef } from "react";

interface ShakeDetectorProps {
  enabled: boolean;
  onShake: () => void;
}

const SHAKE_THRESHOLD = 18;
const SHAKE_COOLDOWN_MS = 3000;

export default function ShakeDetector({
  enabled,
  onShake,
}: ShakeDetectorProps) {
  const lastShakeTime = useRef(0);
  const lastAccel = useRef({
    x: 0,
    y: 0,
    z: 0,
  });

  useEffect(() => {
    if (!enabled) return;

    const handleMotion = (event: DeviceMotionEvent) => {
      const acc = event.accelerationIncludingGravity;

      if (!acc || acc.x === null || acc.y === null || acc.z === null) {
        return;
      }

      const delta =
        Math.abs(acc.x - lastAccel.current.x) +
        Math.abs(acc.y - lastAccel.current.y) +
        Math.abs(acc.z - lastAccel.current.z);

      const now = Date.now();

      if (
        delta > SHAKE_THRESHOLD &&
        now - lastShakeTime.current > SHAKE_COOLDOWN_MS
      ) {
        lastShakeTime.current = now;
        onShake();
      }

      lastAccel.current = {
        x: acc.x,
        y: acc.y,
        z: acc.z,
      };
    };

    window.addEventListener("devicemotion", handleMotion);

    return () => {
      window.removeEventListener("devicemotion", handleMotion);
    };
  }, [enabled, onShake]);

  return null;
}