// ui.js — кнопка «My May» на главной странице

const btn = document.createElement('button');
btn.textContent = 'My May';
Object.assign(btn.style, {
  position: 'fixed',
  top: '24px',
  right: '24px',
  zIndex: '20',
  background: 'rgba(30, 45, 61, 0.85)',
  border: '1px solid #4a6274',
  color: '#c8d9e6',
  padding: '10px 28px',
  borderRadius: '14px',
  fontFamily: '"Courier New", monospace',
  fontSize: '1.2rem',
  fontWeight: 'bold',
  letterSpacing: '0.1rem',
  cursor: 'pointer',
  backdropFilter: 'blur(4px)',
  transition: 'background 0.3s, box-shadow 0.3s',
});

btn.addEventListener('mouseenter', () => {
  btn.style.background = 'rgba(59, 83, 107, 0.9)';
  btn.style.boxShadow = '0 0 12px rgba(139, 179, 207, 0.4)';
});
btn.addEventListener('mouseleave', () => {
  btn.style.background = 'rgba(30, 45, 61, 0.85)';
  btn.style.boxShadow = 'none';
});
btn.addEventListener('click', () => {
  window.location.href = 'gallery.html';
});

document.body.appendChild(btn);