// ===================== НАСТРОЙКИ =====================
const COUNT = 150;
const RADIUS = 10;
const COLOR = '#3b536b';
const GLOW_COLOR = '#8ab3cf';
const GLOW_DIST = 60;
const WEB_COLOR = 'rgba(74, 98, 116, 0.12)';

const ESCAPE_DIST = 100;
const REPEL_FORCE = 1.5;
const REPEL_RADIUS = 25;
const REPEL_POWER = 0.5;
const SPIDER_WEB_DIST = 80;
const WANDER_FORCE = 0.2;
const FRICTION = 0.94;

const circles = [];
let mouseX = -500, mouseY = -500;
let canvas, ctx;

// ===================== ИНИЦИАЛИЗАЦИЯ =====================
function setup() {
  canvas = document.createElement('canvas');
  ctx = canvas.getContext('2d');
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.zIndex = '1';
  document.body.prepend(canvas);
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  for (let i = 0; i < COUNT; i++) {
    circles.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 1,
      vy: (Math.random() - 0.5) * 1,
      radius: RADIUS,
    });
  }

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  requestAnimationFrame(update);
}

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

// ===================== ФИЗИКА =====================
function applyMutualRepulsion() {
  for (let i = 0; i < circles.length; i++) {
    for (let j = i + 1; j < circles.length; j++) {
      const a = circles[i];
      const b = circles[j];
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < REPEL_RADIUS && dist > 0.01) {
        const angle = Math.atan2(dy, dx);
        const force = (REPEL_RADIUS - dist) / REPEL_RADIUS * REPEL_POWER;
        const fx = Math.cos(angle) * force;
        const fy = Math.sin(angle) * force;
        a.vx += fx;
        a.vy += fy;
        b.vx -= fx;
        b.vy -= fy;
      }
    }
  }
}

function updatePhysics() {
  const w = canvas.width;
  const h = canvas.height;
  for (const c of circles) {
    c.vx += (Math.random() - 0.5) * WANDER_FORCE;
    c.vy += (Math.random() - 0.5) * WANDER_FORCE;
    c.vx *= FRICTION;
    c.vy *= FRICTION;
    const dx = c.x - mouseX;
    const dy = c.y - mouseY;
    const distToMouse = Math.sqrt(dx * dx + dy * dy);
    if (distToMouse < ESCAPE_DIST && distToMouse > 0.1) {
      const angle = Math.atan2(dy, dx);
      const force = (ESCAPE_DIST - distToMouse) / ESCAPE_DIST * REPEL_FORCE;
      c.vx += Math.cos(angle) * force;
      c.vy += Math.sin(angle) * force;
    }
    c.x += c.vx;
    c.y += c.vy;
    if (c.x < c.radius) { c.x = c.radius; c.vx *= -0.6; }
    else if (c.x > w - c.radius) { c.x = w - c.radius; c.vx *= -0.6; }
    if (c.y < c.radius) { c.y = c.radius; c.vy *= -0.6; }
    else if (c.y > h - c.radius) { c.y = h - c.radius; c.vy *= -0.6; }
  }
}

// ===================== ОТРИСОВКА =====================
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // паутина
  ctx.beginPath();
  ctx.strokeStyle = WEB_COLOR;
  ctx.lineWidth = 0.8;
  for (let i = 0; i < circles.length; i++) {
    for (let j = i + 1; j < circles.length; j++) {
      const a = circles[i];
      const b = circles[j];
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < SPIDER_WEB_DIST && Math.random() < 0.8) {
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
      }
    }
  }
  ctx.stroke();

  // кружочки со свечением
  for (const c of circles) {
    const dx = c.x - mouseX;
    const dy = c.y - mouseY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const intensity = dist < GLOW_DIST ? 1 - dist / GLOW_DIST : 0;

    ctx.beginPath();
    ctx.arc(c.x, c.y, c.radius, 0, Math.PI * 2);
    if (intensity > 0) {
      ctx.shadowColor = GLOW_COLOR;
      ctx.shadowBlur = 6 * intensity;
      ctx.fillStyle = GLOW_COLOR;
    } else {
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.fillStyle = COLOR;
    }
    ctx.fill();
  }
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
}

function update() {
  applyMutualRepulsion();
  updatePhysics();
  draw();
  requestAnimationFrame(update);
}

setup();