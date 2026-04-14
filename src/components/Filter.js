const pokemonTypes = [
  'Todos',
  'normal', 'fire', 'water', 'electric', 'grass', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon'
];

const Filter = ({ selectedType }) => {
  const optionsHtml = pokemonTypes.map(type => {
    const value = type === 'Todos' ? '' : type;
    const isSelected = value === selectedType ? 'selected' : '';
    return `<option value="${value}" ${isSelected}>${type}</option>`;
  }).join('');

  return `
    <div class="filter-container">
      <span class="filter-label retro-font">Tipo:</span>
      <select id="type-filter" class="filter-select retro-font">
        ${optionsHtml}
      </select>
    </div>
  `;
};

export default Filter;
