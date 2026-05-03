

let elapsed    = 0;           // Total seconds elapsed (increments every second)
let timerId    = null;        // Stores setInterval ID for cleanup
let isRunning  = false;       // Tracks timer state (prevents duplicate starts)

const display  = document.getElementById('timer');      // Main time display element
const statusEl = document.getElementById('status');     // Status message element
const startBtn = document.getElementById('startBtn');   // Start button reference
const pauseBtn = document.getElementById('pauseBtn');   // Pause button reference
const resetBtn = document.getElementById('resetBtn');   // Reset button reference

// ── Utility ───────────────────────────────────────────────────
const fmt = n => String(n).padStart(2, '0');  // Formats numbers with leading zeros (e.g., 5 → "05")

function render() {
  const h = Math.floor(elapsed / 3600);     // Calculate hours
  const m = Math.floor((elapsed % 3600) / 60);  // Calculate minutes
  const s = elapsed % 60;                   // Calculate seconds
  display.textContent = `${fmt(h)}:${fmt(m)}:${fmt(s)}`;  // Update display with formatted time
}

function updateStatus(text, cls) {
  statusEl.textContent = text;              // Set status text
  statusEl.className   = cls;               // Update status CSS class for styling
}

// ── Actions ───────────────────────────────────────────────────
function startTimer() {
  if (isRunning) return;                    // Idempotent: ignore if already running
  isRunning = true;
  timerId = setInterval(function () {       // Start 1-second interval with anonymous function
    elapsed++;                              // Increment elapsed time
    render();                               // Refresh display
  }, 1000);
  updateStatus('RUNNING', 'running');
}

function pauseTimer() {
  if (!isRunning) return;                   // Idempotent: ignore if already paused
  clearInterval(timerId);                   // Stop the interval timer
  isRunning = false;
  updateStatus('PAUSED', 'paused');
}

function resetTimer() {
  clearInterval(timerId);                   // Always clear any existing interval first
  isRunning = false;
  elapsed   = 0;                            // Reset elapsed time to zero
  render();                                 // Update display immediately
  updateStatus('READY', 'reset');
}

// ── Button Listeners ──────────────────────────────────────────
startBtn.addEventListener('click', function () { startTimer(); });  // Attach click handlers
pauseBtn.addEventListener('click', function () { pauseTimer(); });
resetBtn.addEventListener('click', function () { resetTimer(); });

// ── Keyboard Shortcuts ────────────────────────────────────────
// Single-key shortcuts: 's'=start, 'p'=pause, 'r'=reset
document.addEventListener('keydown', function (e) {
  const map = { s: startTimer, p: pauseTimer, r: resetTimer };  // Key-to-function mapping
  const fn  = map[e.key.toLowerCase()];                         // Get function for pressed key
  if (fn) fn();                                                 // Execute if valid key
});