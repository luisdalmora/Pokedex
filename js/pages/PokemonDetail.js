import { 
  fetchPokemonDetails, fetchSpeciesDetails, fetchTypeDetails, 
  fetchMoveDetails, fetchAbilityDetails, fetchLocationAreas 
} from '../services/api.js';
import { 
  translateType, translateStat, translateDamageClass, 
  getPtBrText, getAbilityTranslation 
} from '../utils/translations.js';
import { getSprite, formatId } from '../utils/helpers.js';
import { renderEvolutionTree } from '../components/EvolutionTree.js';
import { createTypePill } from '../components/PokemonCard.js';

let isFavorite = false;

const toggleFavorite = (id, btn) => {
  let stored = JSON.parse(localStorage.getItem('pokedex_favorites')) || [];
  if (stored.includes(id)) {
    stored = stored.filter(favId => favId !== id);
    isFavorite = false;
  } else {
    stored.push(id);
    isFavorite = true;
  }
  localStorage.setItem('pokedex_favorites', JSON.stringify(stored));
  
  if (isFavorite) {
    btn.classList.add('active');
    btn.textContent = '★ Favorito';
    btn.style.background = 'var(--text-main)';
    btn.style.color = 'var(--bg-color)';
  } else {
    btn.classList.remove('active');
    btn.textContent = '☆ Favoritar';
    btn.style.background = 'transparent';
    btn.style.color = 'var(--text-main)';
  }
};

