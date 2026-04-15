import GameCard from '../components/GameCard.js';
import RegionFilter from '../components/RegionFilter.js';
import { fetchGenerationsList, fetchGenerationGames } from '../services/api.js';

let currentGenParam = 'gen1';
let cachedGens = [];
let genDataMap = {};
let genGamesMap = {};

const renderGames = async (container) => {
  const content = container.querySelector('#games-content');
  const loading = container.querySelector('#games-loading');
  
  if(loading) loading.style.display = 'block';
  if(content) content.style.display = 'none';

  try {
    if (!genGamesMap[currentGenParam]) {
       genGamesMap[currentGenParam] = await fetchGenerationGames(currentGenParam);
    }
    const games = genGamesMap[currentGenParam];
    const genInfo = genDataMap[currentGenParam];

    let htmlStr = '';

    if (games && games.length > 0) {
      htmlStr = `
        <div class="region-games-section">
          <h3 class="retro-font" style="border-bottom: 2px solid var(--border-color); padding-bottom: 10px; margin-bottom: 20px;">
            ${genInfo.name}
          </h3>
          <div class="games-grid">
            ${games.map(game => GameCard(game, genInfo.name)).join('')}
          </div>
        </div>
      `;
    } else {
      htmlStr = '<p class="empty-state">Nenhum jogo cadastrado até o momento para esta geração.</p>';
    }

    if(content) content.innerHTML = htmlStr;

  } catch (error) {
    console.error("Error loading games:", error);
    if(content) content.innerHTML = '<div class="empty-state">Erro ao buscar jogos.</div>';
  }

  if(loading) loading.style.display = 'none';
  if(content) content.style.display = 'flex';
};

const attachEvents = (container) => {
  const regionSelect = container.querySelector('#region-filter');
  if (regionSelect) {
    regionSelect.addEventListener('change', async (e) => {
      currentGenParam = e.target.value;
      await renderGames(container);
    });
  }
};

const GamesSection = async (container) => {
  if (cachedGens.length === 0) {
    try {
      const genList = await fetchGenerationsList();
      cachedGens = genList;
       
      cachedGens.forEach(cg => {
         genDataMap[cg.slug] = cg;
      });
    } catch (e) {
      console.error("Erro ao carregar lista de gerações:", e);
    }
  }

  // Reuse the region filter component but adapt the values for generations
  const filterOptionsHtml = cachedGens.map(gen => 
    `<option value="${gen.slug}" ${gen.slug === currentGenParam ? 'selected' : ''}>${gen.name}</option>`
  ).join('');

  const GenFilterHtml = `
  <div class="region-filter-container animate-fade fade-in">
    <label for="region-filter" class="retro-font">Geração:</label>
    <div class="select-wrapper">
      <select id="region-filter" class="region-select retro-font">
        ${filterOptionsHtml}
      </select>
    </div>
  </div>`;

  container.innerHTML = `
    <main class="container games-page animate-fade">
      <div class="controls-section">
        ${GenFilterHtml}
      </div>
      <h2 class="retro-font page-title" id="games-title">Jogos da Franquia</h2>
      <div class="loading-state" id="games-loading" style="display: none;">Carregando Jogos...</div>
      <div id="games-content" style="display: flex; flex-direction: column; gap: 2rem;">
      </div>
    </main>
  `;

  attachEvents(container);
  await renderGames(container);
};

export default GamesSection;
