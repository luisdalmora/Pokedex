import ImageWithFallback from './ImageWithFallback.js';

const getConsoleIcon = (consoleName) => {
  const icons = {
    'Game Boy': 'https://upload.wikimedia.org/wikipedia/commons/f/f4/Game_Boy_wordmark.svg',
    'Game Boy Color': 'https://upload.wikimedia.org/wikipedia/commons/c/c5/Game_Boy_Color_logo.svg',
    'Game Boy Advance': 'https://upload.wikimedia.org/wikipedia/commons/8/8c/Game_Boy_Advance_logo.svg',
    'Nintendo DS': 'https://upload.wikimedia.org/wikipedia/commons/a/af/Nintendo_DS_Logo.svg',
    'Nintendo 3DS': 'https://upload.wikimedia.org/wikipedia/commons/1/18/Nintendo_3DS_logo.svg',
    'Nintendo Switch': 'https://upload.wikimedia.org/wikipedia/commons/8/88/Nintendo_Switch_Logo.svg',
    'Switch 2': 'Switch 2'
  };

  const svgUrl = icons[consoleName];
  if (!svgUrl) return `<span style="font-weight: bold;">${consoleName}</span>`;
  if (svgUrl === 'Switch 2') return `<span style="font-style: italic; font-weight: bold; padding: 2px 5px; border: 1px solid currentColor; border-radius: 4px;">Switch 2</span>`;
  
  return `<img src="${svgUrl}" alt="${consoleName}" style="height: 18px; max-width: 100px; object-fit: contain; vertical-align: middle; margin-right: 8px; filter: drop-shadow(1px 1px 0px rgba(255,255,255,0.7));" />`;
};

const GameCard = (game, genName = '') => {
  return `
    <a href="#/games/${game.slug}" class="game-card hoverable-card">
      <div style="padding: 15px; border-bottom: 2px dashed rgba(0,0,0,0.1); display: flex; align-items: center; justify-content: center; background-color: var(--secondary-color);">
        <img src="${game.cover || `./images/games/${game.slug}.png`}" alt="${game.name} Box Art" class="game-cover" style="max-height: 200px; object-fit: contain; filter: drop-shadow(2px 4px 6px rgba(0,0,0,0.3));" />
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
