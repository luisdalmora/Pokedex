import { state, setPokemons, setFiltered } from '../state.js';
import { loadPokemonsBatch } from '../api.js';
import { renderPokemonGrid, renderLoading } from '../render.js';
import { setupEvents } from '../events.js';

export const renderHomeView = async (container) => {
  container.innerHTML = `
    <nav class="main-nav" style="margin-top: -40px; margin-bottom: 40px; margin-left: -20px; margin-right: -20px; border-radius: 0 0 10px 10px;">
      <div class="nav-inner">
        <a href="#/" class="nav-btn active">Pokédex</a>
        <a href="#/games" class="nav-btn">Jogos & Regiões</a>
      </div>
    </nav>
    <div class="controls">
      <input type="text" id="search-input" class="search-input" placeholder="Buscar por nome ou ID..." value="${state.filters.search}"/>
      <select id="type-filter" class="type-select">
        <option value="">Todos os Tipos</option>
        <option value="normal" ${state.filters.type === 'normal' ? 'selected' : ''}>Normal</option>
        <option value="fire" ${state.filters.type === 'fire' ? 'selected' : ''}>Fire</option>
        <option value="water" ${state.filters.type === 'water' ? 'selected' : ''}>Water</option>
        <option value="grass" ${state.filters.type === 'grass' ? 'selected' : ''}>Grass</option>
        <option value="electric" ${state.filters.type === 'electric' ? 'selected' : ''}>Electric</option>
        <option value="ice" ${state.filters.type === 'ice' ? 'selected' : ''}>Ice</option>
        <option value="fighting" ${state.filters.type === 'fighting' ? 'selected' : ''}>Fighting</option>
        <option value="poison" ${state.filters.type === 'poison' ? 'selected' : ''}>Poison</option>
        <option value="ground" ${state.filters.type === 'ground' ? 'selected' : ''}>Ground</option>
        <option value="flying" ${state.filters.type === 'flying' ? 'selected' : ''}>Flying</option>
        <option value="psychic" ${state.filters.type === 'psychic' ? 'selected' : ''}>Psychic</option>
        <option value="bug" ${state.filters.type === 'bug' ? 'selected' : ''}>Bug</option>
        <option value="rock" ${state.filters.type === 'rock' ? 'selected' : ''}>Rock</option>
        <option value="ghost" ${state.filters.type === 'ghost' ? 'selected' : ''}>Ghost</option>
        <option value="dragon" ${state.filters.type === 'dragon' ? 'selected' : ''}>Dragon</option>
        <option value="dark" ${state.filters.type === 'dark' ? 'selected' : ''}>Dark</option>
        <option value="steel" ${state.filters.type === 'steel' ? 'selected' : ''}>Steel</option>
        <option value="fairy" ${state.filters.type === 'fairy' ? 'selected' : ''}>Fairy</option>
      </select>
    </div>
    <div id="pokemon-grid-container">
      <div id="pokemon-grid" class="pokemon-grid"></div>
    </div>
    <div class="load-more-container">
      <button id="load-more-btn" class="load-more">Carregar Mais</button>
    </div>
  `;

  setupEvents();

  const grid = document.getElementById('pokemon-grid');
  // Se já temos pokemon em estado, apenas renderizamos (preservando o scroll)
  if (state.pokemons.length > 0) {
    if (state.filters.search !== '' || state.filters.type !== '') {
      renderPokemonGrid(grid, state.filtered, false);
    } else {
      renderPokemonGrid(grid, state.pokemons, false);
    }
  } else {
    // Carregar a primeira vez
    await loadMorePokemons();
  }
};

export const loadMorePokemons = async () => {
  const container = document.getElementById('pokemon-grid-container');
  if(!container) return;
  const grid = document.getElementById('pokemon-grid');
  const loadBtn = document.getElementById('load-more-btn');
  
  if (loadBtn) loadBtn.disabled = true;
  renderLoading(container, true);
  
  const newPokemons = await loadPokemonsBatch(state.pagination.limit, state.pagination.offset);
  setPokemons(newPokemons);
  
  if (state.filters.search === '' && state.filters.type === '') {
    setFiltered(state.pokemons);
    renderPokemonGrid(grid, newPokemons, true);
  }
  
  state.pagination.offset += state.pagination.limit;
  
  renderLoading(container, false);
  if (loadBtn) loadBtn.disabled = false;
};
