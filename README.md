# Kweku Ananse — Interactive Retelling

This project is an interactive retelling of Kweku Ananse designed for a mythology course project.

Files:

- `index.html` — main entry (open in your browser)
- `styles.css` — visual styling
- `main.js` — simple scene engine plus optional speech narration
- `assets/spider.svg` — decorative spider logo
- `assets/` — place additional assets here (e.g., `audio/<sceneId>.mp3` if you add recorded narration)

How to run:

1. Open `index.html` in your browser (double-click or `open index.html` on macOS).
2. Click "Begin" to start the interactive tale.

Narration:

- Click "Toggle Narration" to enable browser voice narration (Web Speech API).
- Use the voice selector and rate slider to pick a voice and speaking speed. If your browser lacks built-in voices, install or enable system voices or use the browser's default.
- You may optionally place pre-recorded MP3 narrations at `assets/audio/<sceneId>.mp3` and extend the code to prefer recorded audio over TTS.

Notes for submission:

- The site preserves core motifs: trickster intelligence, spider imagery, and storytelling as a form of power.
- Variants are included via branching choices (help / steal / scheme) that alter consequences.
- The "Course Notes" button exposes links to motifs and adaptation concepts that you can expand in your submission.

Want changes? Tell me which branches or visual choices you'd like adjusted — I can add audio narration files, illustrations, or expand scenes into multiple pages for grading.
