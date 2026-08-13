// Particle Playground — pure JS, no HTML needed.
// Creates its own <canvas>, appends it to <body>, and runs.
// Just include this script in any page: <script src="particle_playground.js"></script>

(function () {
  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.background = '#05060a';
  canvas.style.cursor = 'crosshair';
  document.body.style.margin = '0';
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  let W, H;
  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const PALETTES = [
    ['#ff5f6d', '#ffc371', '#ff9a56'], // fire
    ['#4facfe', '#00f2fe', '#7de2fc'], // ice
    ['#a18cd1', '#fbc2eb', '#8e2de2'], // violet
    ['#38ef7d', '#11998e', '#a8ff78'], // emerald
    ['#ff00cc', '#333399', '#00c9ff'], // neon
  ];
  let paletteIndex = 0;
  let gravityOn = true;

  class Particle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 6 + 2;
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed;
      this.life = 1;
      this.decay = Math.random() * 0.012 + 0.008;
      this.size = Math.random() * 3 + 1.5;
      this.color = PALETTES[paletteIndex][Math.floor(Math.random() * 3)];
      this.drag = 0.98;
    }
    update() {
      this.vx *= this.drag;
      this.vy *= this.drag;
      if (gravityOn) this.vy += 0.06;
      this.x += this.vx;
      this.y += this.vy;
      this.life -= this.decay;
    }
    draw() {
      if (this.life <= 0) return;
      ctx.globalAlpha = Math.max(this.life, 0);
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.shadowColor = this.color;
      ctx.shadowBlur = 12;
      ctx.fill();
    }
  }

  let particles = [];

  function burst(x, y, count = 40) {
    for (let i = 0; i < count; i++) particles.push(new Particle(x, y));
  }

  function frame() {
    ctx.globalAlpha = 1;
    ctx.fillStyle = 'rgba(5, 6, 10, 0.18)';
    ctx.fillRect(0, 0, W, H);

    ctx.globalCompositeOperation = 'lighter';
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.update();
      p.draw();
      if (p.life <= 0 || p.y > H + 50 || p.x < -50 || p.x > W + 50) {
        particles.splice(i, 1);
      }
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;

    requestAnimationFrame(frame);
  }
  frame();

  let dragging = false;
  function getPos(e) {
    const rect = canvas.getBoundingClientRect();
    const point = e.touches ? e.touches[0] : e;
    return { x: point.clientX - rect.left, y: point.clientY - rect.top };
  }

  canvas.addEventListener('mousedown', (e) => {
    dragging = true;
    const p = getPos(e);
    burst(p.x, p.y, 60);
  });
  canvas.addEventListener('mousemove', (e) => {
    if (dragging) {
      const p = getPos(e);
      burst(p.x, p.y, 8);
    }
  });
  window.addEventListener('mouseup', () => (dragging = false));

  canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    dragging = true;
    const p = getPos(e);
    burst(p.x, p.y, 60);
  }, { passive: false });
  canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    if (dragging) {
      const p = getPos(e);
      burst(p.x, p.y, 8);
    }
  }, { passive: false });
  window.addEventListener('touchend', () => (dragging = false));

  window.addEventListener('keydown', (e) => {
    if (e.key >= '1' && e.key <= '5') paletteIndex = parseInt(e.key) - 1;
    if (e.code === 'Space') {
      e.preventDefault();
      gravityOn = !gravityOn;
    }
  });

  setInterval(() => {
    if (particles.length < 20) burst(Math.random() * W, Math.random() * H, 25);
  }, 1400);
})();