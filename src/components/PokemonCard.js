const PokemonCard = (pokemon) => {
  const formatId = (id) => `#${String(id).padStart(3, '0')}`;

  const getSprite = () => {
    try {
      // Usando a versão transparente da Geração I para evitar o fundo branco
      return pokemon.sprites.versions['generation-i']['red-blue'].front_transparent
        || pokemon.sprites.versions['generation-i']['yellow'].front_transparent
        || pokemon.sprites.front_default;
    } catch (e) {
      return pokemon.sprites?.front_default || '';
    }
  };

  const primaryType = pokemon.types[0].type.name;

  const typesHtml = pokemon.types.map((typeObj) => `
    <span class="type-pill" style="background-color: var(--type-${typeObj.type.name})">
      ${typeObj.type.name}
    </span>
  `).join('');

  return `
    <a href="#/pokemon/${pokemon.id}" class="pokemon-card animate-fade" style="--card-type-color: var(--type-${primaryType})">
      <div class="card-header">
        <span class="pokemon-id">${formatId(pokemon.id)}</span>
      </div>
      
      <div class="sprite-container" style="background-color: color-mix(in srgb, var(--type-${primaryType}) 25%, transparent);">
        <img src="${getSprite()}" alt="${pokemon.name}" class="pokemon-sprite" loading="lazy" />
      </div>

      <div class="card-info">
        <h3 class="pokemon-name">${pokemon.name}</h3>
        <div class="types-container">
          ${typesHtml}
        </div>
      </div>
    </a>
  `;
};

export default PokemonCard;