export const renderPokemonDetail = async (container, id) => {
  container.innerHTML = `
    <div style="display:flex; justify-content:center; align-items:center; min-height:50vh;">
       <div class="skeleton-img shimmer" style="width: 150px; height:150px;"></div>
    </div>`;

  const storedFavorites = JSON.parse(localStorage.getItem('pokedex_favorites')) || [];
  isFavorite = storedFavorites.includes(id) || storedFavorites.includes(parseInt(id));

  let pokemon, species, locations;

  try {
    pokemon = await fetchPokemonDetails(id);
    if (!pokemon) throw new Error('Pokemon not found');
    species = await fetchSpeciesDetails(pokemon.species.name);
    locations = await fetchLocationAreas(pokemon.id);
  } catch (err) {
    container.innerHTML = '<div class="empty-state">Erro: Pokémon não foi encontrado. Favor retornar.</div>';
    return;
  }

  const primaryType = pokemon.types[0].type.name;
  const typesHtml = pokemon.types.map(t => createTypePill(t.type.name).outerHTML).join('');
  
  // Stats
  const statsHtml = pokemon.stats.map(stat => {
    const fillPercent = Math.min((stat.base_stat / 255) * 100, 100);
    const colorClass = stat.base_stat > 90 ? '#4ade80' : stat.base_stat > 50 ? '#fbbf24' : '#f87171';
    return `
      <div class="stat-row" style="margin-bottom: 12px; border:none;">
        <span class="stat-name" style="width: 80px; text-transform:uppercase; font-size:0.85em; font-weight:700;">${translateStat(stat.stat.name)}</span>
        <span class="stat-value" style="width: 35px; text-align:right;">${stat.base_stat}</span>
        <div style="flex: 1; height: 10px; background: rgba(0,0,0,0.05); border-radius: 5px; margin-left: 15px; overflow: hidden;">
          <div style="height: 100%; width: ${fillPercent}%; background-color: ${colorClass}; border-radius: 5px;"></div>
        </div>
      </div>
    `;
  }).join('');

  // Description
  const flavorText = getPtBrText(species?.flavor_text_entries, 'flavor_text') || 'Nenhuma descrição disponível em português.';

  // Abilities
  const abilitiesPromises = pokemon.abilities.map(async ab => {
     let ptDesc = 'Descrição não disponível';
     if(ab.is_hidden) ptDesc += ' (Habilidade Oculta)';
     return `<li><strong>${getAbilityTranslation(ab.ability.name).replace('-', ' ')}</strong> ${ab.is_hidden ? '<span style="color:#ef4444;font-size:0.8em;">(Oculta)</span>' : ''}</li>`;
  });
  const abilitiesHtmlList = (await Promise.all(abilitiesPromises)).join('');

  // Pokedex Regions
  const pokedexPills = species.pokedex_numbers ? species.pokedex_numbers.map(p => {
    let rawName = p.pokedex.name.replace('original-', '').replace('updated-', '').replace('extended-', '').replace('letsgo-', '').replace('kalos-', '');
    if(rawName === 'national') rawName = 'Nacional';
    else if(rawName === 'conquest-gallery') return '';
    return `<a href="#/games/${rawName}" style="display:inline-block; margin: 3px; padding: 5px 12px; font-size: 0.85em; font-weight: 700; background: var(--card-bg); color: var(--text-main); border: 1px solid var(--border-color); border-radius: 12px; text-decoration: none; text-transform: capitalize; transition: all 0.2s; box-shadow: 0 2px 4px rgba(0,0,0,0.02);" onmouseover="this.style.borderColor='var(--text-main)'; this.style.transform='translateY(-2px)';" onmouseout="this.style.borderColor='var(--border-color)'; this.style.transform='none';">${rawName}</a>`;
  }).filter(Boolean).join('') : '<span style="font-size:0.9em;color:var(--text-muted);">Dados indisponíveis</span>';

  let varietiesHtml = '';
  if (species.varieties && species.varieties.length > 1) {
    try {
      const varietyPromises = species.varieties.map(v => fetch(v.pokemon.url).then(r => r.json()));
      const varietiesData = await Promise.all(varietyPromises);
      
      const varietiesItems = varietiesData.map(vData => {
         const vSprite = getSprite(vData);
         let label = vData.name;
         if(label === pokemon.name) label = "Normal";
         else label = label.replace(pokemon.name + '-', '');
         
         return `
           <a href="#/pokemon/${vData.name}" style="display: flex; flex-direction: column; align-items: center; gap: 10px; background: var(--bg-color); padding: 15px; border-radius: 12px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); min-width: 120px; text-decoration: none; transition: transform 0.2s;" class="hoverable-node">
             <img src="${vSprite}" alt="${vData.name}" style="height: 80px; object-fit: contain; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));" />
             <span style="font-size: 0.8em; text-transform: capitalize; text-align: center; font-weight: 700; color: var(--text-main);">${label.replace('-', ' ')}</span>
           </a>
         `;
      }).join('');
      
      varietiesHtml = `
        <div style="margin-top: 40px; padding: 20px 0;">
          <h3 style="margin-bottom: 20px; font-size: 1.5rem; display: flex; align-items: center; gap: 10px;"><span style="font-size: 1.5rem;">🎭</span> Formas Alternativas</h3>
          <div style="display: flex; gap: 20px; overflow-x: auto; padding-bottom: 15px; scrollbar-width: thin;">
            ${varietiesItems}
          </div>
        </div>
      `;
    } catch(e) {
      console.error("Failed to load varieties", e);
    }
  }

  // Build the main UI
  let html = `
    <div class="animate-fade">
      <nav class="main-nav" style="margin-top: -40px; margin-bottom: 30px; margin-left: -20px; margin-right: -20px; border-radius: 0 0 10px 10px;">
        <div class="nav-inner">
          <a href="#/" class="nav-btn" style="color: var(--text-main); font-weight: bold;">&larr; Voltar para Pokédex</a>
        </div>
      </nav>
      
      <div style="background: var(--card-bg); border-radius: var(--radius); padding: 40px; box-shadow: 0 10px 30px rgba(0,0,0,0.08);">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid var(--border-color); padding-bottom: 20px; margin-bottom: 30px; flex-wrap:wrap; gap:20px;">
          <h1 style="font-size: 2.5rem; font-weight: 800; text-transform: capitalize;">
            <span style="color: var(--text-muted); margin-right: 15px; font-size: 2rem;">${formatId(pokemon.id)}</span>${pokemon.name.replace('-', ' ')}
          </h1>
          <button id="fav-btn" style="padding: 12px 25px; border-radius: 30px; border: 2px solid var(--text-main); font-weight: 700; cursor: pointer; transition: all 0.3s;">
            ${isFavorite ? '★ Favorito' : '☆ Favoritar'}
          </button>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 50px;">
          
          <div style="display: flex; flex-direction: column; align-items: center;">
            <div class="type-bg-${primaryType}" style="width: 100%; border-radius: 24px; padding: 50px 20px; display: flex; justify-content: center; align-items: center; box-shadow: inset 0 -15px 30px rgba(0,0,0,0.1), 0 10px 20px rgba(0,0,0,0.05); position: relative; overflow: hidden;">
              <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: radial-gradient(circle, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 70%);"></div>
              <img src="${getSprite(pokemon)}" alt="${pokemon.name}" style="width: 250px; height: 250px; object-fit: contain; filter: drop-shadow(0 20px 20px rgba(0,0,0,0.4)); animation: float 4s ease-in-out infinite; position: relative; z-index: 2;" />
            </div>
            <div style="display: flex; gap: 15px; margin-top: 25px;">
              ${typesHtml}
            </div>
          </div>

          <div style="display: flex; flex-direction: column; justify-content: center;">
            <div style="background: rgba(0,0,0,0.03); padding: 25px; border-radius: var(--radius); margin-bottom: 20px; border-left: 4px solid var(--text-muted);">
               <p style="font-size: 1.15em; line-height: 1.7; font-style: italic; color: var(--text-main);">"${flavorText}"</p>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
               <div style="background: var(--bg-color); padding: 20px; border-radius: var(--radius);">
                 <h4 style="margin-bottom:10px; color:var(--text-muted);">Habilidades</h4>
                 <ul style="padding-left:20px; line-height:1.6;">${abilitiesHtmlList}</ul>
               </div>
               <div style="background: var(--bg-color); padding: 20px; border-radius: var(--radius);">
                 <h4 style="margin-bottom:10px; color:var(--text-muted);">Dados Básicos</h4>
                 <p><strong>Geração:</strong> ${species.generation ? species.generation.name.toUpperCase() : '?'}</p>
                 <p><strong>Taxa Captura:</strong> ${species.capture_rate || '?'}</p>
                 <p><strong>Altura:</strong> ${(pokemon.height / 10).toFixed(1)}m</p>
                 <p><strong>Peso:</strong> ${(pokemon.weight / 10).toFixed(1)}kg</p>
                 
                 <div style="margin-top: 15px; border-top: 1px solid var(--border-color); padding-top: 15px;">
                   <p style="margin-bottom: 10px; font-size: 0.9em; color: var(--text-muted);"><strong>📍 Encontrado nativamente em:</strong></p>
                   <div style="display: flex; flex-wrap: wrap; gap: 4px;">
                     ${pokedexPills}
                   </div>
                 </div>
               </div>
            </div>

            <div style="background: var(--bg-color); padding: 25px; border-radius: var(--radius);">
              <h3 style="margin-bottom: 25px; font-size: 1.4rem; display: flex; align-items: center; gap: 10px;"><span style="font-size: 1.4rem;">📊</span>Atributos Base</h3>
              ${statsHtml}
            </div>
          </div>
        </div>

        <div id="evolution-wrapper"></div>
        ${varietiesHtml}
      </div>
    </div>
  `;

  container.innerHTML = html;

  const favBtn = document.getElementById('fav-btn');
  if(isFavorite) {
    favBtn.classList.add('active');
    favBtn.style.background = 'var(--text-main)';
    favBtn.style.color = 'var(--bg-color)';
  }
  favBtn.addEventListener('click', () => toggleFavorite(pokemon.id, favBtn));

  if (species.evolution_chain?.url) {
    renderEvolutionTree(document.getElementById('evolution-wrapper'), species.evolution_chain.url);
  }
};
