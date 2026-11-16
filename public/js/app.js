const boardEl = document.getElementById('board');
const scoreEl = document.getElementById('score');
const bestScoreEl = document.getElementById('best-score');
const statusEl = document.getElementById('status');
const newGameBtn = document.getElementById('new-game');
const themeToggleBtn = document.getElementById('theme-toggle');
const soundToggleBtn = document.getElementById('sound-toggle');
const gameOverDialog = document.getElementById('game-over-dialog');
const finalScoreEl = document.getElementById('final-score');
const restartGameBtn = document.getElementById('restart-game');
const dismissGameOverBtn = document.getElementById('dismiss-game-over');

const translations = {
  en: {
    description: 'A simple, functional 2048 game in Ruby for mobile and desktop.',
    newGame: 'New game',
    themeLight: 'Theme: light',
    themeDark: 'Theme: dark',
    soundOn: 'Sound: on',
    soundOff: 'Sound: off',
    score: 'Score',
    best: 'Best',
    instructions: 'Use the arrow keys or swipe to move the tiles.',
    won: 'You reached 2048!',
    gameOverEyebrow: 'GAME OVER',
    gameOverTitle: 'No moves left!',
    gameOverDescription: 'The board is full and no more merges are possible.',
    finalScore: 'Final score',
    restart: 'Play again',
    dismiss: 'View board'
  },
  es: {
    description: '2048 en Ruby con una interfaz simple y funcional para móvil y escritorio.',
    newGame: 'Nueva partida',
    themeLight: 'Tema: claro',
    themeDark: 'Tema: oscuro',
    soundOn: 'Sonido: activado',
    soundOff: 'Sonido: desactivado',
    score: 'Puntuación',
    best: 'Mejor',
    instructions: 'Mueve las fichas con las flechas o deslizando.',
    won: '¡Llegaste a 2048!',
    gameOverEyebrow: 'FIN DE LA PARTIDA',
    gameOverTitle: '¡No quedan movimientos!',
    gameOverDescription: 'El tablero está lleno y ya no hay combinaciones posibles.',
    finalScore: 'Puntuación final',
    restart: 'Nueva partida',
    dismiss: 'Ver tablero'
  }
};

const deviceLanguages = navigator.languages && navigator.languages.length
  ? navigator.languages
  : [navigator.language || 'en'];
const preferredLanguage = deviceLanguages.find((locale) => /^(en|es)(-|$)/i.test(locale));
const language = preferredLanguage ? preferredLanguage.slice(0, 2).toLowerCase() : 'en';
const text = translations[language];

let state = null;
let soundEnabled = true;
let gestureStart = null;
let audioContext = null;

class Game2048 {
  constructor(state = null) {
    if (state && state.board && Array.isArray(state.board) && state.board.length === 4) {
      this.board = state.board.map((row) => row.map((value) => Number(value) || 0));
      this.score = Number(state.score) || 0;
      this.won = Boolean(state.won);
      this.lost = Boolean(state.lost);
      this.best_score = Number(state.best_score) || 0;
      this.theme = state.theme || 'light';
      if (!this.board.some((row) => row.some((value) => value !== 0))) {
        this.spawnTile();
        this.spawnTile();
      }
    } else {
      this.board = Array.from({ length: 4 }, () => Array(4).fill(0));
      this.score = 0;
      this.won = false;
      this.lost = false;
      this.best_score = 0;
      this.theme = state && state.theme ? state.theme : 'light';
      this.spawnTile();
      this.spawnTile();
    }
  }

  move(direction) {
    if (this.lost) return this.toObject();

    const originalBoard = this.deepCopy(this.board);
    let movedBoard;

    switch (direction.toString().toLowerCase()) {
      case 'left':
        movedBoard = this.board.map((row) => this.mergeRow(row));
        break;
      case 'right':
        movedBoard = this.board.map((row) => this.mergeRow([...row].reverse()).reverse());
        break;
      case 'up':
        movedBoard = this.transpose(this.transpose(this.board).map((col) => this.mergeRow(col)));
        break;
      case 'down':
        movedBoard = this.transpose(this.transpose(this.board).map((col) => this.mergeRow([...col].reverse()).reverse()));
        break;
      default:
        movedBoard = this.board;
    }

    if (!this.areBoardsEqual(originalBoard, movedBoard)) {
      this.board = movedBoard;
      this.spawnTile();
      this.won = this.board.flat().some((value) => value >= 2048) || this.won;
      this.lost = this.gameOver();
    }

    return this.toObject();
  }

