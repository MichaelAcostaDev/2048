# 2048

> **Move. Merge. Reach 2048.**

A web version of the classic tile game, with keyboard and touch controls, a responsive interface, and progress saved in the browser. Combine matching tiles to reach the 2048 tile.

<p align="center">
  <a href="https://michael-2048.vercel.app/">
    <img src="https://img.shields.io/badge/Play%20Live-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Play 2048 on Vercel">
  </a>
  <img src="https://img.shields.io/badge/Backend-Ruby%20%2B%20Sinatra-CC342D?style=for-the-badge" alt="Ruby and Sinatra">
  <img src="https://img.shields.io/badge/Frontend-Vanilla%20JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="Vanilla JavaScript">
</p>

[Live game](https://michael-2048.vercel.app/) · [Source code](https://github.com/MichaelAcostaDev/2048)

## 🎯 Problem and solution

Puzzle games should be easy to pick up and respond instantly on both desktop and touch devices. This project delivers a lightweight 2048 experience: moves update immediately, controls adapt to the device, and progress remains available between visits in the same browser.

## ✨ Key features

- **4 × 4 game board:** move and merge matching tiles to increase your score.
- **Flexible controls:** use the arrow keys, WASD, or swipe gestures.
- **Local progress:** automatically saves the board, score, and best score in the browser.
- **Light and dark themes:** light mode is the default, with a toggle for dark mode.
- **Bilingual interface:** selects English or Spanish based on the device's preferred languages.
- **Visual and audio feedback:** sliding, spawning, and merge animations, plus optional sound.
- **Game-over dialog:** displays the final score and lets players start a new game or return to the board.
- **Responsive design:** supports desktop and mobile layouts and respects the system's reduced-motion preference.

## 🏗️ Architecture and technology stack

| Component | Technology | Responsibility |
| --- | --- | --- |
| Web application | Ruby and Sinatra | Serves the page, static assets, and JSON game endpoints. |
| Game rules | Ruby | Implements moves, merges, scoring, and game-over detection in `Game2048`. |
| View | ERB and HTML | Defines the page structure and game board. |
| Interaction | JavaScript | Manages the in-browser game state, controls, rendering, translations, and animations. |
| Sound | Web Audio API | Generates move sounds directly in the browser. |
| Styling | CSS | Defines themes, responsive layouts, and visual effects. |
| Persistence | `localStorage` | Stores game progress and preferences in the user's browser. |
| Deployment | Vercel | Hosts the Ruby application through the project's deployment configuration. |

The application separates web routing from game rules: `app.rb` defines the Sinatra routes, while `lib/game_logic.rb` contains the Ruby game model. In the browser, JavaScript manages a responsive game session and stores its state locally, so each move does not require a server round trip.

## 🧠 Technical decisions and challenges

- **Lightweight stack:** Sinatra and framework-free JavaScript keep the application focused and straightforward.
- **Immediate interaction:** the browser processes moves and renders the board locally; `localStorage` preserves progress across reloads.
- **Explicit game rules:** the Ruby model handles movement, merging, scoring, and terminal-state detection.
- **Context-aware animations:** tiles retain their source positions while sliding; merges and newly spawned tiles have distinct effects. Motion also respects the operating system's reduced-motion setting.
- **Preference-aware UI:** theme and language defaults adapt to user preferences without requiring initial setup.
- **Consistency challenge:** game rules exist in both Ruby and JavaScript to support the server endpoints and in-browser gameplay. Keeping both implementations aligned is an important area for future testing.

## 🚀 Project status and roadmap

### Completed

- Playable game with movement in all four directions, tile merges, and scoring.
- Responsive interface with light and dark themes.
- Local game-state persistence.
- Automatic English and Spanish language selection.
- Optional sound, tile animations, and a game-over dialog.

### Suggested roadmap

- Add automated tests for the game rules and consistency between the Ruby and JavaScript implementations.
- Add a manual language selector alongside device-based language detection.
- Explore remote progress synchronization across devices.
- Expand accessibility and visual customization options.

## 👤 Author

**Michael Acosta**

- [LinkedIn](https://www.linkedin.com/in/michael-acosta-dev/)
- [GitHub](https://github.com/MichaelAcostaDev)
