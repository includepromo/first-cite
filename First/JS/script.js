// ===================== НАСТРОЙКИ =====================
const COUNT = 100;                // количество кружочков
const RADIUS = 10;                // радиус
const COLOR = '#3b536b';         // цвет кружков
const WEB_COLOR = 'rgba(74, 98, 116, 0.12)'; // полупрозрачная паутина
const USE_SHADOW = false;        // лёгкая тень у кружков (отключи для максимальной скорости)

const ESCAPE_DIST = 100;         // расстояние, с которого убегают от мыши
const REPEL_FORCE = 1.5;         // сила отталкивания от мыши
const REPEL_RADIUS = 25;         // радиус взаимного отталкивания
const REPEL_POWER = 0.5;         // сила взаимного отталкивания
const SPIDER_WEB_DIST = 80;      // макс. расстояние для паутины
const WANDER_FORCE = 0.2;        // хаотичность блуждания
const FRICTION = 0.94;           // затухание скорости

// ===================== ПЕРЕМЕННЫЕ =====================
const circles = [];
let mouseX = -500, mouseY = -500;
let canvas, ctx;

// ===================== ИНИЦИАЛИЗАЦИЯ =====================
function setup() {
  canvas = document.createElement('canvas');
  ctx = canvas.getContext('2d');
  canvas.style.position = 'absolute';
  canvas.style.top = '0';
  canvas.style.left = '0';
  document.body.appendChild(canvas);
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
    // idle
    c.vx += (Math.random() - 0.5) * WANDER_FORCE;
    c.vy += (Math.random() - 0.5) * WANDER_FORCE;
    // трение
    c.vx *= FRICTION;
    c.vy *= FRICTION;
    // уход от крусора
    const dx = c.x - mouseX;
    const dy = c.y - mouseY;
    const distToMouse = Math.sqrt(dx * dx + dy * dy);
    if (distToMouse < ESCAPE_DIST && distToMouse > 0.1) {
      const angle = Math.atan2(dy, dx);
      const force = (ESCAPE_DIST - distToMouse) / ESCAPE_DIST * REPEL_FORCE;
      c.vx += Math.cos(angle) * force;
      c.vy += Math.sin(angle) * force;
    }
    // движение
    c.x += c.vx;
    c.y += c.vy;
    // границы
    if (c.x < c.radius) { c.x = c.radius; c.vx *= -0.6; }
    else if (c.x > w - c.radius) { c.x = w - c.radius; c.vx *= -0.6; }
    if (c.y < c.radius) { c.y = c.radius; c.vy *= -0.6; }
    else if (c.y > h - c.radius) { c.y = h - c.radius; c.vy *= -0.6; }
  }
}

// ===================== ОТРИСОВКА =====================
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Паутина
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
      if (dist < SPIDER_WEB_DIST) {
        if (Math.random() < 0.8) {
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
        }
      }
    }
  }
  ctx.stroke();

  ctx.fillStyle = COLOR;
  if (USE_SHADOW) {
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.shadowBlur = 3;
  }
  ctx.beginPath();
  for (const c of circles) {
    ctx.moveTo(c.x + c.radius, c.y);
    ctx.arc(c.x, c.y, c.radius, 0, Math.PI * 2);
  }
  ctx.fill();
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
}

// ===================== ГЛАВНЫЙ ЦИКЛ =====================
function update() {
  applyMutualRepulsion();
  updatePhysics();
  draw();
  requestAnimationFrame(update);
}

setup();