  toObject() {
    return {
      board: this.deepCopy(this.board),
      score: this.score,
      won: this.won,
      lost: this.lost,
      best_score: Math.max(this.best_score, this.score),
      theme: this.theme
    };
  }

  mergeRow(values) {
    const compacted = values.filter((value) => value !== 0);
    const merged = [];
    let index = 0;

    while (index < compacted.length) {
      if (index + 1 < compacted.length && compacted[index] === compacted[index + 1]) {
        const mergedValue = compacted[index] * 2;
        merged.push(mergedValue);
        this.score += mergedValue;
        this.best_score = Math.max(this.best_score, this.score);
        index += 2;
      } else {
        merged.push(compacted[index]);
        index += 1;
      }
    }

    return [...merged, ...Array(4 - merged.length).fill(0)];
  }

  spawnTile() {
    const emptyCells = [];

    this.board.forEach((row, rowIndex) => {
      row.forEach((value, colIndex) => {
        if (value === 0) emptyCells.push([rowIndex, colIndex]);
      });
    });

    if (!emptyCells.length) return;

    const [row, col] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    this.board[row][col] = Math.random() < 0.9 ? 2 : 4;
  }

  gameOver() {
    if (this.board.some((row) => row.some((value) => value === 0))) {
      return false;
    }

    for (let row = 0; row < 4; row += 1) {
      for (let col = 0; col < 4; col += 1) {
        const value = this.board[row][col];
        if (row + 1 < 4 && value === this.board[row + 1][col]) return false;
        if (col + 1 < 4 && value === this.board[row][col + 1]) return false;
      }
    }

    return true;
  }

  transpose(board) {
    return board[0].map((_, colIndex) => board.map((row) => row[colIndex]));
  }

  areBoardsEqual(a, b) {
    return JSON.stringify(a) === JSON.stringify(b);
  }

  deepCopy(value) {
    return JSON.parse(JSON.stringify(value));
  }
}

function getSavedState() {
  const saved = localStorage.getItem('nova2048State');
  if (!saved) return null;

  try {
    return JSON.parse(saved);
  } catch {
    return null;
  }
}

function saveState() {
  if (state) {
    localStorage.setItem('nova2048State', JSON.stringify(state));
  }
}

function applyTranslations() {
  document.documentElement.lang = language;
  document.getElementById('page-description').content = text.description;
  newGameBtn.textContent = text.newGame;
  document.getElementById('score-label').textContent = text.score;
  document.getElementById('best-score-label').textContent = text.best;
  document.getElementById('game-over-eyebrow').textContent = text.gameOverEyebrow;
  document.getElementById('game-over-title').textContent = text.gameOverTitle;
  document.getElementById('game-over-description').textContent = text.gameOverDescription;
  document.getElementById('final-score-label').textContent = text.finalScore;
  restartGameBtn.textContent = text.restart;
  dismissGameOverBtn.textContent = text.dismiss;
}

function updateSoundToggle() {
  soundToggleBtn.textContent = soundEnabled ? text.soundOn : text.soundOff;
}

function loadState() {
  const saved = getSavedState();
  if (saved && saved.board && Array.isArray(saved.board) && saved.board.length === 4) {
    state = saved;
  } else {
    state = new Game2048().toObject();
  }
  if (localStorage.getItem('nova2048LightThemeDefault') !== '1') {
    state.theme = 'light';
    localStorage.setItem('nova2048LightThemeDefault', '1');
  }
  saveState();
  render();
  if (state.lost) showGameOverAlert();
}

