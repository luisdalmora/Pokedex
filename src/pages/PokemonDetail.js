import { fetchPokemonDetails, fetchSpeciesDetails, fetchEvolutionChain, fetchSpecialEvolutionsFallback } from '../services/api.js';
import ProgressBar from '../components/ProgressBar.js';
import EvolutionTree from '../components/EvolutionTree.js';

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
    } else {
      btn.classList.remove('active');
      btn.textContent = '☆ Favoritar';
    }
  }
};

const PokemonDetail = async (container, id) => {
  container.innerHTML = '<div class="container retro-font loading-state">Carregando dados do Pokémon...</div>';

  const storedFavorites = JSON.parse(localStorage.getItem('pokedex_favorites')) || [];
  isFavorite = storedFavorites.includes(id);

  let pokemon, species, evos = [];
  let varietiesHtml = '';
  let evosHtml = '';

  try {
    pokemon = await fetchPokemonDetails(id);
    species = await fetchSpeciesDetails(id);
    
    if (species.evolution_chain?.url) {
      const evoData = await fetchEvolutionChain(species.evolution_chain.url);
      const specialEvolutionsFallbackData = await fetchSpecialEvolutionsFallback();
      
      evosHtml = `
        <div class="evolution-section" style="margin-top: 30px;">
          <h3 class="retro-font" style="text-align: center; border-bottom: 2px dashed rgba(0,0,0,0.1); padding-bottom: 10px; border-top: 2px dashed rgba(0,0,0,0.1); padding-top: 20px; border-radius: 0;">Cadeia de Evolução</h3>
          ${EvolutionTree(evoData.chain, specialEvolutionsFallbackData.specialEvolutions)}
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
             <div class="variety-item pokemon-card" style="display: flex; flex-direction: column; align-items: center; gap: 5px; flex: 0 0 auto; min-width: 120px;">
               <img src="${vSprite}" alt="${vData.name}" style="height: 100px; object-fit: contain;" />
               <span class="retro-font" style="font-size: 0.7em; text-transform: capitalize; text-align: center;">${label.replace('-', ' ')}</span>
             </div>
           `;
        }).join('');
        
        varietiesHtml = `
          <div class="varieties-section" style="margin-top: 30px; border-top: 2px dashed rgba(0,0,0,0.1); padding-top: 20px;">
            <h3 class="retro-font" style="text-align: center; margin-bottom: 20px;">Variações & Formas</h3>
            <div style="display: flex; gap: 15px; overflow-x: auto; padding-bottom: 10px; justify-content: center; flex-wrap: wrap;">
              ${varietiesItems}
            </div>
          </div>
        `;
      } catch(e) {
         console.error("Error loading varieties", e);
      }
    }

  } catch (err) {
    console.error(err);
    container.innerHTML = '<div class="container retro-font">Pokémon não encontrado.</div>';
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
    // Tentar espanhol como fallback mais próximo se PT não existir na pokeapi ainda, caso nao, ingles
    let entry = species?.flavor_text_entries?.find(e => e.language.name === 'es');
    if (!entry) entry = species?.flavor_text_entries?.find(e => e.language.name === 'en');
    return entry ? entry.flavor_text.replace(/\f/g, ' ') : 'Nenhuma descrição encontrada.';
  };

  const primaryType = pokemon.types[0].type.name;

  const typesHtml = pokemon.types.map(t => `
    <span class="type-pill retro-font" style="background-color: var(--type-${t.type.name})">
      ${t.type.name}
    </span>
  `).join('');

  const statNamesPt = {
    'hp': 'Vida (HP)',
    'attack': 'Ataque',
    'defense': 'Defesa',
    'special-attack': 'Ataque Esp.',
    'special-defense': 'Defesa Esp.',
    'speed': 'Velocidade'
  };

  const statsHtml = pokemon.stats.map(stat => 
    ProgressBar({ 
      label: statNamesPt[stat.stat.name] || stat.stat.name.toUpperCase(), 
      value: stat.base_stat 
    })
  ).join('');

  container.innerHTML = `
    <main class="container detail-page animate-fade" style="--card-type-color: var(--type-${primaryType});">
      <a href="#/" class="back-link retro-font">< Voltar</a>
      
      <div class="detail-card">
        <div class="detail-header">
          <h1 class="retro-font capitalize">
            #${String(pokemon.id).padStart(3, '0')} ${pokemon.name}
          </h1>
          <button class="favorite-btn retro-font ${isFavorite ? 'active' : ''}">
            ${isFavorite ? '★ Favorito' : '☆ Favoritar'}
          </button>
        </div>

        <div class="detail-body">
          <div class="detail-sprite-container" style="background-color: color-mix(in srgb, var(--card-type-color) 25%, transparent); border-radius: 12px; padding: 20px; display: flex; flex-direction: column; align-items: center; justify-content: center;">
            <img src="${getSprite()}" alt="${pokemon.name}" class="detail-sprite" style="max-height: 250px; filter: drop-shadow(4px 4px 10px rgba(0,0,0,0.3));" />
            <div class="types-container detail-types" style="margin-top: 20px;">${typesHtml}</div>
          </div>

          <div class="detail-info">
            <div style="background-color: #f0f0f0; padding: 20px; border-radius: 12px; border: 2px solid #ddd; margin-bottom: 20px;">
              <p class="description retro-font" style="line-height: 1.6; font-size: 0.9em;">${getFlavorText()}</p>
            </div>
            
            <div class="stats-container">
              <h3 class="retro-font" style="margin-bottom: 15px;">Atributos Base</h3>
              ${statsHtml}
            </div>
          </div>
        </div>
        ${evosHtml}
        ${varietiesHtml}
      </div>
    </main>
  `;

  container.querySelector('.favorite-btn').addEventListener('click', () => toggleFavorite(id, container));
};

export default PokemonDetail;
