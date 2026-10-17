# Popup Book — 立体书：约束越多，作品越能脱颖而出

A 38.2 second stop-motion paper pop-up book, built entirely with Remotion, React and SVG. The film explains how a stack of small constraints — world, time span, era, look, rhythm — turns a generic prompt into a distinctive video.

![preview](docs/preview.jpg)

## Specs

- 1920 × 1080, 16:9
- 30 fps, 1146 frames (38.2 s)
- H.264 / AAC, 48 kHz stereo
- Composition ID: `PopupBook`
- No live-action footage, no stock video, no music bed: narration is synthesized with Edge TTS and the paper foley is generated with numpy.

## Run

```bash
npm install
npm start          # Remotion Studio
npm run render     # out/popup-book.mp4
```

Rendering uses the local Microsoft Edge installation on Windows when it exists. Set `REMOTION_BROWSER` to another Chromium executable if needed; otherwise Remotion downloads its own browser.

Optional regeneration:

```bash
npm run textures   # procedural wood / paper / cardboard / grain textures
npm run audio      # Edge TTS narration + synthesized paper foley
```

`npm run audio` needs network access and the Python packages listed in `scripts/build_audio.py` (`edge-tts`, `numpy`, `scipy`, `soundfile`).

## Structure

```
src/
  Video.tsx              timeline and scene state
  theme.ts               palette, fonts, frame size
  timeline.ts            subtitle cues and easing helpers
  components/
    Desk.tsx             walnut desk, warm key light, vignette
    Book.tsx             3D pop-up book, cover, five section tabs
    FlatBook.tsx         first open spread, chat bubbles, prompt deck
    SeasideArt.tsx       layered paper diorama (moon, town, lighthouse)
    Timeline.tsx         four era panels in four visual styles
    Props.tsx            train, rocket, computer, satellite, gramophone, clapperboard
    OmniBox.tsx          cardboard "OMNI" box and prompt card
    Girl.tsx             paper-cut character
    PaperStorm.tsx       scattered prompt sheets
    Subtitle.tsx         torn-paper subtitle strip (no punctuation)
    StopMotion.ts        pose quantisation (10 poses/s) and camera jitter
    Grain.tsx            per-pose film grain and exposure flicker
public/
  fonts/                 Noto Serif SC, Special Elite, Ma Shan Zheng
  textures/              generated wood / paper / cardboard / teal / grain
  audio/soundtrack.m4a   final narration + foley mix
scripts/
  gen_textures.py        procedural textures
  build_audio.py         TTS + paper sound design + mix
```

## How the paper look is built

- The desk, paper, cardboard and teal book cloth are procedural textures, not stock photographs.
- The book is a CSS 3D plane with a hinged page, a closing cover and five standing tabs; all other props are SVG paper cut-outs with drop shadows.
- Every movement is quantised to 10 poses per second, with a small per-pose camera jitter and exposure flicker, to reproduce the hand-shot stop-motion cadence.
- The subtitle strips are torn-edged paper with no punctuation, matching the clean caption style of the reference.

## License

MIT. Fonts keep their own licenses: Noto Serif SC and Ma Shan Zheng are SIL Open Font License, Special Elite is Apache 2.0.
