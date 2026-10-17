"""Generate the tactile paper / wood / cardboard textures used by the scene.

Everything is procedural so the repository does not need any stock imagery.
Run:  python scripts/gen_textures.py
"""
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from scipy.ndimage import gaussian_filter

OUT = Path(__file__).resolve().parent.parent / "public" / "textures"
OUT.mkdir(parents=True, exist_ok=True)
RNG = np.random.default_rng(20261017)


def fbm(shape, octaves=5, persistence=0.55):
    h, w = shape
    total = np.zeros(shape, dtype=np.float32)
    amp = 1.0
    norm = 0.0
    for i in range(octaves):
        base = 2 ** i
        small = RNG.normal(size=(max(2, h // (64 // base)), max(2, w // (64 // base))))
        small = gaussian_filter(small, 0.7)
        layer = np.asarray(
            Image.fromarray(((small - small.min()) / (np.ptp(small) + 1e-9) * 255).astype(np.uint8))
            .resize((w, h), Image.BICUBIC),
            dtype=np.float32,
        ) / 255.0
        total += layer * amp
        norm += amp
        amp *= persistence
    total /= norm
    return total


def save(arr, name, quality=90):
    img = Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8))
    img.save(OUT / name, quality=quality, subsampling=1)
    print("wrote", OUT / name, img.size)


def wood():
    w, h = 1800, 1100
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)

    # Long, softly warped grain: horizontal streaks at several scales.
    fine = gaussian_filter(RNG.normal(0, 1, (h, w)).astype(np.float32), (1.0, 16.0))
    fine = fine / (np.std(fine) + 1e-9)
    broad = gaussian_filter(RNG.normal(0, 1, (h, w)).astype(np.float32), (3.0, 70.0))
    broad = broad / (np.std(broad) + 1e-9)
    warp = fbm((h, w), 4)
    band = np.sin((yy + warp * 34) * 0.018)
    band = gaussian_filter(band, (2.0, 0.5))

    v = 0.50 + 0.055 * band + 0.045 * fine + 0.065 * broad + 0.05 * (fbm((h, w), 5) - 0.5)
    v = np.clip(v, 0, 1)

    # warm walnut palette, deliberately on the dark side
    dark = np.array([30, 17, 10], dtype=np.float32)
    mid = np.array([74, 43, 24], dtype=np.float32)
    light = np.array([112, 70, 41], dtype=np.float32)
    t = v[..., None]
    low = dark * (1 - np.clip(t * 1.7, 0, 1)) + mid * np.clip(t * 1.7, 0, 1)
    high = np.clip((t - 0.68) / 0.32, 0, 1)
    arr = low * (1 - high) + light * high

    # a couple of faint knots, stretched along the grain
    for kx, ky, kr in [(520, 330, 42), (1370, 780, 55), (980, 120, 30)]:
        d = np.sqrt(((xx - kx) / (kr * 3.2)) ** 2 + ((yy - ky) / kr) ** 2)
        knot = np.clip(1 - d, 0, 1) ** 2
        ring = np.sin(d * 18) * knot
        arr = arr * (1 - 0.18 * knot[..., None]) + np.array([58, 33, 18]) * (0.18 * knot[..., None])
        arr = arr * (1 - 0.06 * ring[..., None])

    save(arr, "wood.jpg", 88)


def paper():
    w = h = 1100
    base = np.array([232, 220, 192], dtype=np.float32)
    mott = fbm((h, w), 5)
    fibers = RNG.normal(0, 1, (h, w)).astype(np.float32)
    fibers = gaussian_filter(fibers, 0.35)
    # short visible fibres
    pil = Image.new("L", (w, h), 0)
    d = ImageDraw.Draw(pil)
    for _ in range(2600):
        x, y = RNG.uniform(0, w), RNG.uniform(0, h)
        ln = RNG.uniform(2, 12)
        a = RNG.uniform(0, np.pi)
        d.line((x, y, x + np.cos(a) * ln, y + np.sin(a) * ln), fill=int(RNG.uniform(20, 70)), width=1)
    fib = np.asarray(pil.filter(ImageFilter.GaussianBlur(0.35)), dtype=np.float32) / 255.0

    v = 0.94 + 0.055 * (mott - 0.5) + 0.012 * fibers - 0.05 * fib
    arr = base[None, None, :] * v[..., None]
    # faint warm stains
    stain = np.clip((fbm((h, w), 4) - 0.62) * 2.2, 0, 1)
    arr = arr * (1 - 0.07 * stain[..., None]) + np.array([188, 158, 116]) * (0.07 * stain[..., None])
    save(arr, "paper.jpg", 92)


def cardboard():
    w = h = 1000
    base = np.array([176, 168, 150], dtype=np.float32)
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    corr = 0.5 + 0.5 * np.sin(xx * 0.55 + 2.2 * np.sin(yy * 0.006))
    grain = RNG.normal(0, 0.05, (h, w)).astype(np.float32)
    grain = gaussian_filter(grain, 0.6)
    mott = fbm((h, w), 4)
    v = 0.97 + 0.035 * (corr - 0.5) + 0.02 * (mott - 0.5) + 0.03 * grain
    arr = base[None, None, :] * v[..., None]
    # scuffed corners / smudges
    sm = np.clip((fbm((h, w), 3) - 0.58) * 2.0, 0, 1)
    arr = arr * (1 - 0.12 * sm[..., None]) + np.array([120, 108, 88]) * (0.12 * sm[..., None])
    save(arr, "cardboard.jpg", 90)


def teal():
    w, h = 1200, 800
    base = np.array([14, 54, 58], dtype=np.float32)
    mott = fbm((h, w), 5)
    n = RNG.normal(0, 0.04, (h, w)).astype(np.float32)
    n = gaussian_filter(n, 0.7)
    v = 0.96 + 0.07 * (mott - 0.5) + 0.025 * n
    arr = base[None, None, :] * v[..., None]
    save(arr, "teal.jpg", 92)


def grain():
    size = 512
    n = RNG.normal(0.5, 0.16, (size, size))
    n = np.clip(n, 0, 1)
    arr = np.zeros((size, size, 4), dtype=np.uint8)
    v = (n * 255).astype(np.uint8)
    arr[..., 0] = v
    arr[..., 1] = v
    arr[..., 2] = v
    arr[..., 3] = 26
    Image.fromarray(arr, mode="RGBA").save(OUT / "grain.png")
    print("wrote", OUT / "grain.png")


if __name__ == "__main__":
    wood()
    paper()
    cardboard()
    teal()
    grain()
