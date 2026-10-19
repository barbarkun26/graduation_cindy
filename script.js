/* ==========================================================
   CINDY'S FAREWELL & S2 GRADUATION JOURNEY
   Interactive Script: Confetti, Web Audio Synth, Guestbook & Gallery
   ========================================================== */

// --- 1. DEFAULT WISHES / SEED DATA ---
const DEFAULT_WISHES = [
  {
    id: 'seed-1',
    name: 'Bapak Prabowo Subianto',
    role: 'Presiden RI',
    message: 'Selamat melangkah ke S2 UPH, Cindy! 🎓 Terima kasih sudah menjadi warga indonesia yang gemoy serta perpendidikan',
    color: 'color-yellow',
    emoji: '🎓',
    date: 'Hari ini'
  },
  {
    id: 'seed-2',
    name: 'Haji Isam',
    role: 'Granpa',
    message: 'selamat dan sukses selalu cucuku',
    color: 'color-pink',
    emoji: '👑',
    date: 'Kemarin'
  },
  {
    id: 'seed-3',
    name: 'Gibran Rakabuming',
    role: 'RI 2',
    message: 'Nggak ada lagi yang ngingetin pesan es kopi pas jam 2 siang ☕🥲. Sukses terus Cindy! Pokoknya nanti pas wisuda S2 UPH kita kirim karangan bunga paling heboh!',
    color: 'color-blue',
    emoji: '☕',
    date: '2 hari lalu'
  },
  {
    id: 'seed-4',
    name: 'PPG',
    role: 'Fans Garis Keras Cindy',
    message: 'Langkah baru, cerita baru, versi terbaik dari kamu! ♡ Selamat fokus S2 di UPH. Semoga ilmunya berkah, lancar tesisnya, dan segera menyandang gelar Master! ✨',
    color: 'color-green',
    emoji: '✨',
    date: 'Baru saja'
  }
];

// --- 2. SOUND SYNTHESIZER (Web Audio API) ---
class SoundEffects {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
  }

  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  }

  playFanfare() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      // Celebratory chord progression: C5, E5, G5, C6
      const notes = [523.25, 659.25, 783.99, 1046.50];
      const now = this.ctx.currentTime;

      notes.forEach((freq, index) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + index * 0.08);

        gain.gain.setValueAtTime(0.001, now + index * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.2, now + index * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.08 + 0.4);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + index * 0.08);
        osc.stop(now + index * 0.08 + 0.45);
      });
    } catch (e) {
      console.warn('Audio effect error:', e);
    }
  }

  playPop() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.1);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.12);
    } catch (e) {
      console.warn('Pop sound error:', e);
    }
  }
}

const sfx = new SoundEffects();

// --- 3. CONFETTI & TOGA PARTICLES ENGINE ---
class CelebrationCanvas {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.emojis = ['🎓', '✨', '💛', '🌸', '👑', '🎉', '📚'];
    this.colors = ['#f59e0b', '#2563eb', '#ec4899', '#10b981', '#fbbf24', '#8b5cf6'];
    this.animating = false;

    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }

  burst(x = this.width / 2, y = this.height * 0.4, count = 75) {
    for (let i = 0; i < count; i++) {
      const isEmoji = Math.random() < 0.28;
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 12 + 4;

      this.particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - (Math.random() * 6 + 2),
        size: isEmoji ? Math.random() * 12 + 18 : Math.random() * 8 + 6,
        color: this.colors[Math.floor(Math.random() * this.colors.length)],
        isEmoji: isEmoji,
        emoji: this.emojis[Math.floor(Math.random() * this.emojis.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 12,
        gravity: 0.28,
        friction: 0.985,
        opacity: 1,
        life: 0,
        maxLife: Math.random() * 100 + 120
      });
    }

    if (!this.animating) {
      this.animating = true;
      this.loop();
    }
  }

  loop() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];

      p.vx *= p.friction;
      p.vy = (p.vy + p.gravity) * p.friction;
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.rotationSpeed;
      p.life++;

      p.opacity = Math.max(0, 1 - p.life / p.maxLife);

      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate((p.rotation * Math.PI) / 180);
      this.ctx.globalAlpha = p.opacity;

      if (p.isEmoji) {
        this.ctx.font = `${p.size}px "Segoe UI Emoji", "Apple Color Emoji", sans-serif`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(p.emoji, 0, 0);
      } else {
        this.ctx.fillStyle = p.color;
        this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      }

      this.ctx.restore();

      if (p.life >= p.maxLife || p.y > this.height + 50) {
        this.particles.splice(i, 1);
      }
    }

    if (this.particles.length > 0) {
      requestAnimationFrame(() => this.loop());
    } else {
      this.animating = false;
      this.ctx.clearRect(0, 0, this.width, this.height);
    }
  }
}

