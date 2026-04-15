import { state, setPokemons, setFiltered } from '../state.js';
import { loadPokemonsBatch, fetchPokemonDetails } from '../api.js';
import { renderPokemonGrid, renderLoading } from '../render.js';
import { setupEvents } from '../events.js';
import { getSprite, formatId } from '../render.js';

const getDailyPokemonId = () => {
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  const x = Math.sin(seed) * 10000;
  const rand = x - Math.floor(x);
  return Math.floor(rand * 1025) + 1;
};

const renderDailyPokemon = async (container) => {
  try {
    const dailyId = getDailyPokemonId();
    const pokemon = await fetchPokemonDetails(dailyId);
    if (!pokemon) return '';
    
    // Check if it should be displayed (if no filter applies)
    if (state.filters.search !== '' || state.filters.type !== '') return '';
    
    const sprite = getSprite(pokemon);
    const primaryType = pokemon.types[0].type.name;
    
    container.innerHTML = `
      <div style="margin-bottom: 40px; margin-top: 20px;">
        <h2 style="font-size: 1.5rem; margin-bottom: 15px; display: flex; align-items: center; gap: 10px;">
          <span style="font-size: 1.8rem;">🌟</span> Pokémon do Dia
        </h2>
        <a href="#/pokemon/${pokemon.id}" class="pokemon-card type-bg-${primaryType}" style="display: flex; flex-direction: row; align-items: center; justify-content: space-between; text-decoration: none; padding: 20px 30px; transform: none;">
          <div style="flex: 1;">
            <p style="font-weight: bold; font-size: 0.9em; opacity: 0.8; margin-bottom: 5px;">${formatId(pokemon.id)}</p>
            <h3 style="font-size: 2rem; text-transform: capitalize; margin-bottom: 10px; text-shadow: 0 2px 4px rgba(0,0,0,0.3); color: white;">${pokemon.name}</h3>
            <span style="font-size: 0.9em; opacity: 0.9;">Clique para ver detalhes e evoluções completas deste Pokémon especial do dia!</span>
          </div>
          <div style="width: 150px; height: 150px; display: flex; justify-content: center; align-items: center;">
            <img src="${sprite}" style="max-height: 100%; max-width: 100%; filter: drop-shadow(0 10px 10px rgba(0,0,0,0.4)); animation: float 3s ease-in-out infinite;" />
          </div>
        </a>
      </div>
    `;
  } catch(e) {
    console.error(e);
  }
};

export const renderHomeView = async (container) => {
  container.innerHTML = `
    <nav class="main-nav" style="margin-top: -40px; margin-bottom: 30px; margin-left: -20px; margin-right: -20px; border-radius: 0 0 10px 10px;">
      <div class="nav-inner">
        <a href="#/" class="nav-btn active">Pokédex</a>
        <a href="#/games" class="nav-btn">Jogos & Regiões</a>
        <a href="#/quiz" class="nav-btn">Quiz</a>
      </div>
    </nav>
    <div class="controls" style="margin-bottom: 20px;">
      <input type="text" id="search-input" class="search-input" placeholder="Buscar por nome ou ID..." value="${state.filters.search}"/>
      <select id="type-filter" class="type-select">
        <option value="">Todos os Tipos</option>
        <option value="normal" ${state.filters.type === 'normal' ? 'selected' : ''}>Normal</option>
        <option value="fire" ${state.filters.type === 'fire' ? 'selected' : ''}>Fogo</option>
        <option value="water" ${state.filters.type === 'water' ? 'selected' : ''}>Água</option>
        <option value="grass" ${state.filters.type === 'grass' ? 'selected' : ''}>Planta</option>
        <option value="electric" ${state.filters.type === 'electric' ? 'selected' : ''}>Elétrico</option>
        <option value="ice" ${state.filters.type === 'ice' ? 'selected' : ''}>Gelo</option>
        <option value="fighting" ${state.filters.type === 'fighting' ? 'selected' : ''}>Lutador</option>
        <option value="poison" ${state.filters.type === 'poison' ? 'selected' : ''}>Venenoso</option>
        <option value="ground" ${state.filters.type === 'ground' ? 'selected' : ''}>Terrestre</option>
        <option value="flying" ${state.filters.type === 'flying' ? 'selected' : ''}>Voador</option>
        <option value="psychic" ${state.filters.type === 'psychic' ? 'selected' : ''}>Psíquico</option>
        <option value="bug" ${state.filters.type === 'bug' ? 'selected' : ''}>Inseto</option>
        <option value="rock" ${state.filters.type === 'rock' ? 'selected' : ''}>Pedra</option>
        <option value="ghost" ${state.filters.type === 'ghost' ? 'selected' : ''}>Fantasma</option>
        <option value="dragon" ${state.filters.type === 'dragon' ? 'selected' : ''}>Dragão</option>
        <option value="dark" ${state.filters.type === 'dark' ? 'selected' : ''}>Sombrio</option>
        <option value="steel" ${state.filters.type === 'steel' ? 'selected' : ''}>Aço</option>
        <option value="fairy" ${state.filters.type === 'fairy' ? 'selected' : ''}>Fada</option>
      </select>
    </div>
    
    <div id="daily-pokemon-container"></div>
    
    <div id="pokemon-grid-container">
      <div id="pokemon-grid" class="pokemon-grid"></div>
    </div>
    
    <div id="scroll-anchor" style="height: 50px; display: flex; justify-content: center; align-items: center; margin-top: 40px;">
    </div>
  `;

  setupEvents();

  const dailyContainer = document.getElementById('daily-pokemon-container');
  await renderDailyPokemon(dailyContainer);

  const grid = document.getElementById('pokemon-grid');
  
  if (state.pokemons.length > 0) {
    if (state.filters.search !== '' || state.filters.type !== '') {
      renderPokemonGrid(grid, state.filtered, false);
    } else {
      renderPokemonGrid(grid, state.pokemons, false);
    }
  } else {
    await loadMorePokemons();
  }
  
  // Setup Infinite Scroll
  const anchor = document.getElementById('scroll-anchor');
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !state.loading && state.filters.search === '' && state.filters.type === '') {
      if (state.pagination.offset < state.pagination.total) {
        loadMorePokemons();
      }
    }
  }, { rootMargin: '200px' });
  
  if (anchor) {
    observer.observe(anchor);
    // Cleanup reference globally (simpler approach for this vanilla architecture)
    window.unmountCurrent = () => { observer.disconnect(); };
  }
};

export const loadMorePokemons = async () => {
  const anchor = document.getElementById('scroll-anchor');
  if (!anchor) return;
  
  renderLoading(anchor, true);
  
  const newPokemons = await loadPokemonsBatch(state.pagination.limit, state.pagination.offset);
  setPokemons(newPokemons);
  
  const grid = document.getElementById('pokemon-grid');
  
  if (state.filters.search === '' && state.filters.type === '') {
    setFiltered(state.pokemons);
    if(grid) renderPokemonGrid(grid, newPokemons, true);
  }
  
  state.pagination.offset += state.pagination.limit;
  
  renderLoading(anchor, false);
};
