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

  // --- SOUND TOGGLE ---
  const soundBtn = document.getElementById('soundToggleBtn');
  const soundIcon = document.getElementById('soundIcon');

  soundBtn.addEventListener('click', () => {
    const isEnabled = sfx.toggle();
    soundIcon.textContent = isEnabled ? '🔊' : '🔇';
    showToast(isEnabled ? 'Efek Suara Diaktifkan 🎵' : 'Efek Suara Dimatikan 🔇');
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
});
