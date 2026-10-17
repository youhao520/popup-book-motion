"""Build the soundtrack: synthesized narration + hand-made paper foley.

The reference video has no music bed, only voice and tactile paper sounds, so
everything here is generated from scratch.  Requires network access for the
Edge TTS voices; the foley is pure numpy.

Run: python scripts/build_audio.py
"""
from __future__ import annotations

import asyncio
import subprocess
from pathlib import Path

import numpy as np
import soundfile as sf
from scipy.signal import butter, sosfilt

ROOT = Path(__file__).resolve().parent.parent
BUILD = ROOT / "build" / "audio"
PUBLIC = ROOT / "public" / "audio"
BUILD.mkdir(parents=True, exist_ok=True)
PUBLIC.mkdir(parents=True, exist_ok=True)

SR = 48000
DUR = 38.2
N = int(SR * DUR)
RNG = np.random.default_rng(20261017)
VOICE = "zh-CN-YunxiNeural"

LINES = [
    ("我通常不会给Omni模型直接写提示词", 0.2, 3.4),
    ("而是反复和Gemini对话", 3.9, 6.3),
    ("产生一套视频生成提示词", 6.4, 8.8),
    ("例如我会从不同的角度进行约束", 9.0, 11.3),
    ("例如世界观和故事背景层面", 11.7, 14.0),
    ("这条片子的时间跨度", 14.2, 15.9),
    ("每个镜头都有哪些特殊的时代背景", 16.2, 18.9),
    ("不同的镜头分别应用", 19.2, 20.7),
    ("什么样的画面风格", 21.0, 22.1),
    ("同时剪辑节奏和声音", 22.4, 24.1),
    ("设计也会一同定义", 24.3, 25.8),
    ("跨模态的约束往往能让AI", 26.1, 28.3),
    ("产出不同于平均水平的内容", 28.5, 30.6),
    ("在内容不再稀缺的今天", 30.9, 32.7),
    ("足够多的约束意味着独特性", 33.0, 35.4),
    ("也能让一条视频脱颖而出", 35.7, 38.1),
]


# ---------------------------------------------------------------- voice
async def synth_one(i: int, text: str) -> Path:
    import edge_tts

    mp3 = BUILD / f"line-{i:02d}.mp3"
    if not mp3.exists() or mp3.stat().st_size < 1000:
        com = edge_tts.Communicate(text, VOICE, rate="+25%", pitch="-8Hz")
        await com.save(str(mp3))
    return mp3


async def synth_all() -> None:
    for i, (text, _, _) in enumerate(LINES, start=1):
        await synth_one(i, text)
        print("voice", i, "ok")


def load_voice(i: int) -> np.ndarray:
    mp3 = BUILD / f"line-{i:02d}.mp3"
    wav = BUILD / f"line-{i:02d}.wav"
    subprocess.run(
        ["ffmpeg", "-v", "error", "-y", "-i", str(mp3), "-ar", str(SR), "-ac", "1", str(wav)],
        check=True,
    )
    x, _ = sf.read(wav, dtype="float32")
    # trim leading / trailing silence
    idx = np.where(np.abs(x) > 0.006)[0]
    if len(idx):
        a = max(0, idx[0] - int(0.03 * SR))
        b = min(len(x), idx[-1] + int(0.05 * SR))
        x = x[a:b]
    # soft edges
    n = min(len(x), int(0.012 * SR))
    if n > 0:
        ramp = np.linspace(0, 1, n, dtype=np.float32)
        x[:n] *= ramp
        x[-n:] *= ramp[::-1]
    return x


def atempo(x: np.ndarray, ratio: float) -> np.ndarray:
    if ratio <= 1.02:
        return x
    tmp = BUILD / "tempo.wav"
    sf.write(tmp, x, SR)
    out = BUILD / "tempo-out.wav"
    subprocess.run(
        ["ffmpeg", "-v", "error", "-y", "-i", str(tmp), "-filter:a", f"atempo={ratio:.5f}", str(out)],
        check=True,
    )
    y, _ = sf.read(out, dtype="float32")
    return y


