import { fetchGenerationsList, fetchGenerationGames } from './api.js';

let currentGenParam = 'gen1';
let cachedGens = [];
let genGamesMap = {};

export const initGamesView = async () => {
  const container = document.getElementById('view-games');
  if (!container) return;

  if (cachedGens.length === 0) {
    try {
      cachedGens = await fetchGenerationsList();
    } catch (e) {
      console.error("Erro ao carregar lista de gerações:", e);
      return;
    }
  }

  const filterOptionsHtml = cachedGens.map(gen => 
    `<option value="${gen.slug}" ${gen.slug === currentGenParam ? 'selected' : ''}>${gen.name}</option>`
  ).join('');

  container.innerHTML = `
    <div class="controls" style="margin-bottom: 20px;">
      <select id="gen-filter" class="type-select w-full">
        ${filterOptionsHtml}
      </select>
    </div>
    <h2 class="page-title" style="margin-bottom: 20px;">Jogos da Franquia</h2>
    <div id="games-list-content"></div>
  `;

  const genFilter = document.getElementById('gen-filter');
  genFilter.addEventListener('change', async (e) => {
    currentGenParam = e.target.value;
    await renderGamesList();
  });

  await renderGamesList();
};

const renderGamesList = async () => {
  const content = document.getElementById('games-list-content');
  if (!content) return;
  
  content.innerHTML = '<div class="loading-state">Carregando Jogos...</div>';

  try {
    if (!genGamesMap[currentGenParam]) {
       genGamesMap[currentGenParam] = await fetchGenerationGames(currentGenParam);
    }
    const games = genGamesMap[currentGenParam];
    const genInfo = cachedGens.find(g => g.slug === currentGenParam);

    if (games && games.length > 0) {
      content.innerHTML = `
        <div class="games-grid">
          ${games.map(game => `
            <div class="game-card hoverable-card" style="display: flex; flex-direction: column; background: var(--card-bg); border-radius: var(--radius); overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
              <div style="padding: 15px; display: flex; align-items: center; justify-content: center; background-color: rgba(255,255,255,0.05);">
                <img src="./images/games/${game.slug}.png" alt="${game.name}" style="max-height: 200px; object-fit: contain;" onerror="this.style.opacity='0.1';" />
              </div>
              <div style="padding: 20px;">
                <h3 style="color: ${game.color || 'inherit'}; font-size: 1.2rem; margin-bottom: 15px;">${game.name}</h3>
                <p style="margin-bottom: 10px;"><strong>Lançamento:</strong> ${game.year || 'N/A'}</p>
                <p style="color: var(--text-muted); font-size: 0.9rem; line-height: 1.5;">${game.description}</p>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    } else {
      content.innerHTML = '<p class="empty-state">Nenhum jogo cadastrado até o momento para esta geração.</p>';
    }

  } catch (error) {
    content.innerHTML = '<div class="empty-state">Erro ao buscar jogos.</div>';
  }
};
