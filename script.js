// ======= MATRIX EFFECT SETUP =======
const canvas = document.getElementById("matrix");
const ctx = canvas.getContext("2d");

// Resize canvas
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", () => {
  resizeCanvas();
  resetDrops();
});

// Characters for Matrix rain
const letters = "アァイィウヴエェオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワン".split("");

// Font settings
const fontSize = 14;
let drops;

// Initialize drops based on canvas width
function resetDrops() {
  const columns = canvas.width / fontSize;
  drops = Array.from({ length: columns }).fill(1);
}
resetDrops();

// Animation variables
let animationId;

// ======= MOBILE NAV TOGGLE =======
const headerInner = document.querySelector(".header-inner");
const menuToggle = document.querySelector(".menu-toggle");
const primaryNav = document.getElementById("primary-nav");

function closeMobileNav() {
  if (!headerInner) return;
  if (headerInner.classList.contains("nav-open")) {
    headerInner.classList.remove("nav-open");
    if (menuToggle) menuToggle.setAttribute("aria-expanded", "false");
  }
}

if (menuToggle && headerInner) {
  menuToggle.addEventListener("click", () => {
    const isOpen = headerInner.classList.toggle("nav-open");
    menuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });
}

window.addEventListener("resize", () => {
  if (window.innerWidth >= 768) closeMobileNav();
});

// Draw Matrix rain
function draw() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#0F0";
  ctx.font = fontSize + "px monospace";

  for (let i = 0; i < drops.length; i++) {
    const text = letters[Math.floor(Math.random() * letters.length)];
    ctx.fillText(text, i * fontSize, drops[i] * fontSize);

    if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
      drops[i] = 0;
    }
    drops[i]++;
  }

  animationId = requestAnimationFrame(draw);
}

// ======= NAV LINK TRIGGER =======
document.querySelectorAll("header nav a").forEach(link => {
  link.addEventListener("click", function(e) {
    e.preventDefault();
    const targetUrl = this.getAttribute("href");
    closeMobileNav();

    // Show canvas + start animation
    canvas.style.display = "block";
    draw();

    // Flag to continue effect on next page
    sessionStorage.setItem("matrixEffect", "true");

    // Delay before navigating
    setTimeout(() => {
      window.location.href = targetUrl;
    }, 1500); // 1.5 seconds before navigation
  });
});

// ======= CONTINUE EFFECT ON PAGE LOAD =======
window.addEventListener("load", () => {
  if (sessionStorage.getItem("matrixEffect") === "true") {
    canvas.style.display = "block";
    draw();

    // Remove the flag
    sessionStorage.removeItem("matrixEffect");

    // Stop after 1 second lingering
    setTimeout(() => {
      // Fade out the canvas
      canvas.style.opacity = "0";
      setTimeout(() => {
        cancelAnimationFrame(animationId);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.style.display = "none";
        canvas.style.opacity = "1"; // Reset for next time
      }, 600); // Match the CSS transition duration
    }, 1000); // 1 second lingering
  }
});

// ======= POWERGLITCH SETUP =======
const heroEl = document.querySelector(".hero-image");
if (heroEl && window.PowerGlitch) {
  PowerGlitch.glitch(heroEl, {
    playMode: "hover",
    createContainers: true,
    hideOverflow: false,
    timing: { duration: 4000, iterations: 1 },
    glitchTimeSpan: { start: 0.1, end: 0.9 },
    shake: { velocity: 15, amplitudeX: 0.2, amplitudeY: 0.2 },
    slice: { count: 10, velocity: 8, minHeight: 0.05, maxHeight: 0.15, hueRotate: true },
  });
}

