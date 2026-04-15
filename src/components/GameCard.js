import ImageWithFallback from './ImageWithFallback.js';

const getConsoleIcon = (consoleName) => {
  const consoleSlug = consoleName.toLowerCase().replace(/[\s.]+/g, '-');
  
  return `<img src="./images/consoles/${consoleSlug}.png" alt="${consoleName}" style="height: 18px; max-width: 100px; object-fit: contain; vertical-align: middle; margin-right: 8px; filter: drop-shadow(1px 1px 0px rgba(255,255,255,0.7));" onerror="this.style.display='none'; this.insertAdjacentHTML('afterend', '<span style=&quot;font-weight: bold; margin-right: 8px;&quot;>${consoleName}</span>');" />`;
};

const GameCard = (game, genName = '') => {
  return `
    <a href="#/games/${game.slug}" class="game-card hoverable-card">
      <div style="padding: 15px; border-bottom: 2px dashed rgba(0,0,0,0.1); display: flex; align-items: center; justify-content: center; background-color: var(--secondary-color);">
        <img src="./images/games/${game.slug}.png" alt="${game.name} Box Art" class="game-cover" onerror="this.src='./images/games/fallback.png'; this.style.opacity='0.1';" style="max-height: 200px; object-fit: contain; filter: drop-shadow(2px 4px 6px rgba(0,0,0,0.3));" />
      </div>
      <div class="game-info">
        <h3 class="retro-font" style="color: ${game.color}; font-size: 1.1em;">${game.name}</h3>
        <div style="margin-top: 10px; margin-bottom: 10px; display: flex; align-items: center;">
          ${getConsoleIcon(game.console)}
        </div>
        <p><strong>Lançamento:</strong> <span>${game.year || 'N/A'}</span></p>
        <p class="game-desc">${game.description}</p>
        <span class="retro-font view-more-btn">Ver Detalhes &rarr;</span>
      </div>
    </a>
  `;
};

export default GameCard;
