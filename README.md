# IRON GRIND — Epic Cinematic Intro

A cinematic, blizzard-themed intro sequence for the **IRON GRIND** brand.

## Structure

```
IRON-GRIND/
├── index.html              # Main HTML (VFX, Cinematic, UI layers)
├── style_part1.css         # Core layout, 3D environment, spear, gauges
├── style_part2.css         # Logo, UI, VFX overlays, post-processing
├── engine_part1.js         # Canvas particle engine, wind, embers, camera
├── engine_part2.js         # Cinematic timeline, gauges, audio, UI
├── assets/
│   ├── audio/              # Required sound files
│   │   ├── intro-ambience.mp3
│   │   ├── machine-boot.mp3
│   │   ├── gauge-activate.mp3
│   │   ├── energy-surge.mp3
│   │   └── logo-impact.mp3
│   ├── images/textures/    # (Optional) future texture maps
│   └── icons/
│       └── app-icon.png    # APK / app icon
└── README.md
```

## How to run

1. Open `index.html` in a modern browser (Chrome / Edge / Firefox recommended).  
   Placeholder audio files are already included under `assets/audio/`. Replace them with your own higher-quality SFX when ready.
2. Click **ENTER THE GRIND** after the boot sequence reaches 100%.
3. Use **SKIP INTRO** to jump straight to the dashboard placeholder.

> Audio requires user interaction (browser autoplay policy). The start button provides that interaction.


## Timeline (approx.)

| Time  | Phase                      |
|-------|----------------------------|
| 0–2s  | Frozen wasteland reveal    |
| 2–4s  | Vanguard (spear) strike    |
| 4–6s  | Gauges activate            |
| 6–8s  | Emblem forge               |
| 8–10s | Blizzard power surge       |
| 10–12s| Brand text                 |
| 12–15s| Tagline + final impact     |
| 14.5s | Transition to dashboard    |

## Notes

- Particles (snow, ash, embers) run continuously after load.
- All major VFX (shake, lightning, chromatic aberration, light sweep, DOF) are driven by the timeline.
- The final screen is currently a placeholder: `"DASHBOARD LOADED"`.
