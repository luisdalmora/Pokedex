import { formatId, getSprite } from '../utils/helpers.js';
import { translateType } from '../utils/translations.js';

export const createTypePill = (typeName) => {
  const span = document.createElement('span');
  span.className = `type-pill type-color-${typeName}`;
  span.textContent = translateType(typeName);
  return span;
};

export const createPokemonCard = (pokemon) => {
  if (!pokemon) return createSkeletonCard();

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
  img.loading = 'lazy';
  spriteContainer.appendChild(img);
  
  const info = document.createElement('div');
  info.className = 'card-info';
  
  const name = document.createElement('h3');
  name.className = 'pokemon-name';
  name.textContent = pokemon.name.replace('-', ' ');
  
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

export const createSkeletonCard = () => {
  const card = document.createElement('div');
  card.className = 'pokemon-card skeleton-card animate-fade';
  card.innerHTML = `
    <div class="card-header"><span class="skeleton-id shimmer"></span></div>
    <div class="sprite-container"><div class="skeleton-img shimmer"></div></div>
    <div class="card-info">
      <div class="skeleton-name shimmer"></div>
      <div class="types-container">
        <div class="skeleton-type shimmer"></div>
        <div class="skeleton-type shimmer"></div>
      </div>
    </div>
  `;
  return card;
};

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
