import { state, setFiltered } from './state.js';
import { renderPokemonGrid } from './render.js';
import { loadMorePokemons } from './views/home.js';

export const setupEvents = (containerId) => {
  const searchInput = document.getElementById('search-input');
  const typeFilter = document.getElementById('type-filter');
  const loadMoreBtn = document.getElementById('load-more-btn');
  const themeToggle = document.getElementById('theme-toggle');

  const navPokedex = document.getElementById('nav-pokedex');
  const navGames = document.getElementById('nav-games');
  const viewPokedex = document.getElementById('view-pokedex');
  const viewGames = document.getElementById('view-games');

  const applyFilters = () => {
    const term = state.filters.search.toLowerCase();
    const type = state.filters.type;
    
    const filtered = state.pokemons.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(term) || String(p.id).includes(term);
      const matchType = type === '' || p.types.some(t => t.type.name === type);
      return matchSearch && matchType;
    });
    
    setFiltered(filtered);
    const grid = document.getElementById('pokemon-grid');
    if (grid) {
      renderPokemonGrid(grid, state.filtered, false);
    }
    
    // Hide Load More button if searching/filtering natively
    if (loadMoreBtn) {
      loadMoreBtn.style.display = (term !== '' || type !== '') ? 'none' : 'block';
    }
  };

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.filters.search = e.target.value.trim();
      applyFilters();
    });
  }

  if (typeFilter) {
    typeFilter.addEventListener('change', (e) => {
      state.filters.type = e.target.value;
      applyFilters();
    });
  }

  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', async () => {
      await loadMorePokemons();
    });
  }
  
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

  // Navigation Logic
  if (navPokedex && navGames) {
    navPokedex.addEventListener('click', () => {
      navPokedex.classList.add('active');
      navGames.classList.remove('active');
      viewPokedex.style.display = 'block';
      viewGames.style.display = 'none';
    });

    navGames.addEventListener('click', () => {
      navGames.classList.add('active');
      navPokedex.classList.remove('active');
      viewGames.style.display = 'block';
      viewPokedex.style.display = 'none';
      
      // Auto-init games se estiver vazio
      if (viewGames.innerHTML === '') {
        import('./games.js').then(module => module.initGamesView());
      }
    });
  }
};
