import { gamesData } from '../data/games.js';
import ImageWithFallback from '../components/ImageWithFallback.js';

const GamesSection = async (container) => {
  const cardsHtml = gamesData.map((game) => `
    <a href="#/games/${game.slug}" class="game-card hoverable-card">
      ${ImageWithFallback({
        src: `./images/games/${game.slug}.png`,
        alt: `${game.name} Box Art`,
        className: 'game-cover'
      })}
      <div class="game-info">
        <h3 class="retro-font" style="color: ${game.color}">${game.name}</h3>
        <p><strong>Geração:</strong> <span class="capitalize">generation-i</span></p>
        <p><strong>Região:</strong> <span class="capitalize">${game.region}</span></p>
        <p class="game-desc">${game.description}</p>
        <span class="retro-font view-more-btn">Ver Detalhes &rarr;</span>
      </div>
    </a>
  `).join('');

  container.innerHTML = `
    <main class="container games-page animate-fade">
      <h2 class="retro-font page-title">Jogos da 1ª Geração</h2>
      <div class="games-grid">
        ${cardsHtml}
      </div>
    </main>
  `;
};

export default GamesSection;
