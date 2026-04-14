document.addEventListener('DOMContentLoaded', () => {
  setupBootSequence();
  setupScrollReveal();
  setupTerminalCode();
  setupSlider();
  setupParallaxEffects();
  setupCustomCursor();
  setupParticleCanvas();
  setupKeyboardSlides();
  setupCreditsDetonationEffect();
});

// Boot Sequence Overlay
function setupBootSequence() {
  const overlay = document.getElementById('boot-overlay');
  const logsContainer = document.getElementById('boot-logs');
  if (!overlay) return;

  const bootLines = [
    "[SYS] INITIALIZING KERNEL...",
    "[SYS] MOUNTING MAGNETIC CONTAINMENT VFS...",
    "[OK] SUPERCONDUCTORS AT 77K.",
    "[OK] GYROTRONS ON STANDBY.",
    "[SYS] CONNECTING TO EXASCALE NEURAL NET...",
    "[OK] REINFORCEMENT LEARNING AGENT DEPLOYED.",
    "[WARN] CLEARING CREW ROSTER CACHE...",
    "[SYS] REACTOR BOOT SEQUENCE COMPLETE. IGNITION IN 3... 2... 1..."
  ];

  let lineIdx = 0;
  function addBootLine() {
    if (lineIdx < bootLines.length) {
      const line = document.createElement('div');
      line.textContent = bootLines[lineIdx];
      logsContainer.appendChild(line);
      lineIdx++;
      setTimeout(addBootLine, Math.random() * 200 + 100);
    } else {
      setTimeout(() => {
        overlay.classList.add('hidden');
        setTimeout(() => overlay.remove(), 1000); // Remove from DOM after fade
      }, 600);
    }
  }

  // Start sequence
  setTimeout(addBootLine, 500);
}

// Custom Cursor Dynamics
function setupCustomCursor() {
  const dot = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');

  if (!dot || !ring) return;

  window.addEventListener('mousemove', (e) => {
    dot.style.left = `${e.clientX}px`;
    dot.style.top = `${e.clientY}px`;

    // Slight delay for ring
    setTimeout(() => {
      ring.style.left = `${e.clientX}px`;
      ring.style.top = `${e.clientY}px`;
    }, 50);
  });

  // Add hover effects on interactive elements
  const interactives = document.querySelectorAll('.glass-panel, .crew-member, .slider-card');
  interactives.forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
}

// Particle Canvas Background
function setupParticleCanvas() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;
  let particles = [];

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.size = Math.random() * 2 + 0.5;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0) this.x = width;
      if (this.x > width) this.x = 0;
      if (this.y < 0) this.y = height;
      if (this.y > height) this.y = 0;
    }
    draw() {
      ctx.fillStyle = 'rgba(0, 243, 255, 0.5)';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  for (let i = 0; i < 50; i++) particles.push(new Particle());

  function animate() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    // Draw connecting lines if close
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(0, 243, 255, ${0.2 - dist / 500})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animate);
  }
  animate();
}

// Scroll Reveal Effect
function setupScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // If it's module 6, start terminal, but terminal runs infinite anyway
      }
    });
  }, { threshold: 0.15 });

  reveals.forEach(reveal => observer.observe(reveal));
}

// Terminal Fake Code Flow for Module 6
function setupTerminalCode() {
  const codeContainer = document.getElementById('live-code');
  if (!codeContainer) return;

  const codeLines = [
    "> INITIATING REINFORCEMENT LEARNING AGENT...",
    "> LOADING MAGNETIC_FIELD_CONFIG_V4.json",
    "> OVERRIDING COIL {1..19} CURRENT LIMITS",
    "> [WARN] PLASMA DEFORMATION DETECTED AT SECTOR 7",
    "> RECALCULATING PID LOOP... DONE (3ms)",
    "> APPLYING 1.2e6 AMPS TO HTS COIL 7",
    "> STABILITY RESTORED. Q-FACTOR ESTIMATE: 1.05",
    "> STREAMING CAMERA DATA: 🚀 INFRARED ACTIVE",
    "> EXASCALE DIGITAL TWIN SYNC: OK",
    "> COMMITTING MAGNETOHYDRODYNAMIC LOGS TO DB..."
  ];

  let lineCount = 0;

  function addLine() {
    const line = document.createElement('div');
    // random line from the array, or sequential
    const text = codeLines[lineCount % codeLines.length];

    // add randomly generated timestamps
    const date = new Date();
    const timestamp = `[${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}.${date.getMilliseconds().toString().padStart(3, '0')}]`;

    line.textContent = `${timestamp} ${text}`;
    codeContainer.appendChild(line);

    lineCount++;

    // Keep only last 15 lines so it doesn't overflow memory
    if (codeContainer.children.length > 15) {
      codeContainer.removeChild(codeContainer.firstChild);
    }

    // auto-scroll behavior is faked via overflow-hidden + gradient in CSS, but we can physically scroll to bottom
    codeContainer.parentElement.scrollTop = codeContainer.parentElement.scrollHeight;

    setTimeout(addLine, Math.random() * 800 + 200); // random delay between 200ms and 1000ms
  }

  addLine();
}

