import { fetchPokemonDetails, fetchSpeciesDetails, fetchEvolutionChain, fetchSpecialEvolutionsFallback } from '../api.js';

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
      btn.textContent = '★ Favorito';
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
  container.innerHTML = '<div class="loading-state">Carregando dados do Pokémon...</div>';

  const storedFavorites = JSON.parse(localStorage.getItem('pokedex_favorites')) || [];
  isFavorite = storedFavorites.includes(id);

  let pokemon, species, evos = [];
  let varietiesHtml = '';
  let evosHtml = '';

  try {
    pokemon = await fetchPokemonDetails(id);
    species = await fetchSpeciesDetails(id);
    
    // Simplificando árvore de evolução para evitar dependência do component antigo
    if (species.evolution_chain?.url) {
      const evoData = await fetchEvolutionChain(species.evolution_chain.url);
      
      const buildChainHtml = (node) => {
        let html = `
          <a href="#/pokemon/${node.species.name}" style="display: flex; flex-direction: column; align-items: center; text-decoration: none; color: inherit;">
            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${node.species.url.split('/').slice(-2,-1)[0]}.png" style="width: 80px; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.2));" />
            <span style="font-weight: 600; font-size: 0.9em; text-transform: capitalize;">${node.species.name}</span>
          </a>
        `;
        if (node.evolves_to && node.evolves_to.length > 0) {
           html += `<div style="display:flex; justify-content:center; gap: 20px;">`;
           node.evolves_to.forEach(child => {
              let methodDisplay = '';
              const details = child.evolution_details[0];
              if(details) {
                 if(details.min_level) methodDisplay = `Lvl ${details.min_level}`;
                 else if(details.item) methodDisplay = details.item.name.replace('-',' ');
                 else if(details.trigger.name === 'trade') methodDisplay = 'Trade';
                 else methodDisplay = '?';
              }
              html += `
                <div style="display: flex; flex-direction: column; align-items: center;">
                  <span style="font-size: 0.7em; color: var(--text-muted); margin: 20px 0 5px 0;">&darr; ${methodDisplay}</span>
                  ${buildChainHtml(child)}
                </div>
              `;
           });
           html += `</div>`;
        }
        return html;
      };

      evosHtml = `
        <div style="margin-top: 40px; padding: 20px; background: rgba(0,0,0,0.02); border-radius: 12px;">
          <h3 style="text-align: center; margin-bottom: 20px;">Cadeia de Evolução</h3>
          <div style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
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
             <div style="display: flex; flex-direction: column; align-items: center; gap: 5px; background: var(--card-bg); padding: 10px; border-radius: 12px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); min-width: 100px;">
               <img src="${vSprite}" alt="${vData.name}" style="height: 80px; object-fit: contain;" />
               <span style="font-size: 0.7em; text-transform: capitalize; text-align: center; font-weight: 600;">${label.replace('-', ' ')}</span>
             </div>
           `;
        }).join('');
        
        varietiesHtml = `
          <div style="margin-top: 30px;">
            <h3 style="margin-bottom: 15px;">Formas Alternativas</h3>
            <div style="display: flex; gap: 15px; overflow-x: auto; padding-bottom: 10px;">
              ${varietiesItems}
            </div>
          </div>
        `;
      } catch(e) {}
    }

  } catch (err) {
    container.innerHTML = '<div class="empty-state">Pokémon não encontrado.</div>';
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
    let entry = species?.flavor_text_entries?.find(e => e.language.name === 'es');
    if (!entry) entry = species?.flavor_text_entries?.find(e => e.language.name === 'en');
    return entry ? entry.flavor_text.replace(/\f/g, ' ') : 'Nenhuma descrição encontrada.';
  };

  const primaryType = pokemon.types[0].type.name;

  const typesHtml = pokemon.types.map(t => `
    <span class="type-pill type-color-${t.type.name}">
      ${t.type.name}
    </span>
  `).join('');

  const statNames = { 'hp': 'HP', 'attack': 'ATK', 'defense': 'DEF', 'special-attack': 'SPA', 'special-defense': 'SPD', 'speed': 'SPE' };

  const statsHtml = pokemon.stats.map(stat => {
    const fillPercent = Math.min((stat.base_stat / 255) * 100, 100);
    const colorClass = stat.base_stat > 90 ? '#4ade80' : stat.base_stat > 50 ? '#fbbf24' : '#f87171';
    return `
      <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
        <span style="width: 35px; font-size: 0.75rem; font-weight: 700; color: var(--text-muted);">${statNames[stat.stat.name]}</span>
        <span style="width: 30px; font-size: 0.85rem; font-weight: 600; text-align: right;">${stat.base_stat}</span>
        <div style="flex: 1; height: 8px; background: rgba(0,0,0,0.1); border-radius: 4px; overflow: hidden;">
          <div style="height: 100%; width: ${fillPercent}%; background-color: ${colorClass}; border-radius: 4px;"></div>
        </div>
      </div>
    `;
  }).join('');

  container.innerHTML = `
    <div class="animate-fade">
      <nav class="main-nav" style="margin-top: -40px; margin-bottom: 20px; margin-left: -20px; margin-right: -20px; border-radius: 0 0 10px 10px;">
        <div class="nav-inner">
          <a href="#/" class="nav-btn" style="color: var(--text-main);">< Voltar</a>
        </div>
      </nav>
      
      <div style="background: var(--card-bg); border-radius: var(--radius); padding: 30px; box-shadow: 0 4px 20px rgba(0,0,0,0.05);">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid var(--border-color); padding-bottom: 20px; margin-bottom: 30px;">
          <h1 style="font-size: 2rem; font-weight: 800; text-transform: capitalize;">
            <span style="color: var(--text-muted); margin-right: 10px;">#${String(pokemon.id).padStart(3, '0')}</span>${pokemon.name}
          </h1>
          <button class="favorite-btn" style="padding: 10px 20px; border-radius: 20px; border: 2px solid var(--text-main); font-weight: 600; cursor: pointer; transition: all 0.2s;">
            ${isFavorite ? '★ Favorito' : '☆ Favoritar'}
          </button>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 40px;">
          
          <div style="display: flex; flex-direction: column; align-items: center;">
            <div class="type-bg-${primaryType}" style="width: 100%; border-radius: var(--radius); padding: 40px 20px; display: flex; justify-content: center; align-items: center; box-shadow: inset 0 -10px 20px rgba(0,0,0,0.1);">
              <img src="${getSprite()}" alt="${pokemon.name}" style="width: 250px; filter: drop-shadow(0 15px 15px rgba(0,0,0,0.4)); animation: float 3s ease-in-out infinite;" />
            </div>
            <div style="display: flex; gap: 10px; margin-top: 20px;">
              ${typesHtml}
            </div>
          </div>

          <div>
            <div style="background: rgba(0,0,0,0.03); padding: 20px; border-radius: var(--radius); margin-bottom: 30px;">
              <p style="font-size: 1.1em; line-height: 1.6; font-style: italic;">"${getFlavorText()}"</p>
            </div>
            
            <div>
              <h3 style="margin-bottom: 15px;">Atributos Básicos</h3>
              ${statsHtml}
            </div>
          </div>
        </div>

        ${evosHtml}
        ${varietiesHtml}
      </div>
    </div>
  `;

  // Restore favorite state visually right away avoiding race conditions
  if(isFavorite) {
    const btn = container.querySelector('.favorite-btn');
    btn.classList.add('active');
    btn.style.background = 'var(--text-main)';
    btn.style.color = 'var(--bg-color)';
  } else {
    const btn = container.querySelector('.favorite-btn');
    btn.style.background = 'transparent';
    btn.style.color = 'var(--text-main)';
  }

  container.querySelector('.favorite-btn').addEventListener('click', () => toggleFavorite(id, container));
};