# ---------------------------------------------------------------- foley
def _bp(x: np.ndarray, lo: float, hi: float, order: int = 2) -> np.ndarray:
    sos = butter(order, [lo, hi], btype="band", fs=SR, output="sos")
    return sosfilt(sos, x).astype(np.float32)


def _lp(x: np.ndarray, hi: float, order: int = 2) -> np.ndarray:
    sos = butter(order, hi, btype="low", fs=SR, output="sos")
    return sosfilt(sos, x).astype(np.float32)


def _env(n: int, attack: float, decay: float) -> np.ndarray:
    a = max(1, int(attack * SR))
    e = np.ones(n, dtype=np.float32)
    if a < n:
        e[:a] = np.linspace(0, 1, a, dtype=np.float32) ** 0.7
        e[a:] = np.exp(-np.linspace(0, 1, n - a, dtype=np.float32) / max(decay, 1e-3))
    return e


def rustle(dur=0.35, seed=1, intensity=0.20, bright=4200.0) -> np.ndarray:
    rng = np.random.default_rng(seed)
    n = int(dur * SR)
    base = rng.normal(0, 1, n).astype(np.float32)
    base = _bp(base, 700, bright)
    # a few uneven scrunches
    env = np.zeros(n, dtype=np.float32)
    for _ in range(5):
        c = rng.integers(0, max(1, n - 1))
        ln = rng.integers(int(0.015 * SR), max(int(0.02 * SR), int(0.07 * SR)))
        seg = np.hanning(ln).astype(np.float32)
        env[c : c + ln] += seg[: max(0, min(ln, n - c))] * rng.uniform(0.4, 1.0)
    env *= _env(n, 0.004, 0.55)
    crack = np.zeros(n, dtype=np.float32)
    for _ in range(18):
        c = rng.integers(0, n)
        crack[c] = rng.uniform(-0.7, 0.7)
    crack = _bp(crack, 1500, 9000) * 0.5
    x = (base * (0.35 + env) + crack) * intensity
    return x.astype(np.float32)


def slide(dur=0.32, seed=4, intensity=0.16) -> np.ndarray:
    rng = np.random.default_rng(seed)
    n = int(dur * SR)
    x = rng.normal(0, 1, n).astype(np.float32)
    x = _bp(x, 250, 2600)
    return (x * _env(n, 0.02, 0.35) * intensity).astype(np.float32)


def thud(dur=0.28, seed=7, intensity=0.30) -> np.ndarray:
    n = int(dur * SR)
    t = np.arange(n, dtype=np.float32) / SR
    body = np.sin(2 * np.pi * (62 - 18 * t / dur) * t) * np.exp(-t * 18)
    click = np.random.default_rng(seed).normal(0, 1, n).astype(np.float32)
    click = _lp(click, 1400) * np.exp(-t * 60)
    return ((body * 0.9 + click * 0.35) * intensity).astype(np.float32)


def pop(dur=0.12, seed=11, intensity=0.22) -> np.ndarray:
    n = int(dur * SR)
    t = np.arange(n, dtype=np.float32) / SR
    tone = np.sin(2 * np.pi * (420 - 160 * t / dur) * t) * np.exp(-t * 42)
    click = np.random.default_rng(seed).normal(0, 1, n).astype(np.float32)
    click = _bp(click, 900, 5200) * np.exp(-t * 90)
    return ((tone * 0.7 + click * 0.5) * intensity).astype(np.float32)


def creak(dur=0.55, seed=15, intensity=0.12) -> np.ndarray:
    n = int(dur * SR)
    t = np.arange(n, dtype=np.float32) / SR
    f = 118 + 34 * np.sin(2 * np.pi * 3.2 * t) + 10 * np.sin(2 * np.pi * 11 * t)
    ph = 2 * np.pi * np.cumsum(f) / SR
    saw = 2 * (ph / (2 * np.pi) % 1.0) - 1
    noise = np.random.default_rng(seed).normal(0, 1, n).astype(np.float32)
    noise = _bp(noise, 500, 2800)
    env = _env(n, 0.03, 0.5) * (0.75 + 0.25 * np.sin(2 * np.pi * 7 * t))
    return ((saw * 0.22 + noise * 0.5) * env * intensity).astype(np.float32)


