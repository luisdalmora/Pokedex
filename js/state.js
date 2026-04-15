export const state = {
  pokemons: [],
  filtered: [],
  favorites: JSON.parse(localStorage.getItem('pokedex_favorites')) || [],
  cache: {
    details: {},
    species: {},
    evolution: {}
  },
  pagination: {
    offset: 0,
    limit: 20,
    total: 1025
  },
  filters: {
    search: '',
    type: ''
  },
  loading: false
};

export const setPokemons = (newPokemons) => {
  state.pokemons = [...state.pokemons, ...newPokemons];
};

export const setFiltered = (filteredPokemons) => {
  state.filtered = filteredPokemons;
};

export const toggleFavorite = (id) => {
  if (state.favorites.includes(id)) {
    state.favorites = state.favorites.filter(favId => favId !== id);
  } else {
    state.favorites.push(id);
  }
  localStorage.setItem('pokedex_favorites', JSON.stringify(state.favorites));
};

export const setCache = (type, key, data) => {
  state.cache[type][key] = data;
};

export const getCache = (type, key) => {
  return state.cache[type][key] || null;
};
