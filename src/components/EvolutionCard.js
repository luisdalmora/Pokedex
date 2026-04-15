const EvolutionCard = (pokemonId, pokemonName, isRegional = false, regionalType = '') => {
  // Use a imagem default de arte oficial, ou home.
  const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`;
  const homeFallback = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${pokemonId}.png`;

  let regionalBadge = '';
  if (isRegional && regionalType) {
     regionalBadge = `<div style="position:absolute; top:-10px; right:-10px; background: var(--primary); color: white; border-radius: 12px; font-size: 0.6em; padding: 3px 6px; font-weight: bold; border: 2px solid white; text-transform: capitalize; z-index: 5;">${regionalType}</div>`;
  }

  return `
    <a href="#/pokemon/${pokemonId}" class="evo-card" style="position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center; background: var(--card-bg); border-radius: 50%; width: 110px; height: 110px; border: 4px solid var(--bg-color); box-shadow: var(--shadow); transition: all 0.3s ease; text-decoration: none; z-index: 2;">
        ${regionalBadge}
        <img src="${imageUrl}" alt="${pokemonName}" loading="lazy" style="width: 80%; height: 80%; object-fit: contain; filter: drop-shadow(0px 4px 5px rgba(0,0,0,0.2)); transition: transform 0.3s ease;" onerror="this.onerror=null;this.src='${homeFallback}';this.onerror=function(){this.src='./images/games/fallback.png';this.style.opacity=0.3;};" />
        <span class="evo-card-name" style="position: absolute; bottom: -25px; font-family: var(--font-main); font-weight: bold; font-size: 14px; text-transform: capitalize; color: var(--text-main); white-space: nowrap;">
            ${pokemonName.replace(/-/g, ' ')}
        </span>
    </a>
  `;
};

export default EvolutionCard;
