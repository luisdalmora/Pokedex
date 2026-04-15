import { fetchPokemonDetails, fetchRegionsList, fetchRegionGames } from '../api.js';
import { translateType } from '../translations.js';

let activeTab = 'overview';
let game = null;
let exclusivesData = [];
let loadingExclusives = true;
let selectedLeader = null;

const renderModal = (container) => {
  const modalEl = document.getElementById('leader-modal-root');
  if(!modalEl) return;
  
  if (!selectedLeader) {
    modalEl.innerHTML = '';
    return;
  }

  const teamHtml = selectedLeader.team.map((poke) => `
    <div style="display:flex; flex-direction:column; align-items:center; background: var(--bg-color); padding: 15px; border-radius: 12px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
      <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${poke.id}.png" onerror="this.onerror = null; this.src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${poke.id}.png';" style="width: 70px; height: 70px; object-fit: contain; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.2));" />
      <h4 style="font-size: 0.9em; margin-top: 10px; text-transform: capitalize; font-weight: 700;">${poke.name}</h4>
      <span style="font-size: 0.8em; color: var(--text-muted); font-weight: 600; margin-top: 5px;">Lv ${poke.level}</span>
    </div>
  `).join('');

  modalEl.innerHTML = `
    <div id="modal-overlay" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.8); z-index: 1000; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(8px); animation: fadeIn 0.2s;">
      <div id="modal-panel" style="background: var(--card-bg); border-radius: 24px; padding: 40px; max-width: 800px; width: 90%; max-height: 90vh; overflow-y: auto; position: relative; box-shadow: 0 20px 40px rgba(0,0,0,0.3); transform: scale(0.95); animation: scaleUp 0.2s forwards;">
        <button id="modal-close" style="position: absolute; top: 20px; right: 20px; background: rgba(0,0,0,0.05); border: none; font-size: 20px; width: 40px; height: 40px; border-radius: 50%; cursor: pointer; color: var(--text-main); display: flex; align-items: center; justify-content: center; transition: background 0.2s;">&times;</button>
        
        <div style="display: flex; gap: 40px; flex-wrap: wrap;">
          <div style="flex: 1; min-width: 250px; display: flex; flex-direction: column; align-items: center; text-align: center; border-right: 2px solid var(--border-color); padding-right: 20px;">
            <div style="background: var(--bg-color); border-radius: 50%; width: 150px; height: 150px; display: flex; justify-content: center; align-items: center; margin-bottom: 20px; border: 4px solid var(--type-color-${selectedLeader.type.toLowerCase()});">
              <img src="./images/gym-leaders/${selectedLeader.name.toLowerCase().replace(/[\s.]+/g, '-')}.png" onerror="this.onerror=null; this.src='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png'; this.style.opacity='0.2';" style="max-height: 120px;" />
            </div>
            <h2 style="margin-top: 10px; color: var(--type-color-${selectedLeader.type.toLowerCase()}); font-size: 1.8em; font-weight: 800;">${selectedLeader.name}</h2>
            <p style="color: var(--text-muted); font-size: 1.1em; margin-bottom: 15px;">${selectedLeader.gym}</p>
            <span class="type-pill type-color-${selectedLeader.type.toLowerCase()}" style="font-size: 1em; padding: 8px 20px;">${translateType(selectedLeader.type)}</span>
          </div>
          
          <div style="flex: 2; min-width: 300px;">
            <h3 style="margin-bottom: 25px; border-bottom: 2px solid var(--border-color); padding-bottom: 15px; font-size: 1.4rem; display: flex; align-items: center; gap: 10px;"><span style="font-size: 1.5rem;">⚔️</span> Equipe Pokémon</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(110px, 1fr)); gap: 20px;">
              ${teamHtml}
            </div>
          </div>
        </div>
      </div>
    </div>
    <style>
      @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      @keyframes scaleUp { from { transform: scale(0.95); } to { transform: scale(1); } }
      #modal-close:hover { background: rgba(0,0,0,0.1) !important; }
    </style>
  `;

  modalEl.querySelector('#modal-overlay').addEventListener('click', () => { selectedLeader = null; renderModal(container); });
  modalEl.querySelector('#modal-panel').addEventListener('click', e => e.stopPropagation());
  modalEl.querySelector('#modal-close').addEventListener('click', () => { selectedLeader = null; renderModal(container); });
};

