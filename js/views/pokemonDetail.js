import { fetchPokemonDetails, fetchSpeciesDetails, fetchEvolutionChain } from '../api.js';
import { translateType, translateStat, translateMethod } from '../translations.js';

let isFavorite = false;

const toggleFavorite = (id, container) => {
  let stored = JSON.parse(localStorage.getItem('pokedex_favorites')) || [];
  if (stored.includes(id)) {
    stored = stored.filter(favId => favId !== id);
    isFavorite = false;
  } else {
    stored.push(id);
    isFavorite = true;
  }
  localStorage.setItem('pokedex_favorites', JSON.stringify(stored));
  
  const btn = container.querySelector('.favorite-btn');
  if (btn) {
    if (isFavorite) {
      btn.classList.add('active');
      btn.textContent = '★ Favoritar';
      btn.style.background = 'var(--text-main)';
      btn.style.color = 'var(--bg-color)';
    } else {
      btn.classList.remove('active');
      btn.textContent = '☆ Favoritar';
      btn.style.background = 'transparent';
      btn.style.color = 'var(--text-main)';
    }
  }
};

export const renderPokemonDetail = async (container, id) => {
  container.innerHTML = '<div class="loading-state">Localizando dados na Pokédex...</div>';

  const storedFavorites = JSON.parse(localStorage.getItem('pokedex_favorites')) || [];
  isFavorite = storedFavorites.includes(id);

  let pokemon, species, evoData;
  let varietiesHtml = '';
  let evosHtml = '';

  try {
    pokemon = await fetchPokemonDetails(id);
    if (!pokemon) throw new Error('Pokemon not found');
    species = await fetchSpeciesDetails(pokemon.species.name);
    
    // Evolução Horizontal
    if (species.evolution_chain?.url) {
      evoData = await fetchEvolutionChain(species.evolution_chain.url);
      
      const buildChainHtml = (node) => {
        let html = `
          <a href="#/pokemon/${node.species.name}" style="display: flex; flex-direction: column; align-items: center; text-decoration: none; color: inherit; padding: 10px; transition: transform 0.2s;" class="evo-node hoverable-node">
            <div style="background: rgba(255,255,255,0.5); border-radius: 50%; padding: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${node.species.url.split('/').slice(-2,-1)[0]}.png" style="width: 80px; height: 80px; object-fit: contain; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.2));" />
            </div>
            <span style="font-weight: 700; font-size: 0.9em; text-transform: capitalize; margin-top: 10px;">${node.species.name}</span>
          </a>
        `;
        if (node.evolves_to && node.evolves_to.length > 0) {
           html += `<div style="display:flex; flex-direction: column; justify-content:center; align-items: flex-start; gap: 15px;">`;
           node.evolves_to.forEach(child => {
              let methodDisplay = '';
              const details = child.evolution_details[0];
              if(details) {
                 if(details.item) {
                   methodDisplay = `<div style="display:flex; flex-direction:column; align-items:center;"><img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${details.item.name}.png" style="width: 30px; filter: drop-shadow(0 2px 2px rgba(0,0,0,0.3));" onerror="this.style.display='none';"/><span>${translateMethod('item-' + details.item.name)}</span></div>`;
                 } else if(details.trigger.name === 'trade') {
                   methodDisplay = `<div style="display:flex; flex-direction:column; align-items:center;"><span style="font-size:1.5rem;">🔁</span><span>Troca</span></div>`;
                   if(details.held_item) methodDisplay = `<div style="display:flex; flex-direction:column; align-items:center;"><img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${details.held_item.name}.png" style="width: 30px; filter: drop-shadow(0 2px 2px rgba(0,0,0,0.3));" /><span>Troca c/ Item</span></div>`;
                 } else if(details.min_level) {
                   methodDisplay = `<div style="display:flex; flex-direction:column; align-items:center;"><span style="font-size:1.2rem;">📊</span><span>Nv ${details.min_level}</span></div>`;
                 } else if(details.min_happiness) {
                   methodDisplay = `<div style="display:flex; flex-direction:column; align-items:center;"><span style="font-size:1.2rem;">✨</span><span>Felicidade ${details.time_of_day ? (details.time_of_day==='day'?'☀️':'🌙') : ''}</span></div>`;
                 } else if(details.location) {
                   methodDisplay = `<div style="display:flex; flex-direction:column; align-items:center;"><span style="font-size:1.2rem;">📍</span><span>Local</span></div>`;
                 } else {
                   methodDisplay = `<div style="display:flex; flex-direction:column; align-items:center;"><span style="font-size:1.2rem;">✨</span><span>Especial</span></div>`;
                 }
              }
              html += `
                <div style="display: flex; flex-direction: row; align-items: center; width: 100%;">
                  <div style="display: flex; flex-direction: column; align-items: center; padding: 0 15px; min-width: 80px;">
                    <span style="color: var(--text-muted); font-size: 1.2rem; font-weight: bold;">&rarr;</span>
                    <span style="font-size: 0.7em; color: var(--text-muted); text-align: center; background: var(--bg-color); padding: 2px 6px; border-radius: 10px;">${methodDisplay}</span>
                  </div>
                  ${buildChainHtml(child)}
                </div>
              `;
           });
           html += `</div>`;
        }
        return html;
      };

      evosHtml = `
        <div style="margin-top: 40px; padding: 30px; background: rgba(0,0,0,0.02); border-radius: 12px; overflow-x: auto;">
          <h3 style="text-align: left; margin-bottom: 20px; font-size: 1.5rem; display: flex; align-items: center; gap: 10px;"><span style="font-size: 1.5rem;">🧬</span>Cadeia de Evolução</h3>
          <div style="display: flex; flex-direction: row; align-items: center; justify-content: flex-start; min-width: max-content;">
            ${buildChainHtml(evoData.chain)}
          </div>
        </div>
      `;
    }

    if (species.varieties && species.varieties.length > 1) {
      try {
        const varietyPromises = species.varieties.map(v => fetch(v.pokemon.url).then(r => r.json()));
        const varietiesData = await Promise.all(varietyPromises);
        
        const varietiesItems = varietiesData.map(vData => {
           const vSprite = vData.sprites?.other?.home?.front_default || vData.sprites?.other?.['official-artwork']?.front_default || vData.sprites?.front_default || '';
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
            <h3 style="margin-bottom: 20px; font-size: 1.5rem; display: flex; align-items: center; gap: 10px;"><span style="font-size: 1.5rem;">🎭</span>Formas Alternativas</h3>
            <div style="display: flex; gap: 20px; overflow-x: auto; padding-bottom: 15px; scrollbar-width: thin;">
              ${varietiesItems}
            </div>
          </div>
        `;
      } catch(e) {}
    }

  } catch (err) {
    container.innerHTML = '<div class="empty-state">Ocorreu um erro ou este Pokémon não foi encontrado.</div>';
    return;
  }

  const getSprite = () => {
    try {
      const other = pokemon.sprites?.other || {};
      return other.home?.front_default 
        || other['official-artwork']?.front_default
        || pokemon.sprites?.front_default 
        || '';
    } catch {
      return pokemon.sprites?.front_default || '';
    }
  };

  const getFlavorText = () => {
    let entry = species?.flavor_text_entries?.find(e => e.language.name === 'pt' || e.language.name === 'pt-BR');
    if (!entry) entry = species?.flavor_text_entries?.find(e => e.language.name === 'en');
    return entry ? entry.flavor_text.replace(/\f/g, ' ').replace(/\n/g, ' ') : 'Nenhuma descrição encontrada.';
  };

  const primaryType = pokemon.types[0].type.name;

  const typesHtml = pokemon.types.map(t => `
    <span class="type-pill type-color-${t.type.name}">
      ${translateType(t.type.name)}
    </span>
  `).join('');

  const statsHtml = pokemon.stats.map(stat => {
    const fillPercent = Math.min((stat.base_stat / 255) * 100, 100);
    const colorClass = stat.base_stat > 90 ? '#4ade80' : stat.base_stat > 50 ? '#fbbf24' : '#f87171';
    return `
      <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 12px;">
        <span style="width: 80px; font-size: 0.8rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">${translateStat(stat.stat.name)}</span>
        <span style="width: 35px; font-size: 0.9rem; font-weight: 600; text-align: right;">${stat.base_stat}</span>
        <div style="flex: 1; height: 10px; background: rgba(0,0,0,0.05); border-radius: 5px; overflow: hidden; box-shadow: inset 0 1px 2px rgba(0,0,0,0.1);">
          <div style="height: 100%; width: ${fillPercent}%; background-color: ${colorClass}; border-radius: 5px; transition: width 1s ease-in-out;"></div>
        </div>
      </div>
    `;
  }).join('');

  container.innerHTML = `
    <div class="animate-fade">
      <nav class="main-nav" style="margin-top: -40px; margin-bottom: 30px; margin-left: -20px; margin-right: -20px; border-radius: 0 0 10px 10px;">
        <div class="nav-inner">
          <a href="#/" class="nav-btn" style="color: var(--text-main); font-weight: bold;">&larr; Voltar para Pokédex</a>
        </div>
      </nav>
      
      <div style="background: var(--card-bg); border-radius: var(--radius); padding: 40px; box-shadow: 0 10px 30px rgba(0,0,0,0.08);">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid var(--border-color); padding-bottom: 20px; margin-bottom: 30px;">
          <h1 style="font-size: 2.5rem; font-weight: 800; text-transform: capitalize;">
            <span style="color: var(--text-muted); margin-right: 15px; font-size: 2rem;">#${String(pokemon.id).padStart(3, '0')}</span>${pokemon.name}
          </h1>
          <button class="favorite-btn" style="padding: 12px 25px; border-radius: 30px; border: 2px solid var(--text-main); font-weight: 700; cursor: pointer; transition: all 0.3s;">
            ${isFavorite ? '★ Favoritar' : '☆ Favoritar'}
          </button>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 50px;">
          
          <div style="display: flex; flex-direction: column; align-items: center;">
            <div class="type-bg-${primaryType}" style="width: 100%; border-radius: 24px; padding: 50px 20px; display: flex; justify-content: center; align-items: center; box-shadow: inset 0 -15px 30px rgba(0,0,0,0.1), 0 10px 20px rgba(0,0,0,0.05); position: relative; overflow: hidden;">
              <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: radial-gradient(circle, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 70%);"></div>
              <img src="${getSprite()}" alt="${pokemon.name}" style="width: 250px; height: 250px; object-fit: contain; filter: drop-shadow(0 20px 20px rgba(0,0,0,0.4)); animation: float 4s ease-in-out infinite; position: relative; z-index: 2;" />
            </div>
            <div style="display: flex; gap: 15px; margin-top: 25px;">
              ${typesHtml}
            </div>
          </div>

          <div style="display: flex; flex-direction: column; justify-content: center;">
            <div style="background: rgba(0,0,0,0.03); padding: 25px; border-radius: var(--radius); margin-bottom: 40px; border-left: 4px solid var(--text-muted);">
              <p style="font-size: 1.15em; line-height: 1.7; font-style: italic; color: var(--text-main);">"${getFlavorText()}"</p>
            </div>
            
            <div style="background: var(--bg-color); padding: 25px; border-radius: var(--radius);">
              <h3 style="margin-bottom: 25px; font-size: 1.4rem; display: flex; align-items: center; gap: 10px;"><span style="font-size: 1.4rem;">📊</span>Atributos Base</h3>
              ${statsHtml}
            </div>
          </div>
        </div>

        ${evosHtml}
        ${varietiesHtml}
      </div>
    </div>
  `;

  if(isFavorite) {
    const btn = container.querySelector('.favorite-btn');
    btn.classList.add('active');
    btn.style.background = 'var(--text-main)';
    btn.style.color = 'var(--bg-color)';
  }

  container.querySelector('.favorite-btn').addEventListener('click', () => toggleFavorite(id, container));
  
  // Style rules specific to nodes inside this file using a style tag since they are small
  const style = document.createElement('style');
  style.innerHTML = `
    .hoverable-node:hover img { transform: scale(1.15); transition: transform 0.2s; }
  `;
  container.appendChild(style);
};
