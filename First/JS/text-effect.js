document.addEventListener("DOMContentLoaded", () => {
  console.log("text-effect.js запущен");

  const container = document.getElementById("text-container");
  if (!container) {
    console.error("❌ Контейнер #text-container не найден в DOM!");
    return;
  }
  console.log("✅ Контейнер найден:", container);

  const target = "Hello World";
  const chars = "ꘀꘁꘂꘃこんにちは世界안녕하세요세계";
  const totalIterations = 12;
  const revealSpeed = 80;
  const scrambleSpeed = 50;

  const getRand = () => chars[Math.floor(Math.random() * chars.length)];

  const current = Array.from({ length: target.length }, getRand);
  const locked = Array(target.length).fill(false);
  container.textContent = current.join("");
  console.log("Начальная строка:", current.join(""));

  const scrambleInterval = setInterval(() => {
    for (let i = 0; i < target.length; i++) {
      if (!locked[i]) current[i] = getRand();
    }
    container.textContent = current.join("");
  }, scrambleSpeed);

  let idx = 0;
  const revealInterval = setInterval(() => {
    if (idx >= target.length) {
      clearInterval(revealInterval);
      clearInterval(scrambleInterval);
      container.textContent = target;
      console.log("Анимация завершена");
      return;
    }
    locked[idx] = true;
    current[idx] = target[idx];
    container.textContent = current.join("");
    idx++;
  }, revealSpeed);

  setTimeout(() => {
    clearInterval(scrambleInterval);
    console.log("scrambleInterval остановлен по таймауту");
  }, totalIterations * scrambleSpeed);
});