function render() {
  if (!state) return;

  boardEl.innerHTML = '';
  const board = state.board || [];

  board.forEach((row) => {
    row.forEach((value) => {
      const tile = document.createElement('div');
      tile.className = `tile tile--${value || 0}`;
      tile.textContent = value ? value : '';
      boardEl.appendChild(tile);
    });
  });

  scoreEl.textContent = state.score || 0;
  bestScoreEl.textContent = state.best_score || 0;

  if (state.lost) {
    statusEl.textContent = '';
  } else if (state.won) {
    statusEl.textContent = text.won;
  } else {
    statusEl.textContent = text.instructions;
  }

  document.documentElement.setAttribute('data-theme', state.theme || 'light');
  themeToggleBtn.textContent = state.theme === 'dark' ? text.themeDark : text.themeLight;
  updateSoundToggle();
}

function showGameOverAlert() {
  finalScoreEl.textContent = String(state.score || 0);
  if (!gameOverDialog.open) {
    gameOverDialog.showModal();
  }
  restartGameBtn.focus();
}

function getTileMovementPlan(board, direction) {
  const plan = new Map();
  const isVertical = direction === 'up' || direction === 'down';
  const towardStart = direction === 'left' || direction === 'up';

  for (let lineIndex = 0; lineIndex < 4; lineIndex += 1) {
    const line = Array.from({ length: 4 }, (_, position) => {
      const offset = towardStart ? position : 3 - position;
      return isVertical ? offset * 4 + lineIndex : lineIndex * 4 + offset;
    });
    const tiles = line
      .map((index) => ({
        index,
        value: board[Math.floor(index / 4)][index % 4]
      }))
      .filter((tile) => tile.value !== 0);

    let sourcePosition = 0;
    let destinationPosition = 0;
    while (sourcePosition < tiles.length) {
      const first = tiles[sourcePosition];
      const merged = sourcePosition + 1 < tiles.length
        && first.value === tiles[sourcePosition + 1].value;
      const sourceIndices = merged
        ? [first.index, tiles[sourcePosition + 1].index]
        : [first.index];

      plan.set(line[destinationPosition], { sourceIndices, merged });
      sourcePosition += merged ? 2 : 1;
      destinationPosition += 1;
    }
  }

  return plan;
}

function addTileAnimation(tile, className) {
  tile.classList.add(className);
  tile.addEventListener('animationend', () => tile.classList.remove(className), { once: true });
}

function animateMergeGhost(sourceIndex, destinationTile, previousTiles, previousRects) {
  const sourceRect = previousRects[sourceIndex];
  const destinationRect = destinationTile.getBoundingClientRect();
  const ghost = previousTiles[sourceIndex].cloneNode(true);
  const offsetX = destinationRect.left - sourceRect.left;
  const offsetY = destinationRect.top - sourceRect.top;
  const duration = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 1 : 220;

  ghost.classList.add('tile--merge-ghost');
  Object.assign(ghost.style, {
    position: 'fixed',
    left: `${sourceRect.left}px`,
    top: `${sourceRect.top}px`,
    width: `${sourceRect.width}px`,
    height: `${sourceRect.height}px`,
    margin: '0',
    zIndex: '3',
    transform: 'none',
    transition: 'none',
    opacity: '1'
  });
  document.body.appendChild(ghost);

  ghost.animate([
    { transform: 'translate(0, 0) scale(1)', opacity: 1 },
    { transform: `translate(${offsetX}px, ${offsetY}px) scale(0.65)`, opacity: 0 }
  ], {
    duration,
    easing: 'cubic-bezier(.2,.8,.2,1)'
  }).onfinish = () => ghost.remove();
}

function animateTileMovement(plan, previousTiles, previousRects) {
  const currentTiles = Array.from(boardEl.children);
  const mappedDestinations = new Set(plan.keys());

  plan.forEach((movement, destinationIndex) => {
    const tile = currentTiles[destinationIndex];
    const sourceRect = previousRects[movement.sourceIndices[0]];
    const destinationRect = tile.getBoundingClientRect();
    const offsetX = sourceRect.left - destinationRect.left;
    const offsetY = sourceRect.top - destinationRect.top;

    if (offsetX !== 0 || offsetY !== 0) {
      tile.style.position = 'relative';
      tile.style.zIndex = '2';
      tile.style.transition = 'none';
      tile.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
      void tile.offsetWidth;
      requestAnimationFrame(() => {
        tile.style.transition = '';
        tile.style.transform = '';
      });

      const clearPositioning = (event) => {
        if (event.propertyName !== 'transform') return;
        tile.style.position = '';
        tile.style.zIndex = '';
        tile.removeEventListener('transitionend', clearPositioning);
      };
      tile.addEventListener('transitionend', clearPositioning);
    }

    if (movement.merged) {
      addTileAnimation(tile, 'tile--merged');
      animateMergeGhost(movement.sourceIndices[1], tile, previousTiles, previousRects);
    }
  });

  currentTiles.forEach((tile, index) => {
    if (!tile.classList.contains('tile--0') && !mappedDestinations.has(index)) {
      addTileAnimation(tile, 'tile--spawn');
    }
  });
}