def whoosh(dur=0.55, seed=21, intensity=0.20) -> np.ndarray:
    n = int(dur * SR)
    rng = np.random.default_rng(seed)
    x = rng.normal(0, 1, n).astype(np.float32)
    low = _bp(x, 180, 900)
    high = _bp(x, 900, 5000)
    t = np.linspace(0, 1, n, dtype=np.float32)
    env = np.clip(np.sin(np.pi * t), 0, None) ** 1.4
    mix = low * (1 - t) + high * t
    return (mix * env * intensity).astype(np.float32)


def stamp(dur=0.32, intensity=0.34) -> np.ndarray:
    a = thud(dur, 31, intensity)
    b = rustle(0.16, 33, intensity * 0.5, 6000)
    out = a.copy()
    out[: len(b)] += b
    return out


def clapper(intensity=0.3) -> np.ndarray:
    a = pop(0.07, 41, intensity)
    b = pop(0.07, 43, intensity * 0.9)
    out = np.zeros(int(0.22 * SR), dtype=np.float32)
    out[: len(a)] += a
    off = int(0.095 * SR)
    out[off : off + len(b)] += b
    return out


def page(dur=0.6, seed=51, intensity=0.24) -> np.ndarray:
    a = rustle(dur, seed, intensity, 5600)
    b = thud(0.2, seed + 1, intensity * 0.4)
    out = a.copy()
    out[: len(b)] += b
    return out


# ---------------------------------------------------------------- mix
def place(track: np.ndarray, x: np.ndarray, at: float, gain: float = 1.0, pan: float = 0.0) -> None:
    i = int(at * SR)
    if i >= len(track):
        return
    x = x[: len(track) - i]
    l = np.sqrt((1 - pan) * 0.5)
    r = np.sqrt((1 + pan) * 0.5)
    track[i : i + len(x), 0] += x * gain * l * 1.4142
    track[i : i + len(x), 1] += x * gain * r * 1.4142


