Original prompt: Your job is to create a game that helps people in Trondheim learn english. We are solely interested in teaching them inappropriate words, such as curse words. We are most interested in using cutting edge game libraries, like babylonJS. We also want our homepage to use ThreeJS to have a very fancy and modern look to it, with a lot of interactivity. Your greatest focus shall be beauty, and the grotesque choice of words used to teach english.

Status 2026-02-19:
- Scaffold planned for Vite + React + TypeScript with Tailwind v4 CSS-first, ThreeJS landing, BabylonJS farm scene.
- No dependencies installed yet; node_modules not present. Tailwind v4 beta expected via npm install.
- Next steps after install: run dev server, iterate on farm interactions, add Playwright loop per develop-web-game skill.

Updates:
- Added Vite/React/TS app scaffold (index.html, vite.config.ts, tsconfigs) and Tailwind v4 theme in src/styles.css (neon grotesque palette, glass cards, utility classes).
- Landing route with ThreeJS hero canvas (react-three-fiber/drei) and CTA stack; explicit-content ribbon.
- Farm route with BabylonJS scene (crop hotspots, WASD/E/F controls), HUD overlays, motion/seizure toggles wired to root classes; testing hooks render_game_to_text + advanceTime.
- Word data + zustand store; type definitions for words/challenges/player.
- PostCSS config and .gitignore added.
- npm install succeeded earlier (node_modules + package-lock present); if dependencies change, rerun `npm install`.
- Removed unused `babylonjs-loaders` import to fix Vite missing-module error; if loaders are needed later, install `babylonjs-loaders@6.46.0` and re-add import.
