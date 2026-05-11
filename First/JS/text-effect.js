window.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('text-container');
  if (!container) {
    console.error('Элемент #text-container не найден!');
    return;
  }

  const targetString = 'IcnludePromo';
  const scrambleChars = 'ꘀꘁꘂꘃꘄꘅꘆꘇꘈꘉꘊꘋꘌ꘍꘎꘏こんにちは世界你好世界안녕하세요세계';
  const totalIterations = 12;
  const revealSpeed = 80;
  const scrambleSpeed = 50;

  function getRandomChar() {
    return scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
  }

  function startAnimation() {
    const length = targetString.length;
    let currentString = Array.from({ length }, () => getRandomChar());
    const locked = Array(length).fill(false);
    container.textContent = currentString.join('');

    const scrambleInterval = setInterval(() => {
      for (let i = 0; i < length; i++) {
        if (!locked[i]) {
          currentString[i] = getRandomChar();
        }
      }
      container.textContent = currentString.join('');
    }, scrambleSpeed);

    let revealIndex = 0;
    const revealInterval = setInterval(() => {
      if (revealIndex >= length) {
        clearInterval(revealInterval);
        clearInterval(scrambleInterval);
        container.textContent = targetString;
        return;
      }
      locked[revealIndex] = true;
      currentString[revealIndex] = targetString[revealIndex];
      container.textContent = currentString.join('');
      revealIndex++;
    }, revealSpeed);

    setTimeout(() => {
      clearInterval(scrambleInterval);
    }, totalIterations * scrambleSpeed);
  }

  setTimeout(startAnimation, 500);
});