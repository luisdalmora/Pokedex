// src/utils/helpers.js
export const typeColors = {
    normal: '#A8A77A', fire: '#EE8130', water: '#6390F0', electric: '#F7D02C',
    grass: '#7AC74C', ice: '#96D9D6', fighting: '#C22E28', poison: '#A33EA1',
    ground: '#E2BF65', flying: '#A98FF3', psychic: '#F95587', bug: '#A6B91A',
    rock: '#B6A136', ghost: '#735797', dragon: '#6F35FC', dark: '#705746',
    steel: '#B7B7CE', fairy: '#D685AD',
};

// Converte ID para formato #001
export const formatId = (id) => `#${String(id).padStart(3, '0')}`;

// Capitaliza a primeira letra
export const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

// Retorna cor primária do Pokémon
export const getPrimaryColor = (types) => typeColors[types[0].type.name] || typeColors.normal;

// Toca o som (cry) do Pokémon
export const playPokemonCry = (id) => {
    const audio = new Audio(`https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${id}.ogg`);
    audio.volume = 0.5;
    audio.play().catch(e => console.log('Áudio bloqueado pelo navegador'));
};