// ======= REMOVE/SAFEGUARD OLD SINGLE-CANVAS BLOCK =======
// Guard so missing #shadesCanvas doesn't crash the file
const heroImage = document.querySelector(".hero-image");
const shadesCanvas = document.getElementById("shadesCanvas");
if (heroImage && shadesCanvas) {
  const scx = shadesCanvas.getContext("2d");
  const shadesSymbols = "01{}();<>=+- React.useEffect const let return";
  const shadesFontSize = 12;
  const shadesColumns = Math.floor(shadesCanvas.width / shadesFontSize);
  let shadesYpos = Array(shadesColumns).fill(0);
  let shadesAnimFrame;
  let shadesActive = false;

  function drawShadesMatrix() {
    scx.clearRect(0,0,shadesCanvas.width, shadesCanvas.height);
    scx.fillStyle = "rgba(9, 245, 29, 0.81)";
    scx.fillRect(0, 0, shadesCanvas.width, shadesCanvas.height);
    scx.fillStyle = "#0F0";
    scx.font = shadesFontSize + "px monospace";
    for (let i = 0; i < shadesColumns; i++) {
      const char = shadesSymbols[Math.floor(Math.random() * shadesSymbols.length)];
      scx.fillText(char, i * shadesFontSize, shadesYpos[i] * shadesFontSize);
      if (shadesYpos[i] * shadesFontSize > shadesCanvas.height && Math.random() > 0.975) shadesYpos[i] = 0;
      shadesYpos[i]++;
    }
    shadesAnimFrame = requestAnimationFrame(drawShadesMatrix);
  }

  heroImage.addEventListener("click", () => {
    shadesActive = !shadesActive;
    if (shadesActive) { heroImage.classList.add("active"); drawShadesMatrix(); }
    else { heroImage.classList.remove("active"); cancelAnimationFrame(shadesAnimFrame); scx.clearRect(0,0,shadesCanvas.width,shadesCanvas.height); }
  });
}

// ======= MINI LENS MATRIX (per-lens) =======
function startLensMatrix(canvas) {
  if (!canvas) return;

  // If already running, stop before restarting
  if (canvas.__rafId) cancelAnimationFrame(canvas.__rafId);

  const ctxL = canvas.getContext('2d');
  const fontSize = 12;
  const cols = Math.floor(canvas.width / fontSize);
  const drops = Array.from({ length: cols }, () => 1);

  function drawLens() {
    // Dark trail
    ctxL.globalCompositeOperation = 'source-over';
    ctxL.fillStyle = 'rgba(0,0,0,0.12)';
    ctxL.fillRect(0, 0, canvas.width, canvas.height);

    // Bright green letters
    ctxL.globalCompositeOperation = 'screen';
    ctxL.filter = 'saturate(1.6) brightness(1.35)';
    ctxL.fillStyle = '#00ff00';
    ctxL.shadowColor = '#00ff00';
    ctxL.shadowBlur = 3;
    ctxL.font = '900 ' + fontSize + 'px monospace';

    for (let i = 0; i < cols; i++) {
      const ch = letters[(Math.random() * letters.length) | 0];
      const x = i * fontSize;
      const y = drops[i] * fontSize;
      ctxL.fillText(ch, x, y);
      ctxL.fillText(ch, x, y); // double-pass to intensify
      if (y > canvas.height && Math.random() > 0.965) drops[i] = 0;
      drops[i]++;
    }

    // reset
    ctxL.shadowBlur = 0;
    ctxL.filter = 'none';
    ctxL.globalCompositeOperation = 'source-over';

    canvas.__rafId = requestAnimationFrame(drawLens);
  }
  drawLens();
}

function stopLensMatrix(canvas) {
  if (!canvas) return;
  if (canvas.__rafId) {
    cancelAnimationFrame(canvas.__rafId);
    canvas.__rafId = null;
  }
  const ctxL = canvas.getContext('2d');
  ctxL.clearRect(0, 0, canvas.width, canvas.height);
}

// ======= REVEAL/TOGGLE ON CLICK =======
(function initHeroGlasses() {
  const hero = document.querySelector('.hero-image');
  const left = document.getElementById('lensLeft');
  const right = document.getElementById('lensRight');
  if (!hero || !left || !right) return;

  let visible = false;
  hero.addEventListener('click', () => {
    visible = !visible;
    if (visible) {
      hero.classList.add('glasses-on');
      startLensMatrix(left);
      startLensMatrix(right);
    } else {
      hero.classList.remove('glasses-on');
      stopLensMatrix(left);
      stopLensMatrix(right);
    }
  });
})();

// Contact form: validate, then redirect to confirmation (no confetti here)
document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('section.contact form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    if (!form.checkValidity()) return; // let native validation run
    e.preventDefault();

    sessionStorage.setItem('msgSent', '1');
    window.location.href = 'confirmation-page.html?sent=1';
  });
});

// ======= FX overlays (confetti/flash/crack) =======
// If you already added these helpers earlier, keep them; otherwise this adds them.
function loadConfettiLib(cb) {
  if (window.confetti) return cb();
  const s = document.createElement('script');
  s.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.3/dist/confetti.browser.min.js';
  s.async = true;
  s.onload = cb;
  document.head.appendChild(s);
}

