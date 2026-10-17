export type Line = {
  text: string;
  start: number;
  end: number;
};

// Deliberately no punctuation: the reference subtitles are clean text strips.
export const LINES: Line[] = [
  {text: '我通常不会给Omni模型直接写提示词', start: 0.2, end: 3.4},
  {text: '而是反复和Gemini对话', start: 3.9, end: 6.3},
  {text: '产生一套视频生成提示词', start: 6.4, end: 8.8},
  {text: '例如我会从不同的角度进行约束', start: 9.0, end: 11.3},
  {text: '例如世界观和故事背景层面', start: 11.7, end: 14.0},
  {text: '这条片子的时间跨度', start: 14.2, end: 15.9},
  {text: '每个镜头都有哪些特殊的时代背景', start: 16.2, end: 18.9},
  {text: '不同的镜头分别应用', start: 19.2, end: 20.7},
  {text: '什么样的画面风格', start: 21.0, end: 22.1},
  {text: '同时剪辑节奏和声音', start: 22.4, end: 24.1},
  {text: '设计也会一同定义', start: 24.3, end: 25.8},
  {text: '跨模态的约束往往能让AI', start: 26.1, end: 28.3},
  {text: '产出不同于平均水平的内容', start: 28.5, end: 30.6},
  {text: '在内容不再稀缺的今天', start: 30.9, end: 32.7},
  {text: '足够多的约束意味着独特性', start: 33.0, end: 35.4},
  {text: '也能让一条视频脱颖而出', start: 35.7, end: 38.1},
];

export const TAU = Math.PI * 2;

export const clamp = (v: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const phase = (t: number, a: number, b: number) => clamp((t - a) / (b - a));

export const easeOutCubic = (t: number) => 1 - Math.pow(1 - clamp(t), 3);

export const easeInOutCubic = (t: number) => {
  const x = clamp(t);
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
};

export const easeOutBack = (t: number, s = 1.35) => {
  const x = clamp(t) - 1;
  return 1 + (s + 1) * x * x * x + s * x * x;
};

// deterministic pseudo-random in [0, 1)
export const hash = (n: number) => {
  let x = Math.sin(n * 127.1 + 311.7) * 43758.5453123;
  x -= Math.floor(x);
  return x;
};

export const hash2 = (a: number, b: number) => hash(a * 37.13 + b * 91.7);

export const randRange = (seed: number, lo: number, hi: number) => lo + hash(seed) * (hi - lo);