// Draggable Slider for Module 8
function setupSlider() {
  const slider = document.getElementById('reactor-slider');
  const track = document.getElementById('slider-track');
  if (!slider || !track) return;

  let isDown = false;
  let startX;
  let scrollLeft;

  slider.addEventListener('mousedown', (e) => {
    isDown = true;
    slider.classList.add('active');
    startX = e.pageX - slider.offsetLeft;
    scrollLeft = track.style.transform ? parseInt(track.style.transform.replace('translateX(', '').replace('px)', '')) || 0 : 0;
  });

  slider.addEventListener('mouseleave', () => { isDown = false; slider.classList.remove('active'); });
  slider.addEventListener('mouseup', () => { isDown = false; slider.classList.remove('active'); });

  slider.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX) * 2;
    let target = scrollLeft + walk;

    if (target > 0) target = 0;
    const limit = -(track.scrollWidth - slider.clientWidth);
    if (target < limit) target = limit;

    track.style.transform = `translateX(${target}px)`;
  });

  // Touch support
  slider.addEventListener('touchstart', (e) => {
    isDown = true;
    startX = e.touches[0].pageX - slider.offsetLeft;
    scrollLeft = track.style.transform ? parseInt(track.style.transform.replace('translateX(', '').replace('px)', '')) || 0 : 0;
  }, { passive: true });
  slider.addEventListener('touchend', () => { isDown = false; });
  slider.addEventListener('touchmove', (e) => {
    if (!isDown) return;
    const x = e.touches[0].pageX - slider.offsetLeft;
    const walk = (x - startX) * 2;
    let target = scrollLeft + walk;
    if (target > 0) target = 0;
    const limit = -(track.scrollWidth - slider.clientWidth);
    if (target < limit) target = limit;
    track.style.transform = `translateX(${target}px)`;
  }, { passive: true });
}

// Parallax logic
function setupParallaxEffects() {
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const stars = document.getElementById('bg-stars');
    const nebula = document.getElementById('bg-nebula');
    if (stars) stars.style.transform = `translateY(${scrollY * 0.1}px)`;
    if (nebula) nebula.style.transform = `translateY(${scrollY * 0.3}px)`;
  });
}

// Keyboard slide navigation
function setupKeyboardSlides() {
  const sections = Array.from(document.querySelectorAll('.section'));
  if (!sections.length) return;

  let currentSectionIndex = 0;
  let isAnimating = false;

  function updateCurrentSection() {
    const viewportMiddle = window.scrollY + window.innerHeight * 0.5;

    let closestIndex = 0;
    let smallestDistance = Number.POSITIVE_INFINITY;

    sections.forEach((section, index) => {
      const sectionCenter = section.offsetTop + section.offsetHeight * 0.5;
      const distance = Math.abs(sectionCenter - viewportMiddle);
      if (distance < smallestDistance) {
        smallestDistance = distance;
        closestIndex = index;
      }
    });

    currentSectionIndex = closestIndex;
  }

  function goToSection(index) {
    const boundedIndex = Math.max(0, Math.min(index, sections.length - 1));
    if (boundedIndex === currentSectionIndex) return;

    isAnimating = true;
    currentSectionIndex = boundedIndex;

    sections[boundedIndex].scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });

    window.setTimeout(() => {
      isAnimating = false;
      updateCurrentSection();
    }, 700);
  }

  updateCurrentSection();
  window.addEventListener('scroll', updateCurrentSection, { passive: true });
  window.addEventListener('resize', updateCurrentSection);

  window.addEventListener('keydown', (event) => {
    const target = event.target;
    const isEditable = target instanceof HTMLElement && (
      target.isContentEditable ||
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.tagName === 'SELECT'
    );
    if (isEditable || isAnimating) return;

    const nextKeys = ['ArrowRight', 'ArrowDown', 'PageDown', ' '];
    const prevKeys = ['ArrowLeft', 'ArrowUp', 'PageUp'];

    if (nextKeys.includes(event.key)) {
      event.preventDefault();
      goToSection(currentSectionIndex + 1);
      return;
    }

    if (prevKeys.includes(event.key)) {
      event.preventDefault();
      goToSection(currentSectionIndex - 1);
    }
  });
}

// Last slide cinematic explosion effect
function setupCreditsDetonationEffect() {
  const creditsSection = document.getElementById('credits');
  if (!creditsSection) return;

  let detonationLoopId = null;

  function triggerDetonation() {
    creditsSection.classList.remove('detonation-active');

    // Force reflow so the animation can restart when revisiting the slide.
    void creditsSection.offsetWidth;

    creditsSection.classList.add('detonation-active');

    window.setTimeout(() => {
      creditsSection.classList.remove('detonation-active');
    }, 2600);
  }

  function startDetonationLoop() {
    if (detonationLoopId !== null) return;
    triggerDetonation();
    detonationLoopId = window.setInterval(triggerDetonation, 10000);
  }

  // Keep the effect active globally without depending on section visibility.
  startDetonationLoop();
}
