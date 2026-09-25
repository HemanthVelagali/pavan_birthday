// ==========================================================================
// Cute Shinchan Interactive Birthday Surprise - Conditional Logic Controller
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  // --- State ---
  let currentSlide = 1;
  const totalSlides = 6;

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

  // Slide 6 Video & Actions
  const finalVideo = document.getElementById('final-wish-video');
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

  // 5. SLIDE 5: Avengers Wishes & Interactive Hero Photo Switcher
  s5NextBtn?.addEventListener('click', () => {
    goToSlide(6); // Go to Final Video Slide!
  });

  const heroData = {
    pavan: {
      src: 'assets/pawan_birthday.png',
      alt: 'Happy Birthday Pavan!',
      caption: '✨ Birthday Boy Pavan ✨'
    },
    ironman: {
      src: 'assets/ironman.jpg',
      alt: 'Tony Stark / Iron Man',
      caption: '🔴 Tony Stark / Iron Man: I Love You 3000! 🤖'
    },
    captain: {
      src: 'assets/captain.jpg',
      alt: 'Steve Rogers / Captain America',
      caption: '🔵 Steve Rogers / Captain America: Cap is Back! 🛡️'
    },
    thor: {
      src: 'assets/thor.jpg',
      alt: 'Thor / God of Thunder',
      caption: '⚡ Thor / God of Thunder: For Valhalla! 🔨'
    },
    spiderman: {
      src: 'assets/peter.jpg',
      alt: 'Peter Parker / Spider-Man',
      caption: '🕷️ Peter Parker / Spider-Man: Friendly Neighborhood Spidey! 🕸️'
    },
    hulk: {
      src: 'assets/hulk.jpg',
      alt: 'The Incredible Hulk',
      caption: '🟢 The Incredible Hulk: Hulk Celebrate Pavan! 💥'
    }
  };

  const photoFrameCaption = document.getElementById('photo-frame-caption');
  const heroPillBtns = document.querySelectorAll('.hero-pill-btn');

  function selectHero(heroKey) {
    const data = heroData[heroKey];
    if (!data || !avengersMainImg) return;

    avengersMainImg.style.opacity = '0.25';
    avengersMainImg.style.transform = 'scale(0.97)';
    setTimeout(() => {
      avengersMainImg.src = data.src;
      avengersMainImg.alt = data.alt;
      if (photoFrameCaption) {
        photoFrameCaption.textContent = data.caption;
      }
      avengersMainImg.style.opacity = '1';
      avengersMainImg.style.transform = 'scale(1)';
    }, 150);

    // Update active pill button
    heroPillBtns.forEach(btn => {
      if (btn.dataset.targetHero === heroKey) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Update active quote card
    heroQuoteCards.forEach(card => {
      if (card.dataset.hero === heroKey) {
        card.classList.add('active-hero');
      } else {
        card.classList.remove('active-hero');
      }
    });
  }

  heroQuoteCards.forEach((card) => {
    card.addEventListener('click', () => {
      const heroKey = card.dataset.hero;
      if (card.classList.contains('active-hero')) {
        selectHero('pavan');
      } else {
        selectHero(heroKey);
      }
    });
  });

  heroPillBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const heroKey = btn.dataset.targetHero;
      selectHero(heroKey);
    });
  });

  const interactivePhotoFrame = document.getElementById('interactive-photo-frame');
  interactivePhotoFrame?.addEventListener('click', () => {
    const activePill = document.querySelector('.hero-pill-btn.active');
    if (activePill && activePill.dataset.targetHero !== 'pavan') {
      selectHero('pavan');
    }
  });



  // 6. SLIDE 6: Actions on Final Video Page

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
