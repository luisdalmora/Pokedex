import { fetchPokemonDetails, fetchSpeciesDetails, fetchEvolutionChain } from '../services/api.js';
import ProgressBar from '../components/ProgressBar.js';

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

  try {
    pokemon = await fetchPokemonDetails(id);
    species = await fetchSpeciesDetails(id);
    
    if (species.evolution_chain?.url) {
      const evoData = await fetchEvolutionChain(species.evolution_chain.url);
      let currentEvo = evoData.chain;
      
      do {
        const speciesUrlParts = currentEvo.species.url.split('/');
        const speciesId = speciesUrlParts[speciesUrlParts.length - 2];
        evos.push({
          name: currentEvo.species.name,
          id: speciesId
        });
        currentEvo = currentEvo.evolves_to[0];
      } while (currentEvo && !!currentEvo);
    }
  } catch (err) {
    console.error(err);
    container.innerHTML = '<div class="container retro-font">Pokémon não encontrado.</div>';
    return;
  }

  const getSprite = () => {
    try {
      return pokemon.sprites.versions['generation-i']['red-blue'].front_default || pokemon.sprites.front_default;
    } catch {
      return pokemon.sprites?.front_default || '';
    }
  };

  const getFlavorText = () => {
    const entry = species?.flavor_text_entries?.find(e => e.language.name === 'en' && e.version.name === 'red');
    return entry ? entry.flavor_text.replace(/\f/g, ' ') : 'Nenhuma descrição encontrada.';
  };

  const typesHtml = pokemon.types.map(t => `
    <span class="type-pill retro-font" style="background-color: var(--type-${t.type.name})">
      ${t.type.name}
    </span>
  `).join('');

  const statsHtml = pokemon.stats.map(stat => 
    ProgressBar({ 
      label: stat.stat.name.toUpperCase().replace('SPECIAL-', 'SP.'), 
      value: stat.base_stat 
    })
  ).join('');

  let evosHtml = '';
  if (evos.length > 1) {
    const evosItems = evos.map((evo, idx) => `
      <a href="#/pokemon/${evo.id}" class="evo-item">
        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-i/red-blue/${evo.id}.png" alt="${evo.name}" />
        <span class="retro-font capitalize">${evo.name}</span>
      </a>
      ${idx < evos.length - 1 ? '<span class="evo-arrow">→</span>' : ''}
    `).join('');

    evosHtml = `
      <div class="evolution-section">
        <h3 class="retro-font">Cadeia de Evolução</h3>
        <div class="evolution-chain">${evosItems}</div>
      </div>
    `;
  }

  container.innerHTML = `
    <main class="container detail-page animate-fade">
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
          <div class="detail-sprite-container">
            <img src="${getSprite()}" alt="${pokemon.name}" class="detail-sprite" />
            <div class="types-container detail-types">${typesHtml}</div>
          </div>

          <div class="detail-info">
            <p class="description retro-font">${getFlavorText()}</p>
            
            <div class="stats-container">
              <h3 class="retro-font">Base Stats</h3>
              ${statsHtml}
            </div>
          </div>
        </div>
        ${evosHtml}
      </div>
    </main>
  `;

  container.querySelector('.favorite-btn').addEventListener('click', () => toggleFavorite(id, container));
};

export default PokemonDetail;
