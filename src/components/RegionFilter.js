const RegionFilter = ({ regions, selectedRegion }) => {
  const options = regions.map(r => 
    `<option value="${r.slug}" ${r.slug === selectedRegion ? 'selected' : ''}>
      ${r.name} (Gen ${r.generation})
    </option>`
  ).join('');

  return `
    <div class="filter-wrapper region-filter">
      <select id="region-filter" class="filter-select">
        ${options}
      </select>
    </div>
  `;
};

export default RegionFilter;
