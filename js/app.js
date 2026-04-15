import { renderHomeView } from './views/home.js';
import { initGamesView } from './views/games.js';

// Minimal DOM manipulation without importing the entire old router to preserve the new architecture.

const loadPokemonDetail = async (container, id) => {
  // To avoid huge files, we dynamically import the detail view
  try {
    const { renderPokemonDetail } = await import('./views/pokemonDetail.js');
    await renderPokemonDetail(container, id);
  } catch(e) {
    console.error(e);
    container.innerHTML = '<div class="empty-state">Erro ao carregar detalhes.</div>';
  }
};

const loadGameDetail = async (container, slug) => {
  try {
    const { renderGameDetail } = await import('./views/gameDetail.js');
    await renderGameDetail(container, slug);
  } catch(e) {
    console.error(e);
    container.innerHTML = '<div class="empty-state">Erro ao carregar partida.</div>';
  }
};

const router = async () => {
  const hash = window.location.hash.slice(1) || '/';
  const container = document.getElementById('app-content');
  if (!container) return;

  // Cleanup old timers or events if any (simple approach)
  if (window.unmountCurrent) {
    window.unmountCurrent();
    window.unmountCurrent = null;
  }

  container.innerHTML = '<div class="loading-state">Aguarde...</div>';

  if (hash === '/') {
    await renderHomeView(container);
  } 
  else if (hash === '/games') {
    await initGamesView(container);
  } 
  else if (hash.startsWith('/pokemon/')) {
    const id = hash.split('/')[2];
    await loadPokemonDetail(container, id);
  } 
  else if (hash.startsWith('/games/')) {
    const slug = hash.split('/')[2];
    await loadGameDetail(container, slug);
  } 
  else {
    container.innerHTML = '<div class="empty-state">Página não encontrada.</div>';
  }
};

const init = () => {
  // Global theme toggle trigger check
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isDark = document.body.dataset.theme === 'dark';
      if (isDark) {
        document.body.removeAttribute('data-theme');
      } else {
        document.body.setAttribute('data-theme', 'dark');
      }
    });
  }

  window.addEventListener('hashchange', router);
  router(); // call initially
};

document.addEventListener('DOMContentLoaded', init);
