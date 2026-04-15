import { state, setFiltered } from './state.js';
import { renderPokemonGrid } from './render.js';
import { loadMorePokemons } from './views/home.js';

export const setupEvents = () => {
  const searchInput = document.getElementById('search-input');
  const typeFilter = document.getElementById('type-filter');

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
    
    // Esconder o observer de Infinite Scroll durantes buscas ativas
    const anchor = document.getElementById('scroll-anchor');
    if(anchor) {
      anchor.style.display = (term !== '' || type !== '') ? 'none' : 'flex';
    }

    if (grid) {
      renderPokemonGrid(grid, state.filtered, false);
    }
  };

  if (searchInput) {
    // Evita acumulação de listeners reutilizando a função
    const newSearch = searchInput.cloneNode(true);
    searchInput.parentNode.replaceChild(newSearch, searchInput);
    
    newSearch.addEventListener('input', (e) => {
      state.filters.search = e.target.value.trim();
      applyFilters();
    });
  }

  if (typeFilter) {
    const newTypeFilter = typeFilter.cloneNode(true);
    typeFilter.parentNode.replaceChild(newTypeFilter, typeFilter);
    
    newTypeFilter.addEventListener('change', (e) => {
      state.filters.type = e.target.value;
      applyFilters();
    });
  }
};
