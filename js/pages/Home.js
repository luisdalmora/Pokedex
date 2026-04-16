import { fetchPokemons, fetchPokemonDetails } from '../services/api.js';
import { renderPokemonGrid, createSkeletonCard } from '../components/PokemonCard.js';
import { debounce } from '../utils/helpers.js';
import { typeTranslations } from '../utils/translations.js';
import { renderNav } from '../components/Nav.js';

let offset = 0;
const LIMIT = 30;
let isLoading = false;
let hasMore = true;
let currentSearchTerm = '';
let currentTypeFilter = '';

const getTypesDropdownHtml = () => {
  let options = '<option value="">Todos os Tipos</option>';
  Object.keys(typeTranslations).forEach(type => {
    options += `<option value="${type}">${typeTranslations[type]}</option>`;
  });
  return options;
};

export const renderHomeView = async (container) => {
  offset = 0;
  hasMore = true;
  isLoading = false;
  currentSearchTerm = '';
  currentTypeFilter = '';

  container.innerHTML = `
    ${renderNav('/')}
    <div class="search-bar-wrapper animate-fade">
      <input type="text" id="search-input" class="search-input-fancy" placeholder="Pesquisar por nome ou ID..." autocomplete="off">
      <select id="type-filter" class="search-input-fancy" style="min-width: 150px;">
        ${getTypesDropdownHtml()}
      </select>
    </div>
    <div class="pokemon-grid" id="pokemon-grid"></div>
    <div id="loading-trigger" style="height: 50px; width: 100%; display: flex; justify-content: center; align-items: center; margin-top:20px;">
      <div class="loader-spinner" style="display:none;">Carregando mais...</div>
    </div>
  `;

  const grid = document.getElementById('pokemon-grid');
  const trigger = document.getElementById('loading-trigger');
  
  const loadMore = async () => {
    if (isLoading || !hasMore) return;
    isLoading = true;
    
    // Mostra skeletons
    if (offset === 0) grid.innerHTML = '';
    const tempSkeletons = [];
    for(let i=0; i<6; i++) {
      const skel = createSkeletonCard();
      grid.appendChild(skel);
      tempSkeletons.push(skel);
    }
    
    try {
      const list = await fetchPokemons(LIMIT, offset);
      if (list.length < LIMIT) hasMore = false;
      
      const detailedPromises = list.map(p => fetchPokemonDetails(p.name));
      const detailedResults = await Promise.all(detailedPromises);
      
      // Remove skeletons
      tempSkeletons.forEach(s => s.remove());
      
      let finalResults = detailedResults.filter(r => r !== null);
      
      // Client-side filtering if active
      if (currentSearchTerm || currentTypeFilter) {
          finalResults = applyFilters(finalResults, currentSearchTerm, currentTypeFilter);
          hasMore = false; // Disable infinite scroll during active filter search
      }

      renderPokemonGrid(grid, finalResults, true);
      offset += LIMIT;
    } catch (e) {
      console.error(e);
      tempSkeletons.forEach(s => s.remove());
    } finally {
      isLoading = false;
    }
  };

  const applyFilters = (results, search, type) => {
      let filtered = results;
      if (search) {
          filtered = filtered.filter(p => p.name.includes(search) || p.id.toString() === search);
      }
      if (type) {
          filtered = filtered.filter(p => p.types.some(t => t.type.name === type));
      }
      return filtered;
  };

  const handleSearch = debounce(async (e) => {
      currentSearchTerm = document.getElementById('search-input').value.toLowerCase().trim();
      currentTypeFilter = document.getElementById('type-filter').value;
      offset = 0;
      hasMore = true; // resets
      grid.innerHTML = '';
      if(currentSearchTerm || currentTypeFilter){
         // Se tem busca, carrega um grande batch forçado (ou API não fornece busca com paginação fácil)
         // Para uma Pokedex completa, o ideal seria buscar localmente. Aqui fazemos um fallback
         hasMore = false; 
         grid.innerHTML = '<div style="grid-column: 1/-1; text-align:center;">Pesquisa avançada requer carregar todo o DB (mocked for now) ou bater na API id a id.</div>';
         if(currentSearchTerm) {
            try {
               const res = await fetchPokemonDetails(currentSearchTerm);
               grid.innerHTML = '';
               if(res) {
                   if(!currentTypeFilter || res.types.some(t => t.type.name === currentTypeFilter)){
                      renderPokemonGrid(grid, [res], true);
                   } else {
                      grid.innerHTML = '<div style="grid-column: 1/-1; text-align:center;">Nenhum Pokémon corresponde a esta junção de nome e tipo.</div>';
                   }
               } else {
                 grid.innerHTML = '<div style="grid-column: 1/-1; text-align:center;">Nenhum Pokémon encontrado com este nome/ID.</div>';
               }
            } catch(e) {}
         } else {
             // Só tipo. Precisaria da rota /type/
             grid.innerHTML = '<div style="grid-column: 1/-1; text-align:center;">Pressione limpar para voltar aos normais, ou busque por nome.</div>';
         }
      } else {
         hasMore = true;
         await loadMore();
      }
  }, 500);

  document.getElementById('search-input').addEventListener('input', handleSearch);
  document.getElementById('type-filter').addEventListener('change', handleSearch);

  // Intersection Observer for Infinite Scroll
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !isLoading && hasMore) {
      loadMore();
    }
  }, { rootMargin: '200px' });
  
  observer.observe(trigger);

  // Inicializa a primeira chamada
  await loadMore();
  
  window.unmountCurrent = () => {
     observer.disconnect();
  };
};
