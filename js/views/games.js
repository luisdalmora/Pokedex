import { fetchGenerationsList, fetchGenerationGames } from '../api.js';

let currentGenParam = 'gen1';
let cachedGens = [];
let genGamesMap = {};

export const initGamesView = async (container) => {
  if (cachedGens.length === 0) {
    try {
      cachedGens = await fetchGenerationsList();
    } catch (e) {
      console.error("Erro ao carregar lista de gerações:", e);
      return;
    }
  }

  // Make gen pills instead of dropdown
  const genPillsHtml = cachedGens.map(gen => `
    <button class="gen-pill ${gen.slug === currentGenParam ? 'active' : ''}" data-gen="${gen.slug}" style="
      padding: 10px 20px; 
      border-radius: 30px; 
      border: 2px solid ${gen.slug === currentGenParam ? '#ef4444' : 'var(--border-color)'}; 
      background: ${gen.slug === currentGenParam ? '#ef4444' : 'var(--card-bg)'}; 
      color: ${gen.slug === currentGenParam ? 'white' : 'var(--text-main)'};
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
      white-space: nowrap;
    ">${gen.name}</button>
  `).join('');

  container.innerHTML = `
    <nav class="main-nav" style="margin-top: -40px; margin-bottom: 40px; margin-left: -20px; margin-right: -20px; border-radius: 0 0 10px 10px;">
      <div class="nav-inner">
        <a href="#/" class="nav-btn">Pokédex</a>
        <a href="#/games" class="nav-btn active">Jogos & Regiões</a>
        <a href="#/quiz" class="nav-btn">Quiz</a>
      </div>
    </nav>
    <div style="margin-bottom: 40px;">
      <h2 style="font-size: 2rem; font-weight: 800; margin-bottom: 20px;">🎮 Biblioteca de Jogos</h2>
      <div class="controls" style="display: flex; gap: 15px; overflow-x: auto; padding-bottom: 15px; scrollbar-width: thin;">
        ${genPillsHtml}
      </div>
    </div>
    
    <div id="games-list-content"></div>
  `;

  // Setup Pill Events
  container.querySelectorAll('.gen-pill').forEach(pill => {
    pill.addEventListener('click', async (e) => {
      // update UI
      container.querySelectorAll('.gen-pill').forEach(p => {
        p.classList.remove('active');
        p.style.background = 'var(--card-bg)';
        p.style.color = 'var(--text-main)';
        p.style.borderColor = 'var(--border-color)';
      });
      const target = e.target;
      target.classList.add('active');
      target.style.background = '#ef4444';
      target.style.color = 'white';
      target.style.borderColor = '#ef4444';
      
      currentGenParam = target.dataset.gen;
      await renderGamesList();
    });
  });

  await renderGamesList();
};

const renderGamesList = async () => {
  const content = document.getElementById('games-list-content');
  if (!content) return;
  
  content.innerHTML = '<div class="loading-state">Carregando catálogo...</div>';

  try {
    if (!genGamesMap[currentGenParam]) {
       genGamesMap[currentGenParam] = await fetchGenerationGames(currentGenParam);
    }
    const games = genGamesMap[currentGenParam];

    if (games && games.length > 0) {
      content.innerHTML = `
        <div class="animate-fade games-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px;">
          ${games.map(game => `
            <a href="#/games/${game.slug}" style="
              display: flex; 
              flex-direction: column; 
              background: var(--card-bg); 
              border-radius: 20px; 
              overflow: hidden; 
              box-shadow: 0 10px 20px rgba(0,0,0,0.05); 
              text-decoration: none; 
              color: inherit; 
              transition: transform 0.3s, box-shadow 0.3s;
              border: 1px solid var(--border-color);
              position: relative;
            " onmouseover="this.style.transform='translateY(-8px)'; this.style.boxShadow='0 20px 30px rgba(0,0,0,0.1)';" onmouseout="this.style.transform='none'; this.style.boxShadow='0 10px 20px rgba(0,0,0,0.05)';">
              
              <div style="padding: 30px 20px; display: flex; align-items: center; justify-content: center; background: linear-gradient(to bottom, ${game.color}22, rgba(255,255,255,0)); border-bottom: 3px solid ${game.color || 'var(--border-color)'};">
                <img src="./images/games/${game.slug}.png" alt="${game.name}" style="max-height: 180px; object-fit: contain; filter: drop-shadow(0 10px 15px rgba(0,0,0,0.3));" onerror="this.onerror=null; this.src='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png'; this.style.opacity='0.2';" />
              </div>
              
              <div style="padding: 25px;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
                  <h3 style="color: ${game.color || 'inherit'}; font-size: 1.4rem; font-weight: 800;">${game.name}</h3>
                  <span style="font-size: 0.8rem; background: var(--bg-color); padding: 5px 10px; border-radius: 12px; font-weight: 700; color: var(--text-muted);">${game.year || 'N/A'}</span>
                </div>
                
                <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.6; margin-bottom: 20px; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">
                  ${game.description}
                </p>
                
                <div style="display: flex; align-items: center; gap: 8px; font-weight: 700; color: ${game.color || 'var(--text-main)'}; font-size: 0.95rem;">
                  <span>Explorar Jogo</span>
                  <span>&rarr;</span>
                </div>
              </div>
            </a>
          `).join('')}
        </div>
      `;
    } else {
      content.innerHTML = `
        <div class="empty-state" style="padding: 50px 0; font-size: 1.2rem;">
          <span style="font-size: 3rem; display: block; margin-bottom: 20px;">🏗️</span>
          Em construção.<br>Nenhum jogo mapeado para esta geração no momento.
        </div>
      `;
    }

  } catch (error) {
    content.innerHTML = '<div class="empty-state">Erro ao buscar banco de dados de jogos.</div>';
  }
};