function playMoveSound() {
  if (!soundEnabled) return;
  if (!audioContext) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    audioContext = AudioContextClass ? new AudioContextClass() : null;
  }
  if (!audioContext) return;

  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  const now = audioContext.currentTime;

  oscillator.type = 'triangle';
  oscillator.frequency.setValueAtTime(660, now);
  oscillator.frequency.exponentialRampToValueAtTime(900, now + 0.06);
  gainNode.gain.setValueAtTime(0.0001, now);
  gainNode.gain.exponentialRampToValueAtTime(0.025, now + 0.01);
  gainNode.gain.setValueAtTime(0.0001, now + 0.08);

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  oscillator.start(now);
  oscillator.stop(now + 0.08);
}

function move(direction) {
  const previousBoard = state.board.map((row) => [...row]);
  const previousTiles = Array.from(boardEl.children);
  const previousRects = previousTiles.map((tile) => tile.getBoundingClientRect());
  const wasLost = state.lost;
  const game = new Game2048(state);
  state = game.move(direction);
  saveState();
  render();
  if (JSON.stringify(previousBoard) !== JSON.stringify(state.board)) {
    animateTileMovement(getTileMovementPlan(previousBoard, direction), previousTiles, previousRects);
  }
  playMoveSound();
  if (!wasLost && state.lost) showGameOverAlert();
}

function resetGame() {
  if (gameOverDialog.open) {
    gameOverDialog.close();
  }
  const theme = state?.theme || 'light';
  state = new Game2048({ theme }).toObject();
  saveState();
  render();
}

function toggleTheme() {
  state.theme = state.theme === 'dark' ? 'light' : 'dark';
  saveState();
  render();
}

function handleKeydown(event) {
  const map = { ArrowLeft: 'left', ArrowRight: 'right', ArrowUp: 'up', ArrowDown: 'down', a: 'left', d: 'right', w: 'up', s: 'down' };
  if (map[event.key]) {
    event.preventDefault();
    move(map[event.key]);
  }
}

function handlePointerStart(event) {
  const point = event.touches ? event.touches[0] : event;
  gestureStart = { x: point.clientX, y: point.clientY };
}

function handlePointerEnd(event) {
  if (!gestureStart) return;
  const point = event.changedTouches ? event.changedTouches[0] : event;
  const dx = point.clientX - gestureStart.x;
  const dy = point.clientY - gestureStart.y;
  const threshold = 24;

  if (Math.abs(dx) > threshold || Math.abs(dy) > threshold) {
    if (Math.abs(dx) > Math.abs(dy)) {
      move(dx > 0 ? 'right' : 'left');
    } else {
      move(dy > 0 ? 'down' : 'up');
    }
  }

  gestureStart = null;
}

newGameBtn.addEventListener('click', resetGame);
restartGameBtn.addEventListener('click', resetGame);
dismissGameOverBtn.addEventListener('click', () => gameOverDialog.close());
themeToggleBtn.addEventListener('click', toggleTheme);
soundToggleBtn.addEventListener('click', () => {
  soundEnabled = !soundEnabled;
  updateSoundToggle();
});

window.addEventListener('keydown', handleKeydown);
boardEl.addEventListener('touchstart', handlePointerStart, { passive: true });
boardEl.addEventListener('touchend', handlePointerEnd, { passive: true });
boardEl.addEventListener('pointerdown', handlePointerStart, { passive: true });
boardEl.addEventListener('pointerup', handlePointerEnd, { passive: true });
boardEl.addEventListener('click', () => boardEl.focus());

applyTranslations();
loadState();
