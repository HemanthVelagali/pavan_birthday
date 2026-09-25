// ==========================================================================
// Cute Shinchan Interactive Birthday Surprise - Conditional Logic Controller
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  // --- State ---
  let currentSlide = 1;
  const totalSlides = 6;
  let candlesBlown = false;

  // --- Slide Elements ---
  const slides = document.querySelectorAll('.slide');

  // Slide 1 Buttons
  const s1YesBtn = document.getElementById('s1-yes-btn');
  const s1NoBtn = document.getElementById('s1-no-btn');

  // Slide 2 Button
  const s2TryAgainBtn = document.getElementById('s2-tryagain-btn');

  // Slide 3 Buttons (Double YES)
  const s3YesButtons = document.querySelectorAll('.s3-yes-btn');

  // Slide 4 Gift Boxes
  const giftBoxes = document.querySelectorAll('.gift-box-wrapper');

  // Slide 5 Elements
  const s5NextBtn = document.getElementById('s5-next-btn');
  const heroQuoteCards = document.querySelectorAll('.hero-quote-card');
  const uploadPhotoBtn = document.getElementById('upload-photo-btn');
  const userPhotoInput = document.getElementById('user-photo-input');
  const avengersMainImg = document.getElementById('avengers-main-img');

  // Slide 6 Video & Cake
  const finalVideo = document.getElementById('final-wish-video');
  const interactiveCake = document.getElementById('interactive-cake');
  const blowCandlesBtn = document.getElementById('blow-candles-btn');
  const blowStatusText = document.getElementById('blow-status-text');
  const triggerConfettiBtn = document.getElementById('trigger-confetti-btn');
  const restartFromEndBtn = document.getElementById('restart-from-end-btn');

  // Ensure Pavan's birthday photo is always the default
  if (avengersMainImg) {
    avengersMainImg.src = 'assets/pawan_birthday.png';
  }

  // --- Slide Transition Function ---
  function goToSlide(targetSlide) {
    if (targetSlide < 1 || targetSlide > totalSlides) return;
    currentSlide = targetSlide;

    slides.forEach((slide) => {
      const slideNum = parseInt(slide.dataset.slide, 10);
      if (slideNum === currentSlide) {
        slide.classList.add('active');
        slide.scrollTop = 0;
      } else {
        slide.classList.remove('active');
      }
    });

    // Handle slide-specific actions
    if (currentSlide === 4) {
      setTimeout(() => {
        window.confettiEngine?.burst(window.innerWidth / 2, window.innerHeight * 0.4, 30);
      }, 200);
    } else if (currentSlide === 5) {
      // Celebratory Confetti for Avengers
      setTimeout(() => {
        window.confettiEngine?.burst(window.innerWidth * 0.3, window.innerHeight * 0.3, 70);
        window.confettiEngine?.burst(window.innerWidth * 0.7, window.innerHeight * 0.3, 70);
      }, 200);
    } else if (currentSlide === 6) {
      // Final video slide: Stop background music so the video audio plays clearly!
      window.appAudio?.pauseAll();
      if (finalVideo) {
        finalVideo.currentTime = 0;
        finalVideo.play().catch(e => {
          console.log('Video autoplay needs user gesture:', e);
        });
      }
    }
  }

  // ========================================================================
  // CONDITIONAL FLOW (IF / ELSE)
  // ========================================================================

  // 1. SLIDE 1: Do you wanna see it?
  s1YesBtn?.addEventListener('click', () => {
    // Start meme1.m4a base theme & advance to Slide 3
    window.appAudio?.playTheme();
    goToSlide(3);
  });

  s1NoBtn?.addEventListener('click', () => {
    // Play 'faaah.mp3' & show crying screen (Slide 2)
    window.appAudio?.playFaah();
    goToSlide(2);
  });

  // 2. SLIDE 2: HOW DARE YOU!?
  s2TryAgainBtn?.addEventListener('click', () => {
    // Resume meme1.m4a base theme & advance to Slide 3
    window.appAudio?.resumeTheme();
    goToSlide(3);
  });

  // 3. SLIDE 3: Are you really excited? (Double YES)
  s3YesButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      // Ensure theme music is playing & advance to Gifts (Slide 4)
      window.appAudio?.playTheme();
      goToSlide(4);
    });
  });

  // 4. SLIDE 4: Interactive Gift Boxes
  giftBoxes.forEach((gift) => {
    gift.addEventListener('click', () => {
      // Stop meme1.m4a and switch to birthday.weba audio!
      window.appAudio?.playBirthday();

      const rect = gift.getBoundingClientRect();
      const clickX = rect.left + rect.width / 2;
      const clickY = rect.top + rect.height / 2;
      window.confettiEngine?.burst(clickX, clickY, 80);

      // Bounce animation on box
      gift.style.transform = 'scale(1.25) rotate(-5deg)';
      setTimeout(() => {
        gift.style.transform = 'scale(1.3) rotate(5deg)';
      }, 150);

      setTimeout(() => {
        gift.style.transform = '';
        goToSlide(5); // Go to Avengers Wishes (Slide 5)
      }, 700);
    });
  });

  // 5. SLIDE 5: Avengers Wishes -> Final Video Page
  s5NextBtn?.addEventListener('click', () => {
    goToSlide(6); // Go to Final Video Slide!
  });

  heroQuoteCards.forEach((card) => {
    card.addEventListener('click', () => {
      card.style.transform = 'scale(1.05) translateX(8px)';
      card.style.borderColor = '#FFD54F';
      setTimeout(() => {
        card.style.transform = '';
      }, 300);
    });
  });

  // Upload/Change Photo handler
  uploadPhotoBtn?.addEventListener('click', () => {
    userPhotoInput?.click();
  });

  userPhotoInput?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target.result;
        avengersMainImg.src = result;
        localStorage.setItem('shinchan_birthday_photo', result);
        window.confettiEngine?.burst(window.innerWidth / 2, window.innerHeight / 2, 60);
      };
      reader.readAsDataURL(file);
    }
  });

  // 6. SLIDE 6: Cake & Candle Blowout on Final Page
  function blowCandles() {
    if (candlesBlown) {
      candlesBlown = false;
      blowStatusText.textContent = 'Click Cake to Blow Out Candles!';
      const cakeImg = document.getElementById('cake-img');
      if (cakeImg) cakeImg.style.filter = '';
      return;
    }

    candlesBlown = true;

    // Smoke puff animation
    const cakeWrapper = document.getElementById('cake-svg-wrapper');
    if (cakeWrapper) {
      const smoke = document.createElement('div');
      smoke.className = 'smoke-puff';
      smoke.innerHTML = `
        <svg width="80" height="80" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="30" fill="rgba(200, 200, 200, 0.7)" filter="blur(8px)"/>
        </svg>
      `;
      cakeWrapper.appendChild(smoke);
      setTimeout(() => smoke.remove(), 1200);
    }

    const cakeImg = document.getElementById('cake-img');
    if (cakeImg) cakeImg.style.filter = 'drop-shadow(0 0 20px rgba(0,0,0,0.2))';

    // Massive Confetti
    setTimeout(() => {
      window.confettiEngine?.burst(window.innerWidth * 0.5, window.innerHeight * 0.4, 140);
      window.confettiEngine?.burst(window.innerWidth * 0.2, window.innerHeight * 0.5, 60);
      window.confettiEngine?.burst(window.innerWidth * 0.8, window.innerHeight * 0.5, 60);
    }, 250);

    blowStatusText.innerHTML = '✨ WISH GRANTED! Happy Birthday! 💖';
    blowCandlesBtn.style.background = '#E8F5E9';
    blowCandlesBtn.style.borderColor = '#4CAF50';
    blowCandlesBtn.style.color = '#2E7D32';
  }

  interactiveCake?.addEventListener('click', blowCandles);
  blowCandlesBtn?.addEventListener('click', blowCandles);

  triggerConfettiBtn?.addEventListener('click', () => {
    window.confettiEngine?.burst(window.innerWidth / 2, window.innerHeight / 2, 100);
  });

  restartFromEndBtn?.addEventListener('click', () => {
    if (finalVideo) {
      finalVideo.pause();
      finalVideo.currentTime = 0;
    }
    window.appAudio?.resetAll();
    window.appAudio?.playTheme();
    goToSlide(1);
  });
});
