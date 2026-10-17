import {useCurrentFrame} from 'remotion';
import {FPS} from '../theme';
import {hash} from '../timeline';

// The reference moves on threes at 30 fps: a new pose roughly every 0.1 s.
export const HOLD = 3;

export const useStopMotion = () => {
  const frame = useCurrentFrame();
  const pose = Math.floor(frame / HOLD);
  return {
    frame,
    pose,
    time: (pose * HOLD) / FPS,
    smoothTime: frame / FPS,
    exposure: 0.985 + hash(pose * 3.1) * 0.03,
  };
};

export const stopTime = (frame: number) => (Math.floor(frame / HOLD) * HOLD) / FPS;

export const poseOf = (frame: number) => Math.floor(frame / HOLD);

// Hand-held camera micro-jitter, one value per stop-motion pose.
export const cameraJitter = (pose: number) => ({
  x: (hash(pose * 1.7 + 4) - 0.5) * 1.7,
  y: (hash(pose * 2.3 + 19) - 0.5) * 1.4,
  rot: (hash(pose * 3.7 + 41) - 0.5) * 0.13,
});

// A tiny bit of cardboard wobble for things that just landed.
export const paperWobble = (time: number, since: number, amp = 1.2) => {
  const dt = Math.max(0, time - since);
  if (dt > 1.2) return 0;
  return Math.sin(dt * 42) * Math.exp(-dt * 5) * amp;
};
