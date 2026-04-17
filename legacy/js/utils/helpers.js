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

export const getMegaGMaxSprite = (pokemon) => {
    try {
      const other = pokemon.sprites?.other || {};
      return other.home?.front_default 
        || other['official-artwork']?.front_default
        || pokemon.sprites?.front_default 
        || '';
    } catch {
      return '';
    }
};

export const getItemSprite = (itemName) => {
  // Try local first, fallback to pokeapi raw if we didn't download it
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${itemName}.png`;
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};
