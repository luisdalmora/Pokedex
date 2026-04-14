import { fetchPokemons, fetchPokemonDetails } from '../services/api.js';
import PokemonCard from '../components/PokemonCard.js';
import SearchBar from '../components/SearchBar.js';
import Filter from '../components/Filter.js';

let cachedPokemons = [];
let searchTerm = '';
let selectedType = '';

const renderPokemons = (container) => {
  const grid = container.querySelector('.pokemon-grid');
  if (!grid) return;

  const filtered = cachedPokemons.filter(pokemon => {
    const matchesSearch = pokemon.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          String(pokemon.id).includes(searchTerm);
    const matchesType = selectedType === '' || 
                        pokemon.types.some(t => t.type.name === selectedType);
    return matchesSearch && matchesType;
  });

  if (filtered.length === 0) {
    grid.innerHTML = '<div class="empty-state" style="grid-column: 1 / -1;">Nenhum Pokémon encontrado.</div>';
    return;
  }

  grid.innerHTML = filtered.map(p => PokemonCard(p)).join('');
};

const attachEvents = (container) => {
  const searchInput = container.querySelector('#search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchTerm = e.target.value;
      renderPokemons(container);
    });
  }

  const filterSelect = container.querySelector('#type-filter');
  if (filterSelect) {
    filterSelect.addEventListener('change', (e) => {
      selectedType = e.target.value;
      renderPokemons(container);
    });
  }
};

const Home = async (container) => {
  searchTerm = '';
  selectedType = '';
  
  container.innerHTML = `
    <main class="container animate-fade">
      <div class="controls-section">
        ${SearchBar({ searchMode: searchTerm })}
        ${Filter({ selectedType })}
      </div>
      <div class="loading-state" id="home-loading">Carregando Pokédex...</div>
      <div class="pokemon-grid" style="display: none;"></div>
    </main>
  `;

  attachEvents(container);

  if (cachedPokemons.length === 0) {
    try {
      const data = await fetchPokemons(151);
      const detailsPromises = data.results.map(p => fetchPokemonDetails(p.name));
      cachedPokemons = await Promise.all(detailsPromises);
    } catch (error) {
      console.error("Error loading pokemons:", error);
    }
  }

  const loadingEl = container.querySelector('#home-loading');
  if (loadingEl) loadingEl.style.display = 'none';
  
  const grid = container.querySelector('.pokemon-grid');
  if (grid) grid.style.display = 'grid';
  
  renderPokemons(container);
};

export default Home;
