import { fetchPokemons, fetchPokemonDetails, fetchRegionsList, fetchRegionData } from '../services/api.js';
import PokemonCard from '../components/PokemonCard.js';
import SearchBar from '../components/SearchBar.js';
import Filter from '../components/Filter.js';
import RegionFilter from '../components/RegionFilter.js';

let cachedPokemons = [];
let searchTerm = '';
let selectedType = '';
let currentRegionParam = 'kanto';

let cachedRegions = [];
let regionsDataMap = {};

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

  const regionSelect = container.querySelector('#region-filter');
  if (regionSelect) {
    regionSelect.addEventListener('change', async (e) => {
      currentRegionParam = e.target.value;
      searchTerm = '';
      selectedType = '';
      if(searchInput) searchInput.value = '';
      if(filterSelect) filterSelect.value = '';
      await loadRegionPokemons(container);
    });
  }
};

const loadRegionPokemons = async (container) => {
  const loadingEl = container.querySelector('#home-loading');
  const grid = container.querySelector('.pokemon-grid');
  
  if (loadingEl) {
    loadingEl.style.display = 'block';
    loadingEl.textContent = `Carregando Pokédex da região ${currentRegionParam}...`;
  }
  if (grid) grid.style.display = 'none';

  try {
    const regionInfo = regionsDataMap[currentRegionParam];
    
    // Calcula o offset e o limit para a geração/região
    const limit = regionInfo.range.end - regionInfo.range.start + 1;
    const offset = regionInfo.range.start - 1;

    const data = await fetchPokemons(limit, offset);
    const detailsPromises = data.results.map(p => fetchPokemonDetails(p.name));
    cachedPokemons = await Promise.all(detailsPromises);
    
  } catch (error) {
    console.error("Error loading pokemons:", error);
  }

  if (loadingEl) loadingEl.style.display = 'none';
  if (grid) grid.style.display = 'grid';
  renderPokemons(container);
};


const Home = async (container) => {
  searchTerm = '';
  selectedType = '';
  
  if (cachedRegions.length === 0) {
    try {
      const regionsList = await fetchRegionsList();
      const regionsFetchPromises = regionsList.map(async (slug) => {
         const d = await fetchRegionData(slug);
         d.slug = slug;
         return d;
      });
      cachedRegions = await Promise.all(regionsFetchPromises);
       
      cachedRegions.forEach(cr => {
         regionsDataMap[cr.slug] = cr;
      });
    } catch (e) {
      console.error("Erro ao carregar lista de regiões:", e);
    }
  }

  container.innerHTML = `
    <main class="container animate-fade">
      <div class="controls-section">
        ${SearchBar({ searchMode: searchTerm })}
        ${Filter({ selectedType })}
        ${RegionFilter({ regions: cachedRegions, selectedRegion: currentRegionParam })}
      </div>
      <div class="loading-state" id="home-loading">Carregando Pokédex...</div>
      <div class="pokemon-grid" style="display: none;"></div>
    </main>
  `;

  attachEvents(container);

  await loadRegionPokemons(container);
};

export default Home;