// --- 4. APP INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
  const celebration = new CelebrationCanvas('confettiCanvas');

  // Trigger celebration on load
  setTimeout(() => {
    celebration.burst(window.innerWidth * 0.3, window.innerHeight * 0.3, 60);
    celebration.burst(window.innerWidth * 0.7, window.innerHeight * 0.3, 60);
  }, 600);

  // --- BUTTON EVENT LISTENERS FOR CELEBRATION ---
  const celebrateButtons = [
    document.getElementById('celebrateBtnNav'),
    document.getElementById('tossCapBtn'),
    document.getElementById('bigCelebrationBtn')
  ];

  celebrateButtons.forEach(btn => {
    if (!btn) return;
    btn.addEventListener('click', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;

      celebration.burst(x, y, 90);
      celebration.burst(window.innerWidth / 2, window.innerHeight * 0.4, 70);
      sfx.playFanfare();
    });
  });

  // --- SOUND & BACKSOUND CONTROLLER (Radja - Cinderella, 01:30 - 02:10) ---
  const soundBtn = document.getElementById('soundToggleBtn');
  const soundIcon = document.getElementById('soundIcon');
  const bgMusic = document.getElementById('bgMusic');
  const musicBadge = document.getElementById('musicPlayerBadge');
  const musicStatusTag = document.getElementById('musicStatusTag');

  const MUSIC_START_TIME = 90;  // 01:30 in seconds (1m 30s)
  const MUSIC_END_TIME = 130;  // 02:10 in seconds (2m 10s)
  let isBacksoundActive = false;

  function updateMusicUI(playing) {
    isBacksoundActive = playing;
    if (playing) {
      if (soundIcon) soundIcon.textContent = '🔊';
      if (musicBadge) {
        musicBadge.classList.add('is-playing');
        musicBadge.classList.remove('is-paused');
      }
      if (musicStatusTag) musicStatusTag.textContent = 'Reff Cindy (01:30 - 02:10)';
    } else {
      if (soundIcon) soundIcon.textContent = '🔇';
      if (musicBadge) {
        musicBadge.classList.remove('is-playing');
        musicBadge.classList.add('is-paused');
      }
      if (musicStatusTag) musicStatusTag.textContent = 'Jeda • Klik untuk Putar';
    }
  }

  function playBacksound() {
    if (!bgMusic) return;
    try {
      if (bgMusic.currentTime < MUSIC_START_TIME || bgMusic.currentTime >= MUSIC_END_TIME) {
        bgMusic.currentTime = MUSIC_START_TIME;
      }
      bgMusic.volume = 0.65;
      const playPromise = bgMusic.play();

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            updateMusicUI(true);
            sfx.enabled = true;
          })
          .catch((err) => {
            // Autoplay policy prevented immediate unmuted playback
            console.log('Autoplay deferred until user interaction:', err);
            updateMusicUI(false);
            if (musicStatusTag) {
              musicStatusTag.textContent = '👆 Klik untuk Putar Lagu Cindy';
            }

            // Listen for the very first interaction to start playback
            const triggerPlaybackOnInteraction = () => {
              if (bgMusic.paused) {
                if (bgMusic.currentTime < MUSIC_START_TIME || bgMusic.currentTime >= MUSIC_END_TIME) {
                  bgMusic.currentTime = MUSIC_START_TIME;
                }
                bgMusic.play()
                  .then(() => {
                    updateMusicUI(true);
                    sfx.enabled = true;
                    showToast('🎵 Memutar Backsound: Radja - Cinderella (Cindy Edition)');
                  })
                  .catch(() => {});
              }
              window.removeEventListener('click', triggerPlaybackOnInteraction);
              window.removeEventListener('touchstart', triggerPlaybackOnInteraction);
              window.removeEventListener('scroll', triggerPlaybackOnInteraction);
              window.removeEventListener('keydown', triggerPlaybackOnInteraction);
            };

            window.addEventListener('click', triggerPlaybackOnInteraction, { once: true });
            window.addEventListener('touchstart', triggerPlaybackOnInteraction, { once: true });
            window.addEventListener('scroll', triggerPlaybackOnInteraction, { once: true });
            window.addEventListener('keydown', triggerPlaybackOnInteraction, { once: true });
          });
      }
    } catch (e) {
      console.warn('Audio playback error:', e);
    }
  }

  function pauseBacksound() {
    if (!bgMusic) return;
    bgMusic.pause();
    updateMusicUI(false);
    sfx.enabled = false;
  }

  function toggleBacksound() {
    if (!bgMusic) return;
    if (bgMusic.paused) {
      playBacksound();
      showToast('🎵 Memutar Backsound: Radja - Cinderella 👑');
    } else {
      pauseBacksound();
      showToast('🔇 Backsound & Efek Suara Dimatikan');
    }
  }

  if (bgMusic) {
    // Keep playback strictly between 01:30 (90s) and 02:10 (130s)
    bgMusic.addEventListener('loadedmetadata', () => {
      bgMusic.currentTime = MUSIC_START_TIME;
    });

    bgMusic.addEventListener('timeupdate', () => {
      // Loop back to 01:30 when reaching 02:10
      if (bgMusic.currentTime >= MUSIC_END_TIME) {
        bgMusic.currentTime = MUSIC_START_TIME;
        if (!bgMusic.paused) {
          bgMusic.play().catch(() => {});
        }
      }
    });

    bgMusic.addEventListener('seeking', () => {
      if (bgMusic.currentTime < MUSIC_START_TIME || bgMusic.currentTime > MUSIC_END_TIME) {
        bgMusic.currentTime = MUSIC_START_TIME;
      }
    });

    bgMusic.addEventListener('ended', () => {
      bgMusic.currentTime = MUSIC_START_TIME;
      bgMusic.play().catch(() => {});
    });

    // Start playback immediately when web opens
    playBacksound();
  }

  // Toggle button event listeners
  if (soundBtn) {
    soundBtn.addEventListener('click', toggleBacksound);
  }

  if (musicBadge) {
    musicBadge.addEventListener('click', toggleBacksound);
    musicBadge.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleBacksound();
      }
    });
  }

  // Press 'm' to mute/unmute
  window.addEventListener('keydown', (e) => {
    // Only if not currently typing in a text field
    if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;
    if (e.key.toLowerCase() === 'm') {
      toggleBacksound();
    }
  });

  // --- PHOTO MODE TABS (MISS PPG SPOTLIGHT) ---
  const modeTabs = document.querySelectorAll('.mode-tab');
  const photoTiara = document.getElementById('photoTiara');
  const photoCasual = document.getElementById('photoCasual');

  modeTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      modeTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const target = tab.getAttribute('data-target');
      if (target === 'tiara') {
        photoTiara.classList.add('active');
        photoCasual.classList.remove('active');
        celebration.burst(window.innerWidth * 0.3, window.innerHeight * 0.6, 40);
        sfx.playPop();
      } else {
        photoCasual.classList.add('active');
        photoTiara.classList.remove('active');
        sfx.playPop();
      }
    });
  });

  // --- STICKY NOTES WISHES BOARD ---
  const stickyBoard = document.getElementById('stickyBoard');
  const wishForm = document.getElementById('wishForm');

  function getStoredWishes() {
    try {
      const stored = localStorage.getItem('cindy_farewell_wishes');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
    return DEFAULT_WISHES;
  }

  function saveWishes(wishes) {
    try {
      localStorage.setItem('cindy_farewell_wishes', JSON.stringify(wishes));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  }

  function renderWishes() {
    const wishes = getStoredWishes();
    stickyBoard.innerHTML = '';

    wishes.forEach((w, index) => {
      // Random tilt between -3deg and +3deg for scrapbook feel
      const tilts = [-2.5, 1.8, -1.2, 2.2, -1.8, 1.5];
      const tilt = tilts[index % tilts.length];

      const note = document.createElement('div');
      note.className = `sticky-note ${w.color || 'color-yellow'}`;
      note.style.transform = `rotate(${tilt}deg)`;

      note.innerHTML = `
        <div>
          <div class="note-emoji-header">
            <span class="note-emoji">${w.emoji || '🎓'}</span>
            <span class="note-date">${w.date || 'Baru saja'}</span>
          </div>
          <p class="note-message">“${escapeHtml(w.message)}”</p>
        </div>
        <div class="note-footer">
          <span class="note-sender">${escapeHtml(w.name)}</span>
          <span class="note-role">${escapeHtml(w.role || 'Rekan Magang')}</span>
        </div>
      `;

      stickyBoard.appendChild(note);
    });
  }

  // Initial render of wishes
  renderWishes();

  // Handle form submission
  if (wishForm) {
    wishForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('senderName').value.trim();
      const role = document.getElementById('senderRole').value.trim();
      const message = document.getElementById('senderMessage').value.trim();

      const selectedColorInput = document.querySelector('input[name="noteColor"]:checked');
      const color = selectedColorInput ? selectedColorInput.value : 'color-yellow';

      const selectedEmojiInput = document.querySelector('input[name="noteEmoji"]:checked');
      const emoji = selectedEmojiInput ? selectedEmojiInput.value : '🎓';

      if (!name || !message) return;

      const newWish = {
        id: 'wish-' + Date.now(),
        name: name,
        role: role || 'Teman Magang',
        message: message,
        color: color,
        emoji: emoji,
        date: 'Baru saja'
      };

      const wishes = getStoredWishes();
      wishes.unshift(newWish); // add to top
      saveWishes(wishes);
      renderWishes();

      // Clear form
      wishForm.reset();

      // Celebration burst & sound
      celebration.burst(window.innerWidth * 0.7, window.innerHeight * 0.7, 80);
      sfx.playFanfare();

      showToast('🎉 Pesan berhasil ditempel di Papan Doa! Cindy pasti tersenyum membaca ini!');
    });
  }

  // --- TOAST FUNCTION ---
  function showToast(msg) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    if (!toast || !toastMessage) return;

    toastMessage.textContent = msg;
    toast.classList.remove('hidden');

    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
      toast.classList.add('hidden');
    }, 3800);
  }

  // --- ESCAPE HTML TO PREVENT XSS IN GUESTBOOK ---
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // --- ACTIVE NAVBAR LINK ON SCROLL ---
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  // --- 5. ULTRA-HD IMAGE VIEWER & FULLSCREEN BANNER MODAL ---
  const bannerModal = document.getElementById('bannerModal');
  const modalShell = document.getElementById('modalShell');
  const modalImage = document.getElementById('modalImage');
  const modalImageWrapper = document.getElementById('modalImageWrapper');
  const modalViewport = document.getElementById('modalViewport');
  const zoomLevelIndicator = document.getElementById('zoomLevelIndicator');
  const modalTitle = document.getElementById('modalTitle');
  const modalResolutionBadge = document.getElementById('modalResolutionBadge');
  const modalCaptionText = document.getElementById('modalCaptionText');
  const modalHdTag = document.getElementById('modalHdTag');
  const hdBtnLabel = document.getElementById('hdBtnLabel');
  const btnToggleHD = document.getElementById('btnToggleHD');
  const btnZoomIn = document.getElementById('btnZoomIn');
  const btnZoomOut = document.getElementById('btnZoomOut');
  const btnFitScreen = document.getElementById('btnFitScreen');
  const btnActualSize = document.getElementById('btnActualSize');
  const btnZoom2x = document.getElementById('btnZoom2x');
  const btnToggleFullscreen = document.getElementById('btnToggleFullscreen');
  const btnCloseModal = document.getElementById('btnCloseModal');
  const btnPrevMedia = document.getElementById('btnPrevMedia');
  const btnNextMedia = document.getElementById('btnNextMedia');
  const mainBannerCard = document.getElementById('mainBannerCard');

  if (bannerModal && modalImage && modalViewport) {
    let currentScale = 1;
    let panX = 0;
    let panY = 0;
    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let isHdActive = true;
    let naturalWidth = 1774;
    let naturalHeight = 887;
    let activeMemoryIndex = -1;

    // Collect all memory cards data for gallery slideshow
    const memoryCards = document.querySelectorAll('.memory-card');
    const memoriesData = Array.from(memoryCards).map((card, idx) => ({
      idx: idx,
      src: card.getAttribute('data-src'),
      title: card.getAttribute('data-title'),
      res: card.getAttribute('data-res'),
      w: parseInt(card.getAttribute('data-w') || '1600', 10),
      h: parseInt(card.getAttribute('data-h') || '1200', 10),
      desc: card.getAttribute('data-desc') || ''
    }));

    // Calculate optimal scale to fit image entirely inside viewport
    function calculateFitScale() {
      const padX = 40;
      const padY = 40;
      const availW = Math.max(modalViewport.clientWidth - padX, 200);
      const availH = Math.max(modalViewport.clientHeight - padY, 200);

      const scaleW = availW / naturalWidth;
      const scaleH = availH / naturalHeight;
      return Math.min(scaleW, scaleH, 1.0);
    }

    // Apply 2D transform and scale
    function applyTransform(animate = false) {
      if (animate) {
        modalImageWrapper.style.transition = 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)';
      } else {
        modalImageWrapper.style.transition = 'none';
      }

      modalImageWrapper.style.transform = `translate(calc(-50% + ${panX}px), calc(-50% + ${panY}px)) scale(${currentScale})`;

      // Update zoom percentage badge
      if (zoomLevelIndicator) {
        const percent = Math.round(currentScale * 100);
        zoomLevelIndicator.textContent = `${percent}%`;
      }
    }

    // Open image in fullscreen HD viewer with caption and memory index
    function openViewer(src, titleText, resText, natW, natH, captionText = '', memoryIdx = -1) {
      modalImage.src = src;
      naturalWidth = natW || 1774;
      naturalHeight = natH || 887;
      modalImage.style.width = naturalWidth + 'px';
      modalImage.style.height = naturalHeight + 'px';

      activeMemoryIndex = memoryIdx;

      if (modalTitle) modalTitle.innerHTML = titleText;
      if (modalResolutionBadge) modalResolutionBadge.textContent = resText;
      if (modalCaptionText) {
        modalCaptionText.textContent = captionText;
        modalCaptionText.style.display = captionText ? 'block' : 'none';
      }

      // Show/hide navigation arrows based on whether it's a memory photo
      if (btnPrevMedia && btnNextMedia) {
        const showNav = memoryIdx !== -1 && memoriesData.length > 1;
        btnPrevMedia.style.display = showNav ? 'flex' : 'none';
        btnNextMedia.style.display = showNav ? 'flex' : 'none';
      }

      // Reset positioning
      panX = 0;
      panY = 0;

      // Show dialog via native showModal
      if (typeof bannerModal.showModal === 'function') {
        if (!bannerModal.open) bannerModal.showModal();
      } else {
        bannerModal.setAttribute('open', '');
      }

      // Calculate initial fit after modal is rendered
      requestAnimationFrame(() => {
        currentScale = calculateFitScale();
        applyTransform(false);
      });

      // Sound & toast notification
      sfx.playFanfare();
      showToast(captionText ? '📸 Detail Kenangan Dibuka (Ultra HD)' : '🔍 Gambar Diperbesar Penuh (Ultra HD)');
    }

    // Navigate between memory photos
    function navigateMemory(direction) {
      if (activeMemoryIndex === -1 || memoriesData.length === 0) return;
      let nextIdx = activeMemoryIndex + direction;
      if (nextIdx < 0) nextIdx = memoriesData.length - 1;
      if (nextIdx >= memoriesData.length) nextIdx = 0;

      const item = memoriesData[nextIdx];
      openViewer(item.src, item.title, item.res, item.w, item.h, item.desc, nextIdx);
      sfx.playPop();
    }

    if (btnPrevMedia) btnPrevMedia.addEventListener('click', () => navigateMemory(-1));
    if (btnNextMedia) btnNextMedia.addEventListener('click', () => navigateMemory(1));

    // Wire up all memory cards
    memoryCards.forEach((card, index) => {
      const openCard = () => {
        const item = memoriesData[index];
        openViewer(item.src, item.title, item.res, item.w, item.h, item.desc, index);
      };

      card.addEventListener('click', openCard);
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openCard();
        }
      });
    });

    // Close viewer and exit fullscreen if active
    function closeViewer() {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
      bannerModal.close();
    }

    // Light-Dismiss Fallback (per Modern Web Guidance)
    if (!('closedBy' in HTMLDialogElement.prototype)) {
      bannerModal.addEventListener('click', (event) => {
        if (event.target !== bannerModal) return;
        const rect = modalShell.getBoundingClientRect();
        const isInside = (
          rect.top <= event.clientY &&
          event.clientY <= rect.top + rect.height &&
          rect.left <= event.clientX &&
          event.clientX <= rect.left + rect.width
        );
        if (!isInside) closeViewer();
      });
    }

    // Close button listener
    if (btnCloseModal) {
      btnCloseModal.addEventListener('click', closeViewer);
    }

    // Banner card click & keyboard triggers
    if (mainBannerCard) {
      mainBannerCard.addEventListener('click', () => {
        openViewer(
          'assets/Selamat Menempuh S2 di UPH.png',
          '📸 Banner Wisuda Cindy — S2 di UPH',
          '1774 × 887 PX',
          1774,
          887,
          'Langkah baru, cerita baru, versi terbaik dari Cindy! Selamat menempuh S2 di UPH.',
          -1
        );
      });

      mainBannerCard.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openViewer(
            'assets/Selamat Menempuh S2 di UPH.png',
            '📸 Banner Wisuda Cindy — S2 di UPH',
            '1774 × 887 PX',
            1774,
            887,
            'Langkah baru, cerita baru, versi terbaik dari Cindy! Selamat menempuh S2 di UPH.',
            -1
          );
        }
      });
    }

    // Also support clicking spotlight photos for complete experience
    const photoTiara = document.getElementById('photoTiara');
    const photoCasual = document.getElementById('photoCasual');

    if (photoTiara) {
      photoTiara.style.cursor = 'zoom-in';
      photoTiara.setAttribute('title', 'Klik untuk perbesar potret HD');
      photoTiara.addEventListener('click', () => {
        openViewer(
          'assets/Potret Selfie Miss PPG Bertiarap.png',
          '👑 Potret Selfie Miss PPG Bertiara — Cindy Agustiani S.H.',
          '1254 × 1254 PX',
          1254,
          1254,
          'Penobatan resmi Miss Maghub PPG: 100% Slay di segala situasi kantor!',
          -1
        );
      });
    }

    if (photoCasual) {
      photoCasual.style.cursor = 'zoom-in';
      photoCasual.setAttribute('title', 'Klik untuk perbesar potret HD');
      photoCasual.addEventListener('click', () => {
        openViewer(
          'assets/Screenshot 2026-10-19 135431.png',
          '🌸 Cindy Agustiani S.H — Mode Briefing Casual Magang',
          '500 × 500 PX',
          500,
          500,
          'Cindy dalam mode briefing casual: siap tempur dan selalu penuh senyuman manis.',
          -1
        );
      });
    }

    // Zoom In (+)
    if (btnZoomIn) {
      btnZoomIn.addEventListener('click', () => {
        currentScale = Math.min(currentScale * 1.3, 4.5);
        applyTransform(true);
        sfx.playPop();
      });
    }

    // Zoom Out (-)
    if (btnZoomOut) {
      btnZoomOut.addEventListener('click', () => {
        currentScale = Math.max(currentScale / 1.3, 0.25);
        applyTransform(true);
        sfx.playPop();
      });
    }

    // Fit Layar (Reset to full aspect fit)
    if (btnFitScreen) {
      btnFitScreen.addEventListener('click', () => {
        currentScale = calculateFitScale();
        panX = 0;
        panY = 0;
        applyTransform(true);
        sfx.playPop();
        showToast('🔄 Tampilan disesuaikan dengan layar');
      });
    }

    // 100% Asli (Pixel-to-pixel native sharpness)
    if (btnActualSize) {
      btnActualSize.addEventListener('click', () => {
        currentScale = 1.0;
        panX = 0;
        panY = 0;
        applyTransform(true);
        sfx.playPop();
        showToast('🎯 Resolusi Asli 100% (Pixel-to-Pixel Paling Tajam)');
      });
    }

    // 200% Detail Zoom
    if (btnZoom2x) {
      btnZoom2x.addEventListener('click', () => {
        currentScale = 2.0;
        panX = 0;
        panY = 0;
        applyTransform(true);
        sfx.playPop();
        showToast('🔬 Zoom 200%: Detail tulisan & gambar lebih jelas');
      });
    }

    // Toggle Ultra-HD Clarity Enhancement Filter ("Memperjelas Gambarnya")
    if (btnToggleHD) {
      btnToggleHD.addEventListener('click', () => {
        isHdActive = !isHdActive;
        if (isHdActive) {
          modalImage.classList.add('hd-enhanced');
          btnToggleHD.classList.add('active');
          if (hdBtnLabel) hdBtnLabel.textContent = 'Mode Jernih: Aktif';
          if (modalHdTag) {
            modalHdTag.textContent = '✨ MODE ULTRA HD AKTIF';
            modalHdTag.classList.remove('hd-off');
          }
          showToast('✨ Mode Ultra HD Aktif: Gambar diperjelas & lebih tajam!');
        } else {
          modalImage.classList.remove('hd-enhanced');
          btnToggleHD.classList.remove('active');
          if (hdBtnLabel) hdBtnLabel.textContent = 'Mode Jernih: Mati';
          if (modalHdTag) {
            modalHdTag.textContent = 'MODE STANDAR';
            modalHdTag.classList.add('hd-off');
          }
          showToast('Mode Standar Aktif');
        }
        sfx.playPop();
      });
    }

    // Toggle Fullscreen
    if (btnToggleFullscreen) {
      btnToggleFullscreen.addEventListener('click', () => {
        if (!document.fullscreenElement) {
          if (modalShell.requestFullscreen) {
            modalShell.requestFullscreen().catch(() => {});
          }
        } else {
          if (document.exitFullscreen) {
            document.exitFullscreen().catch(() => {});
          }
        }
      });
    }

    // Mouse Pan / Drag
    modalViewport.addEventListener('mousedown', (e) => {
      // Don't drag if clicked on button or child controls
      if (e.target.closest('button')) return;
      isDragging = true;
      dragStartX = e.clientX - panX;
      dragStartY = e.clientY - panY;
      modalViewport.classList.add('is-dragging');
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      panX = e.clientX - dragStartX;
      panY = e.clientY - dragStartY;
      applyTransform(false);
    });

    window.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        modalViewport.classList.remove('is-dragging');
      }
    });

    // Touch Pan & Pinch Zoom for Mobile / Tablets
    let initialTouchDist = 0;
    let initialScale = 1;

    modalViewport.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        isDragging = true;
        dragStartX = e.touches[0].clientX - panX;
        dragStartY = e.touches[0].clientY - panY;
      } else if (e.touches.length === 2) {
        isDragging = false;
        initialTouchDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        initialScale = currentScale;
      }
    }, { passive: true });

    modalViewport.addEventListener('touchmove', (e) => {
      if (isDragging && e.touches.length === 1) {
        panX = e.touches[0].clientX - dragStartX;
        panY = e.touches[0].clientY - dragStartY;
        applyTransform(false);
      } else if (e.touches.length === 2 && initialTouchDist > 0) {
        const dist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        const ratio = dist / initialTouchDist;
        currentScale = Math.min(Math.max(initialScale * ratio, 0.25), 4.5);
        applyTransform(false);
      }
    }, { passive: true });

    modalViewport.addEventListener('touchend', () => {
      isDragging = false;
      initialTouchDist = 0;
    });

    // Mouse Wheel Zoom
    modalViewport.addEventListener('wheel', (e) => {
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 1.15 : 0.88;
      currentScale = Math.min(Math.max(currentScale * zoomFactor, 0.25), 4.5);
      applyTransform(false);
    }, { passive: false });

    // Double-Click Quick Zoom Toggle
    modalViewport.addEventListener('dblclick', (e) => {
      if (e.target.closest('button')) return;
      const fit = calculateFitScale();
      if (currentScale <= fit * 1.25) {
        currentScale = 1.6;
      } else {
        currentScale = fit;
        panX = 0;
        panY = 0;
      }
      applyTransform(true);
      sfx.playPop();
    });

    // Keyboard Shortcuts inside Modal
    window.addEventListener('keydown', (e) => {
      if (!bannerModal.open) return;

      if (e.key === '+' || e.key === '=') {
        currentScale = Math.min(currentScale * 1.25, 4.5);
        applyTransform(true);
      } else if (e.key === '-' || e.key === '_') {
        currentScale = Math.max(currentScale / 1.25, 0.25);
        applyTransform(true);
      } else if (e.key === '0' || e.key.toLowerCase() === 'f') {
        currentScale = calculateFitScale();
        panX = 0;
        panY = 0;
        applyTransform(true);
      } else if (e.key === '1') {
        currentScale = 1.0;
        panX = 0;
        panY = 0;
        applyTransform(true);
      } else if (e.key.toLowerCase() === 'h') {
        if (btnToggleHD) btnToggleHD.click();
      } else if (e.key === 'ArrowLeft') {
        navigateMemory(-1);
      } else if (e.key === 'ArrowRight') {
        navigateMemory(1);
      }
    });

    // Window resize handler to maintain proper fit if in fit mode
    window.addEventListener('resize', () => {
      if (bannerModal.open && Math.abs(currentScale - calculateFitScale()) < 0.05) {
        currentScale = calculateFitScale();
        applyTransform(false);
      }
    });
  }
});