def build() -> None:
    asyncio.run(synth_all())

    voice_track = np.zeros((N, 2), dtype=np.float32)
    for i, (text, start, end) in enumerate(LINES, start=1):
        x = load_voice(i)
        slot = end - start - 0.16
        ratio = len(x) / SR / max(0.1, slot)
        if ratio > 1.0:
            x = atempo(x, min(1.35, ratio))
        # keep a little air before the line
        place(voice_track, x, start + 0.08, 1.0, 0.0)
        print(f"line {i:02d}: {len(x)/SR:.2f}s / slot {slot:.2f}s")

    sfx = np.zeros((N, 2), dtype=np.float32)

    # opening box
    place(sfx, slide(0.22, 2, 0.10), 0.08, pan=-0.1)
    place(sfx, creak(0.5, 3, 0.13), 0.72, pan=-0.05)
    place(sfx, slide(0.3, 5, 0.14), 1.28, pan=0.0)
    place(sfx, stamp(0.28, 0.30), 2.18, pan=0.02)
    place(sfx, rustle(0.22, 8, 0.12), 2.5, pan=0.05)
    place(sfx, thud(0.22, 9, 0.22), 2.66, pan=-0.04)

    # flat chat book
    place(sfx, thud(0.25, 12, 0.20), 3.78, pan=0.0)
    for k, at in enumerate([4.5, 4.72, 4.95, 5.22, 5.48, 5.72, 6.02, 6.25]):
        place(sfx, pop(0.12, 60 + k, 0.16 + 0.02 * (k % 3)), at, pan=-0.25 + (k % 2) * 0.5)
    place(sfx, slide(0.4, 14, 0.13), 6.3, pan=0.0)
    place(sfx, page(0.5, 16, 0.20), 7.15, pan=0.0)
    place(sfx, thud(0.2, 17, 0.15), 8.88, pan=0.0)

    # opening the big book
    place(sfx, rustle(0.4, 18, 0.10), 9.3, pan=0.0)
    place(sfx, creak(0.8, 19, 0.10), 10.35, pan=0.0)
    place(sfx, page(0.7, 20, 0.20), 10.7, pan=0.0)

    # tabs flick up
    for k in range(5):
        at = 11.55 + k * 0.16
        place(sfx, pop(0.1, 70 + k, 0.14), at, pan=-0.3 + k * 0.15)
        place(sfx, slide(0.18, 75 + k, 0.08), at + 0.03, pan=-0.3 + k * 0.15)

    # pop-up rise + accordion
    place(sfx, whoosh(0.55, 80, 0.20), 14.22, pan=0.0)
    place(sfx, page(0.6, 81, 0.22), 14.4, pan=0.0)
    for k in range(4):
        place(sfx, slide(0.28, 85 + k, 0.12), 14.62 + k * 0.2, pan=-0.25 + k * 0.16)
    place(sfx, pop(0.12, 89, 0.18), 15.05, pan=0.2)

    # style panels + labels
    for k in range(4):
        place(sfx, page(0.4, 90 + k, 0.16), 19.35 + k * 0.42, pan=-0.25 + k * 0.16)
    for k in range(4):
        place(sfx, pop(0.1, 100 + k, 0.16), 20.45 + k * 0.1, pan=-0.25 + k * 0.16)

    # sound / design + checks
    place(sfx, pop(0.14, 110, 0.18), 22.35, pan=-0.4)
    place(sfx, creak(0.45, 111, 0.08), 22.45, pan=-0.35)
    for k in range(5):
        place(sfx, pop(0.09, 112 + k, 0.13), 22.55 + k * 0.075, pan=-0.25 + k * 0.12)
    place(sfx, clapper(0.26), 23.55, pan=0.1)

    # compare
    place(sfx, whoosh(0.6, 120, 0.18), 25.92, pan=-0.2)
    place(sfx, thud(0.22, 121, 0.18), 26.4, pan=-0.25)
    place(sfx, whoosh(0.5, 122, 0.16), 28.2, pan=0.0)
    place(sfx, pop(0.16, 123, 0.30), 28.58, pan=0.0)
    place(sfx, slide(0.2, 124, 0.12), 28.72, pan=-0.1)

    # paper storm
    place(sfx, whoosh(0.8, 130, 0.26), 30.62, pan=0.0)
    for k in range(12):
        place(sfx, rustle(0.4 + 0.1 * (k % 3), 131 + k, 0.12 + 0.02 * (k % 4)), 30.72 + k * 0.18, pan=-0.6 + (k % 7) * 0.2)
    place(sfx, thud(0.3, 150, 0.20), 31.2, pan=0.0)

    # final re-erection
    place(sfx, creak(0.7, 160, 0.10), 35.55, pan=0.0)
    place(sfx, page(0.7, 161, 0.22), 35.8, pan=0.0)
    place(sfx, whoosh(0.6, 162, 0.16), 35.7, pan=0.0)
    for k in range(4):
        place(sfx, slide(0.3, 165 + k, 0.10), 35.95 + k * 0.14, pan=-0.2 + k * 0.14)
    place(sfx, pop(0.1, 170, 0.12), 36.4, pan=0.2)
    place(sfx, rustle(0.5, 171, 0.08), 37.6, pan=0.0)

    # barely-there room tone
    room = RNG.normal(0, 1, N).astype(np.float32)
    room = _lp(room, 220)
    room = room * 0.0025
    sfx[:, 0] += room
    sfx[:, 1] += room * 0.96

    mix = voice_track * 1.0 + sfx * 0.9
    # gentle bus compression / soft clip
    mix = np.tanh(mix * 1.15) * 0.92

    raw = BUILD / "mix-raw.wav"
    sf.write(raw, mix, SR, subtype="PCM_16")

    norm = BUILD / "mix-norm.wav"
    subprocess.run(
        [
            "ffmpeg",
            "-v",
            "error",
            "-y",
            "-i",
            str(raw),
            "-af",
            "loudnorm=I=-15:TP=-1.5:LRA=11",
            "-ar",
            str(SR),
            str(norm),
        ],
        check=True,
    )

    out = PUBLIC / "soundtrack.m4a"
    subprocess.run(
        [
            "ffmpeg",
            "-v",
            "error",
            "-y",
            "-i",
            str(norm),
            "-c:a",
            "aac",
            "-b:a",
            "192k",
            "-ar",
            str(SR),
            "-ac",
            "2",
            str(out),
        ],
        check=True,
    )
    print("wrote", out)


if __name__ == "__main__":
    build()