function burstConfetti() {
  const duration = 900;
  const end = Date.now() + duration;
  const colors = ['#89b389', '#004F4F', '#ffffff', '#a0d0a0'];
  (function frame() {
    window.confetti && window.confetti({
      particleCount: 60,
      spread: 65,
      origin: { y: 0.3 },
      colors
    });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}

// Remove (or ignore) the PNG preload; not needed for SVG version
// (function preloadCrack() { ... })();

// Replace crackOverlay to accept center and scale (default 15%)
function crackOverlay(opts = {}) {
  const { x, y, scale = 0.15 } = opts;

  const el = document.createElement('div');
  el.className = 'fx-overlay fx-crack';
  el.setAttribute('aria-hidden', 'true');

  const w = window.innerWidth;
  const h = window.innerHeight;
  const cx = typeof x === 'number' ? x : w * 0.5;
  const cy = typeof y === 'number' ? y : h * 0.5;

  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('width', '100%');
  svg.setAttribute('height', '100%');
  svg.setAttribute('viewBox', `0 0 ${w} ${h}`);

  // Adjust stroke thickness with scale
  el.style.setProperty('--crack-stroke', String(Math.max(0.5, 1.5 * scale)));

  // center impact
  const impact = document.createElementNS(svgNS, 'circle');
  impact.setAttribute('cx', cx);
  impact.setAttribute('cy', cy);
  impact.setAttribute('r', Math.min(w, h) * 0.02 * scale);
  impact.setAttribute('class', 'crack-impact');
  svg.appendChild(impact);

  // jagged rays
  function addRay(angleDeg, length, segments = 8) {
    const angle = (angleDeg * Math.PI) / 180;
    let x1 = cx, y1 = cy;
    const pts = [`${x1},${y1}`];
    for (let i = 1; i <= segments; i++) {
      const step = (length / segments) * (0.8 + Math.random() * 0.6);
      const jitter = (Math.random() - 0.5) * 0.25;
      const a = angle + jitter;
      x1 += Math.cos(a) * step;
      y1 += Math.sin(a) * step;
      pts.push(`${x1.toFixed(1)},${y1.toFixed(1)}`);
    }
    const poly = document.createElementNS(svgNS, 'polyline');
    poly.setAttribute('points', pts.join(' '));
    poly.setAttribute('class', 'crack-ray');
    svg.appendChild(poly);
  }

  const baseLen = Math.min(w, h);
  const rays = 14;
  for (let i = 0; i < rays; i++) {
    const base = (360 / rays) * i + (Math.random() * 14 - 7);
    const len = baseLen * (0.35 + Math.random() * 0.25) * scale;
    addRay(base, len, 7 + (Math.random() * 4 | 0));
  }

  el.appendChild(svg);
  document.body.appendChild(el);

  setTimeout(() => el.classList.add('fade'), 1200);
  setTimeout(() => el.remove(), 1800);
}

// Hook the DWH logo so the crack appears centered on the logo
(function hookLogoCrack() {
  const logo = document.getElementById('site-logo') || document.querySelector('header img');
  if (!logo || logo.dataset.crackHooked) return;
  logo.dataset.crackHooked = '1';
  logo.setAttribute('role', 'button');
  logo.setAttribute('tabindex', '0');
  if (!logo.title) logo.title = 'Click for a fun effect';

  const trigger = () => {
    const rect = logo.getBoundingClientRect();
    const x = rect.left + rect.width / 2;     // viewport (fixed) coords
    const y = rect.top + rect.height / 2;
    crackOverlay({ x, y, scale: 0.15 });      // 15% size, centered on logo
  };

  logo.addEventListener('click', trigger);
  logo.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); trigger(); }
  });
})();
 
// ======= Make the DWH logo trigger the crack effect =======
document.addEventListener('DOMContentLoaded', () => {
  const logo = document.querySelector('header .header-inner img[alt*="DWH"]') || 
               document.querySelector('header .header-inner img');

  if (logo && !logo.dataset.crackHooked) {
    logo.dataset.crackHooked = '1';
    logo.setAttribute('role', 'button');
    logo.setAttribute('tabindex', '0');
    if (!logo.title) logo.title = 'Click for a fun effect';

    const trigger = () => crackOverlay();
    logo.addEventListener('click', trigger);
    logo.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); trigger(); }
    });
  }
});

// ======= Confirmation page: replay confetti on load (if navigated from Contact)
document.addEventListener('DOMContentLoaded', () => {
  const confirmSection = document.querySelector('section.confirmation');
  if (!confirmSection) return;

  const qs = new URLSearchParams(location.search);
  const allowed = qs.get('sent') === '1' || sessionStorage.getItem('msgSent') === '1';
  if (!allowed) { location.replace('contact-page.html'); return; }
  sessionStorage.removeItem('msgSent');

  setTimeout(() => loadConfettiLib(burstConfetti), 200);
});
