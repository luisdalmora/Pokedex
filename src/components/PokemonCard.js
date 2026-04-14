const PokemonCard = (pokemon) => {
  const formatId = (id) => `#${String(id).padStart(3, '0')}`;
  
  const getSprite = () => {
    try {
      return pokemon.sprites.versions['generation-i']['yellow'].front_default 
          || pokemon.sprites.front_default;
    } catch (e) {
      return pokemon.sprites?.front_default || '';
    }
  };

  const typesHtml = pokemon.types.map((typeObj) => `
    <span class="type-pill retro-font" style="background-color: var(--type-${typeObj.type.name})">
      ${typeObj.type.name}
    </span>
  `).join('');

  return `
    <a href="#/pokemon/${pokemon.id}" class="pokemon-card">
      <div class="card-header">
        <span class="pokemon-id retro-font">${formatId(pokemon.id)}</span>
      </div>
      
      <div class="sprite-container">
        <img src="${getSprite()}" alt="${pokemon.name}" class="pokemon-sprite" />
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
