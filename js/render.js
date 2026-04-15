import { state } from './state.js';
import { translateType } from './translations.js';

export const formatId = (id) => `#${String(id).padStart(3, '0')}`;

export const getSprite = (pokemon) => {
  try {
    const other = pokemon.sprites?.other || {};
    return other.home?.front_default 
      || other['official-artwork']?.front_default
      || pokemon.sprites.versions?.['generation-i']?.['red-blue']?.front_transparent
      || pokemon.sprites?.front_default 
      || '';
  } catch (e) {
    return pokemon.sprites?.front_default || '';
  }
};

export const createTypePill = (typeName) => {
  const span = document.createElement('span');
  span.className = `type-pill type-color-${typeName}`;
  span.textContent = translateType(typeName);
  return span;
};

// Evitar innerHTML na criação do card, usar API DOM ou template strings de forma unificada para performance
export const createPokemonCard = (pokemon) => {
  const primaryType = pokemon.types[0].type.name;
  
  const card = document.createElement('a');
  card.href = `#/pokemon/${pokemon.id}`;
  card.className = `pokemon-card type-bg-${primaryType} animate-fade`;
  card.dataset.id = pokemon.id;
  
  const header = document.createElement('div');
  header.className = 'card-header';
  const idSpan = document.createElement('span');
  idSpan.className = 'pokemon-id';
  idSpan.textContent = formatId(pokemon.id);
  header.appendChild(idSpan);
  
  const spriteContainer = document.createElement('div');
  spriteContainer.className = 'sprite-container';
  const img = document.createElement('img');
  img.src = getSprite(pokemon);
  img.alt = pokemon.name;
  img.className = 'pokemon-sprite float-anim';
  img.loading = 'lazy'; // Lazy loading
  spriteContainer.appendChild(img);
  
  const info = document.createElement('div');
  info.className = 'card-info';
  
  const name = document.createElement('h3');
  name.className = 'pokemon-name';
  name.textContent = pokemon.name;
  
  const typesContainer = document.createElement('div');
  typesContainer.className = 'types-container';
  pokemon.types.forEach(t => {
    typesContainer.appendChild(createTypePill(t.type.name));
  });
  
  info.appendChild(name);
  info.appendChild(typesContainer);
  
  card.appendChild(header);
  card.appendChild(spriteContainer);
  card.appendChild(info);
  
  return card;
};

// Renderiza uma lista de pokemon no grid
export const renderPokemonGrid = (container, pokemons, append = false) => {
  if (!append) {
    container.innerHTML = '';
  }
  
  if (pokemons.length === 0 && !append) {
    container.innerHTML = '<div class="empty-state">Nenhum Pokémon encontrado.</div>';
    return;
  }
  
  const fragment = document.createDocumentFragment();
  pokemons.forEach(pokemon => {
    fragment.appendChild(createPokemonCard(pokemon));
  });
  
  container.appendChild(fragment);
};

export const renderLoading = (container, show) => {
  let loader = document.getElementById('loading-spinner');
  if (show) {
    if (!loader) {
      loader = document.createElement('div');
      loader.id = 'loading-spinner';
      loader.className = 'loading-state';
      loader.textContent = 'Carregando Pokédex...';
      container.appendChild(loader);
    }
  } else {
    if (loader) loader.remove();
  }
};
