const loadHomeView = async (container) => {
  try {
    const { renderHomeView } = await import('./pages/Home.js');
    await renderHomeView(container);
  } catch(e) {
    console.error(e);
    container.innerHTML = '<div class="empty-state">Erro ao carregar a página inicial.</div>';
  }
};

const loadPokemonDetail = async (container, id) => {
  try {
    const { renderPokemonDetail } = await import('./pages/PokemonDetail.js');
    await renderPokemonDetail(container, id);
  } catch(e) {
    console.error(e);
    container.innerHTML = '<div class="empty-state">Erro ao carregar detalhes do Pokémon.</div>';
  }
};

const loadGamesView = async (container) => {
  try {
    const { initGamesView } = await import('./pages/games.js');
    await initGamesView(container);
  } catch(e) {
    console.error(e);
    container.innerHTML = '<div class="empty-state">Erro ao carregar jogos.</div>';
  }
};

const loadGameDetail = async (container, slug) => {
  try {
    const { renderGameDetail } = await import('./pages/gameDetail.js');
    await renderGameDetail(container, slug);
  } catch(e) {
    console.error(e);
    container.innerHTML = '<div class="empty-state">Erro ao carregar detalhes do jogo.</div>';
  }
};

const loadGamesLibrary = async (container) => {
  try {
    const { renderGamesLibrary } = await import('./pages/GamesLibrary.js');
    await renderGamesLibrary(container);
  } catch(e) {
    console.error(e);
    container.innerHTML = '<div class="empty-state">Erro ao carregar biblioteca de jogos.</div>';
  }
};

const loadQuizView = async (container) => {
  try {
    const { renderQuizView } = await import('./pages/quiz.js');
    await renderQuizView(container);
  } catch(e) {
    console.error(e);
    container.innerHTML = '<div class="empty-state">Erro ao carregar quiz.</div>';
  }
};

const loadCompareView = async (container) => {
  try {
    const { renderCompareView } = await import('./pages/Compare.js');
    await renderCompareView(container);
  } catch(e) {
    console.error(e);
    container.innerHTML = '<div class="empty-state">Erro ao carregar comparador.</div>';
  }
};

const router = async () => {
  const hash = window.location.hash.slice(1) || '/';
  const container = document.getElementById('app-content');
  if (!container) return;

  if (window.unmountCurrent) {
    window.unmountCurrent();
    window.unmountCurrent = null;
  }

  container.innerHTML = `
    <div style="display:flex; justify-content:center; align-items:center; min-height:50vh;">
       <div class="skeleton-img shimmer" style="width: 80px; height:80px;"></div>
    </div>`;

  if (hash === '/') {
    await loadHomeView(container);
  } 
  else if (hash === '/compare') {
    await loadCompareView(container);
  }
  else if (hash === '/games') {
    await loadGamesView(container);
  }
  else if (hash.startsWith('/games/library')) {
    await loadGamesLibrary(container);
  }
  else if (hash === '/quiz') {
    await loadQuizView(container);
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
    container.innerHTML = '<div class="empty-state">Página não encontrada ou em construção. <a href="#/">Voltar para Home</a></div>';
  }
};

const init = () => {
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isDark = document.body.dataset.theme === 'dark';
      if (isDark) {
        document.body.removeAttribute('data-theme');
        localStorage.setItem('pokedex-theme', 'light');
      } else {
        document.body.setAttribute('data-theme', 'dark');
        localStorage.setItem('pokedex-theme', 'dark');
      }
    });
    
    // Check saved theme
    const saved = localStorage.getItem('pokedex-theme');
    if (saved === 'dark') document.body.setAttribute('data-theme', 'dark');
  }

  window.addEventListener('hashchange', router);
  router(); // call initially
};

document.addEventListener('DOMContentLoaded', init);