const renderTabs = (container) => {
  const tabsContainer = container.querySelector('#tabs-container');
  tabsContainer.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active');
    btn.style.borderColor = 'transparent';
    btn.style.color = 'var(--text-muted)';
    if (btn.dataset.tab === activeTab) {
      btn.classList.add('active');
      btn.style.borderColor = game.color || 'var(--text-main)';
      btn.style.color = game.color || 'var(--text-main)';
    }
  });

  const contentArea = container.querySelector('#tab-content-area');
  contentArea.innerHTML = '';

  if (activeTab === 'overview') {
    contentArea.innerHTML = `
      <div class="animate-fade" style="padding: 30px 0;">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 40px;">
          <div>
            <h3 style="margin-bottom: 15px; font-size: 1.4em; display: flex; align-items: center; gap: 10px;"><span>📖</span> Sinopse</h3>
            <p style="line-height: 1.8; margin-bottom: 20px; font-size: 1.1em; color: var(--text-main);">${game.description}</p>
          </div>
          <div style="background: var(--bg-color); padding: 30px; border-radius: 20px;">
            <h3 style="margin-bottom: 20px; font-size: 1.4em; border-bottom: 2px solid var(--border-color); padding-bottom: 10px;">Detalhes Técnicos</h3>
            <p style="margin-bottom: 15px; font-size: 1.1em;"><strong>Ano de Lançamento:</strong> <span style="float: right;">${game.year}</span></p>
            <p style="margin-bottom: 15px; font-size: 1.1em;"><strong>Região:</strong> <span style="float: right;">${game.region}</span></p>
            <h3 style="margin-top: 30px; margin-bottom: 15px; font-size: 1.2em;">Novidades (Features)</h3>
            <ul style="list-style: none; padding: 0;">
              ${game.features ? game.features.map(f => `<li style="margin-bottom: 10px; display: flex; align-items: center; gap: 10px;"><span style="color: #4ade80;">✓</span> ${f}</li>`).join('') : '<li>Nenhuma anotação disponível.</li>'}
            </ul>
          </div>
        </div>
      </div>
    `;
  } else if (activeTab === 'exclusives') {
    let gridContent = '';
    if (loadingExclusives) {
      gridContent = '<div class="loading-state">Capturando dados dos exclusivos...</div>';
    } else {
      if(exclusivesData.length === 0) {
        gridContent = '<p class="empty-state">Nenhum Pokémon exclusivo mapeado nesta versão.</p>';
      } else {
        gridContent = `
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 20px;">
            ${exclusivesData.map(poke => `
              <a href="#/pokemon/${poke.id}" style="display: flex; flex-direction: column; align-items: center; justify-content: center; background: var(--bg-color); border-radius: 16px; padding: 20px; text-decoration: none; color: inherit; box-shadow: 0 4px 6px rgba(0,0,0,0.05); transition: transform 0.2s, box-shadow 0.2s;" onmouseover="this.style.transform='translateY(-5px)'; this.style.boxShadow='0 10px 15px rgba(0,0,0,0.1)';" onmouseout="this.style.transform='none'; this.style.boxShadow='0 4px 6px rgba(0,0,0,0.05)';">
                <img src="${poke.sprites?.other?.home?.front_default || poke.sprites?.front_default || ''}" style="max-height: 90px; filter: drop-shadow(0 5px 10px rgba(0,0,0,0.2));" />
                <span style="font-weight: 700; font-size: 1em; text-transform: capitalize; margin-top: 15px;">${poke.name}</span>
              </a>
            `).join('')}
          </div>
        `;
      }
    }
    contentArea.innerHTML = `
      <div class="animate-fade" style="padding: 30px 0;">
        <h3 style="margin-bottom: 25px; font-size: 1.5rem; display: flex; align-items: center; gap: 10px;"><span style="font-size: 1.5rem;">✨</span> ${game.exclusivesTitle || 'Pokémon Exclusivos'}</h3>
        ${gridContent}
      </div>
    `;
  } else if (activeTab === 'leaders') {
    if(!game.leaders || game.leaders.length === 0) {
       contentArea.innerHTML = '<div class="animate-fade" style="padding: 30px 0;"><div class="empty-state">Líderes de ginásio não cadastrados para esta versão.</div></div>';
       return;
    }
    contentArea.innerHTML = `
      <div class="animate-fade" style="padding: 30px 0;">
        <h3 style="margin-bottom: 25px; font-size: 1.5rem; display: flex; align-items: center; gap: 10px;"><span style="font-size: 1.5rem;">🏅</span> Desafios de Ginásio</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 25px;">
          ${game.leaders.map((leader, i) => `
            <div class="leader-card" data-idx="${i}" style="background: var(--bg-color); border-radius: 20px; padding: 25px 20px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); text-align: center; cursor: pointer; transition: all 0.3s; border: 2px solid transparent; display: flex; flex-direction: column; align-items: center;">
              <div style="background: rgba(0,0,0,0.03); width: 100px; height: 100px; border-radius: 50%; display: flex; justify-content: center; align-items: center; margin-bottom: 15px;">
                <img src="./images/gym-leaders/${leader.name.toLowerCase().replace(/[\s.]+/g, '-')}.png" onerror="this.onerror=null; this.src='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png'; this.style.opacity='0.2';" style="max-height: 80px; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.2));" />
              </div>
              <h4 style="font-size: 1.3em; font-weight: 800; margin-bottom: 5px;">${leader.name}</h4>
              <p style="color: var(--text-muted); font-size: 0.9em; margin-bottom: 15px;">${leader.gym}</p>
              <div style="margin-bottom: ${leader.badge ? '15px' : '0'};">
                <span class="type-pill type-color-${leader.type.toLowerCase()}">${translateType(leader.type)}</span>
              </div>
              ${leader.badge ? `<p style="font-weight: 700; font-size: 0.9em; display:flex; align-items: center; gap: 5px;"><span style="color: var(--text-muted);">Insígnia:</span> ${leader.badge}</p>` : ''}
            </div>
          `).join('')}
        </div>
      </div>
    `;

    contentArea.querySelectorAll('.leader-card').forEach(card => {
      card.addEventListener('mouseover', () => { card.style.transform = 'translateY(-8px)'; card.style.borderColor = game.color || 'var(--text-main)'; card.style.boxShadow = '0 15px 30px rgba(0,0,0,0.1)'; });
      card.addEventListener('mouseout', () => { card.style.transform = 'none'; card.style.borderColor = 'transparent'; card.style.boxShadow = '0 4px 10px rgba(0,0,0,0.05)'; });
      card.addEventListener('click', () => {
        const idx = card.getAttribute('data-idx');
        selectedLeader = game.leaders[idx];
        renderModal(container);
      });
    });
  }
};

