import { fetchRegionDetails, fetchGenerationDetails, fetchLocalLore, fetchLocalGymLeaders, fetchPokedexDetails, fetchPokemonDetails } from '../services/api.js';
import { renderPokemonGrid, createSkeletonCard, createPokemonCard } from '../components/PokemonCard.js';
import { renderNav } from '../components/Nav.js';
import { translateType } from '../utils/translations.js';

let regionData = null;
let generationData = null;
let localLore = null;
let gymLeaders = [];
let pokedexEntries = [];
let filteredEntries = [];
let pokedexOffset = 0;
const PAGE_SIZE = 30;
let isFetchingPokedex = false;

const romanToNum = (roman) => {
  const ro = roman.toUpperCase();
  const vals = { I:1, V:5, X:10 };
  let num = 0;
  for(let i=0; i<ro.length; i++) {
     let curr = vals[ro[i]], next = vals[ro[i+1]];
     if (next && next > curr) { num += next - curr; i++; } else { num += curr; }
  }
  return num;
};

const renderLeadersModal = (container, leader) => {
  const modalEl = document.getElementById('leader-modal-root');
  if(!modalEl || !leader) {
      if(modalEl) modalEl.innerHTML = '';
      return;
  }
  
  const teamHtml = leader.team.map((poke) => `
    <div style="display:flex; flex-direction:column; align-items:center; background: var(--bg-color); padding: 15px; border-radius: 12px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
      <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${poke.id}.png" onerror="this.onerror = null; this.src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${poke.id}.png';" style="width: 70px; height: 70px; object-fit: contain; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.2));" />
      <h4 style="font-size: 0.9em; margin-top: 10px; text-transform: capitalize; font-weight: 700;">${poke.name}</h4>
      <span style="font-size: 0.8em; color: var(--text-muted); font-weight: 600; margin-top: 5px;">Lv ${poke.level}</span>
    </div>
  `).join('');

  modalEl.innerHTML = `
    <div id="modal-overlay" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.8); z-index: 1000; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(8px); animation: fadeIn 0.2s;">
      <div id="modal-panel" style="background: var(--card-bg); border-radius: 24px; padding: 40px; max-width: 800px; width: 90%; max-height: 90vh; overflow-y: auto; position: relative; box-shadow: 0 20px 40px rgba(0,0,0,0.3); transform: scale(0.95); animation: scaleUp 0.2s forwards;">
        <button id="modal-close" style="position: absolute; top: 20px; right: 20px; background: rgba(0,0,0,0.05); border: none; font-size: 20px; width: 40px; height: 40px; border-radius: 50%; cursor: pointer; color: var(--text-main); display: flex; align-items: center; justify-content: center; transition: background 0.2s;">&times;</button>
        
        <div style="display: flex; gap: 40px; flex-wrap: wrap;">
          <div style="flex: 1; min-width: 250px; display: flex; flex-direction: column; align-items: center; text-align: center; border-right: 2px solid var(--border-color); padding-right: 20px;">
            <div style="background: var(--bg-color); border-radius: 50%; width: 150px; height: 150px; display: flex; justify-content: center; align-items: center; margin-bottom: 20px; border: 4px solid var(--type-color-${leader.type.toLowerCase()});">
              <img src="./assets/images/gym-leaders/${leader.name.toLowerCase().replace(/[\\s.]+/g, '-')}.png" onerror="this.onerror=null; this.src='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png'; this.style.opacity='0.2';" style="max-height: 120px;" />
            </div>
            <h2 style="margin-top: 10px; color: var(--type-color-${leader.type.toLowerCase()}); font-size: 1.8em; font-weight: 800;">${leader.name}</h2>
            <p style="color: var(--text-muted); font-size: 1.1em; margin-bottom: 15px;">${leader.gym}</p>
            <span class="type-pill type-color-${leader.type.toLowerCase()}" style="font-size: 1em; padding: 8px 20px;">${translateType(leader.type)}</span>
          </div>
          
          <div style="flex: 2; min-width: 300px;">
            <h3 style="margin-bottom: 25px; border-bottom: 2px solid var(--border-color); padding-bottom: 15px; font-size: 1.4rem; display: flex; align-items: center; gap: 10px;"><span style="font-size: 1.5rem;">⚔️</span> Equipe Pokémon</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(110px, 1fr)); gap: 20px;">
              ${teamHtml}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  document.getElementById('modal-overlay').addEventListener('click', () => renderLeadersModal(container, null));
  document.getElementById('modal-panel').addEventListener('click', e => e.stopPropagation());
  document.getElementById('modal-close').addEventListener('click', () => renderLeadersModal(container, null));
};

const loadMorePokedex = async () => {
    if (isFetchingPokedex) return;
    const grid = document.getElementById('region-pokedex-grid');
    if (!grid) return;

    const itemsToLoad = filteredEntries.slice(pokedexOffset, pokedexOffset + PAGE_SIZE);
    if (itemsToLoad.length === 0) return;

    isFetchingPokedex = true;

    // Renderizamos skeletons temporários
    const skeletonDoms = [];
    itemsToLoad.forEach(() => {
      const skel = createSkeletonCard();
      grid.appendChild(skel);
      skeletonDoms.push(skel);
    });

    try {
      const detailsPromises = itemsToLoad.map(entry => fetchPokemonDetails(entry.pokemon_species.name));
      const detailsData = await Promise.all(detailsPromises);

      detailsData.forEach((detail, index) => {
        const skel = skeletonDoms[index];
        if (detail) {
          const actualCard = createPokemonCard(detail);
          grid.replaceChild(actualCard, skel);
        } else {
          skel.style.display = 'none';
        }
      });
      pokedexOffset += PAGE_SIZE;

      if (pokedexOffset >= filteredEntries.length) {
         const btn = document.getElementById('load-more-regional-btn');
         if(btn) btn.style.display = 'none';
      }
    } catch (e) {
      console.error(e);
    } finally {
      isFetchingPokedex = false;
    }
};

export const renderGameDetail = async (container, regionName) => {
  container.innerHTML = '<div class="loading-state">Desvendando a região...</div>';
  
  regionData = null;
  generationData = null;
  localLore = null;
  gymLeaders = [];
  pokedexEntries = [];
  filteredEntries = [];
  pokedexOffset = 0;
  isFetchingPokedex = false;
  
  try {
     regionData = await fetchRegionDetails(regionName);
     if (!regionData) throw new Error("Region not found in API");
     if (regionData.main_generation) generationData = await fetchGenerationDetails(regionData.main_generation.name);
     
     // Hybrid Merges!
     localLore = await fetchLocalLore(regionName);
     gymLeaders = await fetchLocalGymLeaders(regionName);
     
     // Prepare primary regional pokedex
     if (regionData.pokedexes && regionData.pokedexes.length > 0) {
        // Typically the first pokedex is the original one for the region, or we find one that doesn't strictly have "updated" in name
        const pdx = await fetchPokedexDetails(regionData.pokedexes[0].name);
        if (pdx && pdx.pokemon_entries) {
            pokedexEntries = pdx.pokemon_entries;
        }
     }
     filteredEntries = [...pokedexEntries];
     
  } catch(e) {
     console.error('Erro buscando detalhe de regiao:', e);
     container.innerHTML = '<div class="empty-state">Região não foi mapeada corretamente.</div>';
     return;
  }

  const loreText = localLore ? localLore.description : "Os dados arqueológicos e geográficos para esta região ainda estão sendo traduzidos pela equipe de professores locais. Explore os cartuchos e a Pokédex abaixo!";
  const genNum = regionData.main_generation ? romanToNum(regionData.main_generation.name.split('-')[1]) : '?';

  // Section: Version Groups
  const versionGroupHtml = regionData.version_groups && regionData.version_groups.length > 0 ? regionData.version_groups.map(vg => {
     let cName = vg.name.replace('-', ' ');
     return `
      <div style="background:var(--bg-color); border:1px solid var(--border-color); padding: 15px; border-radius: 12px; display:flex; align-items:center; gap: 15px;">
        <div style="width:50px; height:50px; border-radius:8px; background: rgba(0,0,0,0.05); display:flex; justify-content:center; align-items:center;">
           <img src="./assets/images/games/${vg.name}.png" onerror="this.onerror=null; this.src='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png'; this.style.opacity='0.2';" style="max-height:40px;" />
        </div>
        <span style="font-weight:700; text-transform:capitalize;">Pokémon<br/>${cName}</span>
      </div>
     `;
  }).join('') : '<p class="text-muted">Nenhum cartucho específico listado para registro histórico.</p>';

  // Section: Gym Leaders
  const gymLeadersHtml = gymLeaders && gymLeaders.length > 0 ? gymLeaders.map((leader, i) => `
      <div class="leader-card" data-idx="${i}" style="background: var(--bg-color); border-radius: 20px; padding: 25px 20px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); text-align: center; cursor: pointer; transition: all 0.3s; border: 2px solid transparent; display: flex; flex-direction: column; align-items: center;">
        <div style="background: rgba(0,0,0,0.03); width: 100px; height: 100px; border-radius: 50%; display: flex; justify-content: center; align-items: center; margin-bottom: 15px;">
          <img src="./assets/images/gym-leaders/${leader.name.toLowerCase().replace(/[\\s.]+/g, '-')}.png" onerror="this.onerror=null; this.src='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png'; this.style.opacity='0.2';" style="max-height: 80px; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.2));" />
        </div>
        <h4 style="font-size: 1.3em; font-weight: 800; margin-bottom: 5px;">${leader.name}</h4>
        <p style="color: var(--text-muted); font-size: 0.9em; margin-bottom: 15px;">${leader.gym}</p>
        <div style="margin-bottom: ${leader.badge ? '15px' : '0'};">
          <span class="type-pill type-color-${leader.type.toLowerCase()}">${translateType(leader.type)}</span>
        </div>
        ${leader.badge ? "<p style='font-weight: 700; font-size: 0.9em; display:flex; align-items: center; gap: 5px;'><span style='color: var(--text-muted);'>Insígnia:</span> " + leader.badge + "</p>" : ''}
      </div>
  `).join('') : '<p class="text-muted" style="width:100%; text-align:center; padding: 20px;">Líderes de ginásio não documentados para esta região no momento.</p>';

  container.innerHTML = `
    <div class="animate-fade">
      <nav class="main-nav" style="margin-top: -40px; margin-bottom: 30px; margin-left: -20px; margin-right: -20px; border-radius: 0 0 10px 10px;">
        <div class="nav-inner">
          <a href="#/games" class="nav-btn" style="color: var(--text-main); font-weight: bold;">&larr; Voltar para Regiões</a>
        </div>
      </nav>
      
      <!-- HEADER -->
      <div style="background: var(--card-bg); border-radius: var(--radius); padding: 40px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); margin-bottom: 40px;">
        <div style="display: flex; gap: 40px; align-items: center; border-bottom: 2px solid var(--border-color); padding-bottom: 30px; margin-bottom: 30px; flex-wrap: wrap;">
          <div style="background: var(--bg-color); padding: 20px; border-radius: 24px; border: 4px solid var(--border-color); display: flex; justify-content: center; align-items: center; width: 150px; height: 150px;">
            <img src="./assets/images/regions/${regionData.name}.png" alt="${regionData.name}" style="max-width: 100%; max-height: 100%; object-fit: contain; filter: drop-shadow(0 15px 15px rgba(0,0,0,0.1));" onerror="this.onerror=null; this.src='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/town-map.png'; this.style.opacity='0.4';" />
          </div>
          <div style="flex:1;">
            <h1 style="font-size: 3em; font-weight: 800; color: var(--text-main); margin-bottom: 10px; text-transform:capitalize;">${regionData.name}</h1>
            <p style="font-size: 1.1em; color: var(--text-muted); display: inline-block; background: var(--bg-color); padding: 8px 20px; border-radius: 20px; font-weight: 700;">Geração ${genNum}</p>
          </div>
        </div>
        <p style="font-size: 1.1rem; line-height: 1.8; color: var(--text-main);">${loreText}</p>
      </div>

      <!-- VERSIONS & JOGOS -->
      <div style="margin-bottom: 50px;">
         <h3 style="margin-bottom: 25px; font-size: 1.6rem; display: flex; align-items: center; gap: 10px;"><span>🎮</span> Jogos Lançados</h3>
         <div style="display: flex; gap: 15px; flex-wrap: wrap;">
            ${versionGroupHtml}
         </div>
      </div>

      <!-- GYM LEADERS -->
      <div style="margin-bottom: 50px;">
         <h3 style="margin-bottom: 25px; font-size: 1.6rem; display: flex; align-items: center; gap: 10px;"><span>🏅</span> Desafios de Ginásio</h3>
         <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 25px;">
            ${gymLeadersHtml}
         </div>
      </div>

      <!-- REGIONAL POKEDEX -->
      <div style="background: var(--card-bg); border-radius: var(--radius); padding: 40px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); margin-bottom: 40px;">
         <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; flex-wrap: wrap; gap:20px;">
            <h3 style="font-size: 1.6rem; display: flex; align-items: center; gap: 10px; margin:0;"><span>📚</span> Pokédex Regional (${pokedexEntries.length})</h3>
            <input type="text" id="regional-search" class="search-input" placeholder="Buscar na região..." style="width: 250px;" />
         </div>
         
         <div id="region-pokedex-grid" class="pokemon-grid" style="margin-top: 0;"></div>
         
         <div style="text-align: center; margin-top: 40px;">
           <button id="load-more-regional-btn" class="load-more" style="display: none;">Carregar Mais</button>
         </div>
      </div>
      
      <div id="leader-modal-root"></div>
    </div>
  `;

  // Attach Gym Leader Events
  container.querySelectorAll('.leader-card').forEach(card => {
     card.addEventListener('mouseover', () => { card.style.transform = 'translateY(-8px)'; card.style.borderColor = 'var(--text-main)'; });
     card.addEventListener('mouseout', () => { card.style.transform = 'none'; card.style.borderColor = 'transparent'; });
     card.addEventListener('click', () => {
         const idx = card.getAttribute('data-idx');
         renderLeadersModal(container, gymLeaders[idx]);
     });
  });

  // Attach search
  const searchInput = document.getElementById('regional-search');
  searchInput.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase().trim();
      if(!term) {
         filteredEntries = [...pokedexEntries];
      } else {
         filteredEntries = pokedexEntries.filter(entry => entry.pokemon_species.name.includes(term));
      }
      pokedexOffset = 0;
      document.getElementById('region-pokedex-grid').innerHTML = '';
      const btn = document.getElementById('load-more-regional-btn');
      if(btn) btn.style.display = 'inline-block';
      loadMorePokedex();
  });

  // Attach Load More
  const loadBtn = document.getElementById('load-more-regional-btn');
  if(loadBtn) {
     loadBtn.addEventListener('click', loadMorePokedex);
     if (filteredEntries.length > 0) {
        loadBtn.style.display = 'inline-block';
     }
  }

  // Initial load
  loadMorePokedex();
};
