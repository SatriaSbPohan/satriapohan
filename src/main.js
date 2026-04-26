import './style.css';
import { cars, state } from './state.js';
import { initScene, switchCar } from './scene.js';

// DOM Elements
const uiContainer = document.getElementById('ui-container');
const loadingScreen = document.getElementById('loading-screen');
const progressBar = document.getElementById('progress-bar');
const loadingText = document.getElementById('loading-text');

const carNameEl = document.getElementById('car-name');
const carDescEl = document.getElementById('car-desc');
const specSpeed = document.getElementById('spec-speed');
const specAccel = document.getElementById('spec-accel');
const specHp = document.getElementById('spec-hp');
const specEngine = document.getElementById('spec-engine');
const specsPanel = document.getElementById('specs-panel');
const galleryBar = document.getElementById('gallery-bar');

function init() {
  // Initialize 3D Scene
  const container = document.getElementById('canvas-container');
  initScene(container);

  // Initial Load
  loadCar(0);

  // Render Gallery
  renderGallery();

  // Simulate Load Sequence
  simulateLoading();
}

function simulateLoading() {
  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 10;
    if (progress > 100) progress = 100;

    progressBar.style.width = `${progress}%`;

    if (progress === 100) {
      clearInterval(interval);
      setTimeout(() => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
          loadingScreen.style.display = 'none';
          revealUI();
        }, 500);
      }, 500);
    }
  }, 100);
}

function revealUI() {
  uiContainer.style.opacity = '1';
  // Trigger animations
  setTimeout(() => {
    specsPanel.classList.remove('translate-x-20', 'opacity-0');
  }, 500);
}

function renderGallery() {
  galleryBar.innerHTML = '';
  cars.forEach((car, index) => {
    const card = document.createElement('div');
    card.className = `interactive-card min-w-[150px] md:min-w-[200px] p-4 border border-white/10 rounded-lg bg-black/50 backdrop-blur-sm flex flex-col items-center gap-2 ${index === state.currentCarIndex ? 'border-neon-blue' : ''}`;

    card.innerHTML = `
      <div class="w-full h-24 bg-gradient-to-br from-gray-800 to-black rounded-md flex items-center justify-center overflow-hidden relative">
         <!-- Geometric representation since we don't have thumbnails -->
         <div class="absolute inset-0 opacity-30" style="background: ${car.color}; mix-blend-mode: overlay;"></div>
         <span class="text-xs font-mono text-gray-500">${car.id}</span>
      </div>
      <div class="w-full flex justify-between items-end">
        <div>
          <h3 class="font-display font-bold text-white text-sm">${car.name}</h3>
          <span class="text-xs text-neon-blue font-mono">${car.suffix}</span>
        </div>
      </div>
    `;

    card.addEventListener('click', () => {
      if (state.currentCarIndex === index) return;
      handleCarSwitch(index);
    });

    galleryBar.appendChild(card);
  });
}

function handleCarSwitch(index) {
  state.currentCarIndex = index;

  // Update state visuals (gallery selection)
  const cards = galleryBar.children;
  for (let i = 0; i < cards.length; i++) {
    if (i === index) {
      cards[i].classList.add('border-neon-blue');
    } else {
      cards[i].classList.remove('border-neon-blue');
    }
  }

  // Update Specs UI with animation reset
  updateSpecs(cars[index]);

  // Update 3D Model
  switchCar(index);
}

function updateSpecs(car) {
  // Fade out elements briefly
  const elements = [carNameEl, carDescEl, specSpeed, specAccel, specHp, specEngine];
  elements.forEach(el => el.style.opacity = '0.5');

  setTimeout(() => {
    carNameEl.innerHTML = `${car.name} <span class="text-neon-blue">${car.suffix}</span>`;
    carDescEl.textContent = car.desc;

    specSpeed.textContent = car.specs.speed;
    specSpeed.style.color = car.color;

    specAccel.textContent = car.specs.accel;
    specAccel.style.color = car.color;

    specHp.textContent = car.specs.hp;
    specHp.style.color = car.color;

    specEngine.textContent = car.specs.engine;
    specEngine.style.color = car.color;

    // Reset opacity
    elements.forEach(el => el.style.opacity = '1');
  }, 200);
}

function loadCar(index) {
  switchCar(index);
}

// Start
init();