export const renderGameDetail = async (container, slug) => {
  container.innerHTML = '<div class="loading-state">Lendo cartucho...</div>';
  
  activeTab = 'overview';
  loadingExclusives = true;
  selectedLeader = null;
  game = null;
  
  try {
     const regionsSlug = await fetchRegionsList();
     for (const r of regionsSlug) {
        const gamesList = await fetchRegionGames(r);
        const found = gamesList.find(g => g.slug === slug);
        if (found) {
           game = found;
           break;
        }
     }
  } catch(e) {
     console.error('Erro buscando detalhe de jogo:', e);
  }

  if (!game) {
    container.innerHTML = '<div class="empty-state">Jogo não encontrado em nossos registros.</div>';
    return;
  }

  let lighterColor = `${game.color}15`; 

  container.innerHTML = `
    <div class="animate-fade">
      <nav class="main-nav" style="margin-top: -40px; margin-bottom: 30px; margin-left: -20px; margin-right: -20px; border-radius: 0 0 10px 10px;">
        <div class="nav-inner">
          <a href="#/games" class="nav-btn" style="color: var(--text-main); font-weight: bold;">&larr; Voltar para Jogos</a>
        </div>
      </nav>
      
      <div style="background: var(--card-bg); border-radius: var(--radius); padding: 40px; box-shadow: 0 10px 30px rgba(0,0,0,0.05);">
        
        <div style="display: flex; gap: 40px; align-items: center; padding-bottom: 40px; border-bottom: 2px solid var(--border-color); flex-wrap: wrap;">
          <div style="background: ${lighterColor || 'var(--bg-color)'}; padding: 30px; border-radius: 24px; border: 4px solid ${game.color || 'var(--border-color)'}; display: flex; justify-content: center; align-items: center; width: 220px; height: 220px; box-shadow: inset 0 0 20px rgba(0,0,0,0.05), 0 10px 20px rgba(0,0,0,0.1);">
            <img src="./images/games/${game.slug}.png" alt="${game.name}" style="max-width: 100%; max-height: 100%; object-fit: contain; filter: drop-shadow(0 15px 15px rgba(0,0,0,0.4));" onerror="this.onerror=null; this.src='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png'; this.style.opacity='0.2';" />
          </div>
          <div>
            <h1 style="font-size: 3em; font-weight: 800; color: ${game.color || 'var(--text-main)'}; margin-bottom: 10px;">${game.name}</h1>
            <p style="font-size: 1.3em; color: var(--text-muted); display: inline-block; background: var(--bg-color); padding: 5px 15px; border-radius: 20px; font-weight: 600;">Plataforma: ${game.console || 'Original Console'}</p>
          </div>
        </div>

        <div id="tabs-container" style="display: flex; gap: 30px; margin-top: 40px; border-bottom: 2px solid var(--border-color); overflow-x: auto; scrollbar-width: none;">
          <button class="nav-btn tab-btn active" data-tab="overview" style="padding-bottom: 15px; font-size: 1.1em; white-space: nowrap;">Visão Geral</button>
          <button class="nav-btn tab-btn" data-tab="exclusives" style="padding-bottom: 15px; font-size: 1.1em; white-space: nowrap;">Pokémon Exclusivos</button>
          <button class="nav-btn tab-btn" data-tab="leaders" style="padding-bottom: 15px; font-size: 1.1em; white-space: nowrap;">Líderes de Ginásio</button>
        </div>

        <div id="tab-content-area" style="min-height: 400px;"></div>
      </div>
      
      <div id="leader-modal-root"></div>
    </div>
  `;

  container.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      activeTab = e.target.dataset.tab;
      renderTabs(container);
    });
  });

  renderTabs(container);

  try {
    if(game.exclusives && game.exclusives.length > 0) {
      const promises = game.exclusives.map(poke => fetchPokemonDetails(poke));
      exclusivesData = await Promise.all(promises);
    } else {
      exclusivesData = [];
    }
  } catch (err) {
    console.error("Error fetching exclusives", err);
  } finally {
    loadingExclusives = false;
    if (activeTab === 'exclusives') renderTabs(container);
  }
};
