// ==========================================================================
// Cute Shinchan Interactive Birthday Surprise - Master Audio Controller
// ==========================================================================

class AppAudioManager {
  constructor() {
    this.themeAudio = null;
    this.faahAudio = null;
    this.birthdayAudio = null;
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;

    this.themeAudio = document.getElementById('theme-audio') || new Audio('meme1.m4a');
    this.themeAudio.loop = true;
    this.themeAudio.volume = 1.0; // 100% Volume!

    this.faahAudio = document.getElementById('faah-audio') || new Audio('faaah.mp3');
    this.faahAudio.volume = 1.0; // 100% Volume!

    this.birthdayAudio = document.getElementById('birthday-audio') || new Audio('birthday.weba');
    this.birthdayAudio.loop = true;
    this.birthdayAudio.volume = 1.0; // 100% Volume!

    this.initialized = true;
  }

  // Play Core Theme (meme1.m4a) immediately at 100% volume
  playTheme() {
    this.init();

    // Stop birthday audio if running
    if (this.birthdayAudio) {
      this.birthdayAudio.pause();
      this.birthdayAudio.currentTime = 0;
    }

    if (this.themeAudio) {
      this.themeAudio.volume = 1.0;
      const promise = this.themeAudio.play();
      if (promise !== undefined) {
        promise.catch(e => {
          // If browser blocked unprompted autoplay, it will fire on first user touch/tap
          console.log('Autoplay policy waiting for initial interaction:', e);
        });
      }
    }
  }

  // Play 'faaah.mp3' at 100% volume when user clicks NO
  playFaah() {
    this.init();

    if (this.themeAudio && !this.themeAudio.paused) {
      this.themeAudio.pause();
    }

    if (this.faahAudio) {
      this.faahAudio.currentTime = 0;
      this.faahAudio.volume = 1.0;
      this.faahAudio.play().catch(e => console.log('Faah audio play error:', e));
    }
  }

  // Play Birthday Audio (birthday.weba) at 100% volume when gift is opened
  playBirthday() {
    this.init();

    if (this.themeAudio) {
      this.themeAudio.pause();
      this.themeAudio.currentTime = 0;
    }

    if (this.faahAudio) {
      this.faahAudio.pause();
      this.faahAudio.currentTime = 0;
    }

    if (this.birthdayAudio) {
      this.birthdayAudio.currentTime = 0;
      this.birthdayAudio.volume = 1.0;
      this.birthdayAudio.play().catch(e => console.log('Birthday audio error:', e));
    }
  }

  // Pause all background music (when video plays)
  pauseAll() {
    if (this.themeAudio) this.themeAudio.pause();
    if (this.faahAudio) this.faahAudio.pause();
    if (this.birthdayAudio) this.birthdayAudio.pause();
  }

  // Resume theme music
  resumeTheme() {
    this.init();
    if (this.faahAudio) {
      this.faahAudio.pause();
      this.faahAudio.currentTime = 0;
    }
    if (this.themeAudio) {
      this.themeAudio.volume = 1.0;
      this.themeAudio.play().catch(e => console.log('Resume theme error:', e));
    }
  }

  // Reset to initial state
  resetAll() {
    this.pauseAll();
    if (this.themeAudio) this.themeAudio.currentTime = 0;
    if (this.faahAudio) this.faahAudio.currentTime = 0;
    if (this.birthdayAudio) this.birthdayAudio.currentTime = 0;
  }
}

window.appAudio = new AppAudioManager();

// Immediately attempt playback as soon as script executes
function tryImmediatePlay() {
  window.appAudio.playTheme();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', tryImmediatePlay);
} else {
  tryImmediatePlay();
}

// Fallback to guarantee immediate start on the very first touch/click anywhere on page
const triggerEvents = ['click', 'touchstart', 'pointerdown', 'keydown', 'scroll'];
function handleFirstInteraction() {
  window.appAudio.playTheme();
  triggerEvents.forEach(evt => window.removeEventListener(evt, handleFirstInteraction, true));
}
triggerEvents.forEach(evt => window.addEventListener(evt, handleFirstInteraction, { capture: true, once: true }));
