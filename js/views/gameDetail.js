import { fetchPokemonDetails, fetchRegionsList, fetchRegionGames } from '../api.js';

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
    <div style="display:flex; flex-direction:column; align-items:center; background: rgba(0,0,0,0.05); padding: 10px; border-radius: 8px;">
      <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${poke.id}.png" onerror="this.onerror = null; this.src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${poke.id}.png';" style="width: 60px; height: 60px; object-fit: contain; filter: drop-shadow(2px 2px 2px rgba(0,0,0,0.3));" />
      <h4 style="font-size: 0.8em; margin-top: 5px; text-transform: capitalize;">${poke.name}</h4>
      <span style="font-size: 0.7em; color: var(--text-muted);">Lv ${poke.level}</span>
    </div>
  `).join('');

  modalEl.innerHTML = `
    <div id="modal-overlay" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.7); z-index: 1000; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(5px);">
      <div id="modal-panel" style="background: var(--card-bg); border-radius: var(--radius); padding: 30px; max-width: 800px; width: 90%; max-height: 90vh; overflow-y: auto; position: relative;">
        <button id="modal-close" style="position: absolute; top: 15px; right: 15px; background: none; border: none; font-size: 24px; cursor: pointer; color: var(--text-main);">&times;</button>
        <div style="display: flex; gap: 30px; flex-wrap: wrap;">
          <div style="flex: 1; min-width: 200px; display: flex; flex-direction: column; align-items: center; text-align: center;">
            <img src="./images/gym-leaders/${selectedLeader.name.toLowerCase().replace(/[\s.]+/g, '-')}.png" onerror="this.onerror=null; this.src=''; this.style.display='none'" style="max-height: 150px;" />
            <h2 style="margin-top: 15px; color: var(--type-color-${selectedLeader.type}); font-size: 1.5em;">${selectedLeader.name}</h2>
            <p style="color: var(--text-muted);">${selectedLeader.gym}</p>
          </div>
          <div style="flex: 2; min-width: 300px;">
            <h3 style="margin-bottom: 20px; border-bottom: 2px solid var(--border-color); padding-bottom: 10px;">Equipe Pokémon</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); gap: 15px;">
              ${teamHtml}
            </div>
          </div>
        </div>
      </div>
    </div>
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
      <div class="animate-fade" style="padding: 20px 0;">
        <h3 style="margin-bottom: 10px; font-size: 1.3em;">Detalhes</h3>
        <p style="margin-bottom: 5px;"><strong>Ano de Lançamento:</strong> ${game.year}</p>
        <p style="margin-bottom: 20px;"><strong>Região:</strong> ${game.region}</p>
        
        <h3 style="margin-bottom: 10px; font-size: 1.3em;">Descrição</h3>
        <p style="line-height: 1.6; margin-bottom: 20px;">${game.description}</p>
        
        <h3 style="margin-bottom: 10px; font-size: 1.3em;">Features</h3>
        <ul style="list-style: none; padding: 0;">
          ${game.features ? game.features.map(f => `<li style="margin-bottom: 8px;">✓ ${f}</li>`).join('') : '<li>Nenhuma anotação.</li>'}
        </ul>
      </div>
    `;
  } else if (activeTab === 'exclusives') {
    let gridContent = '';
    if (loadingExclusives) {
      gridContent = '<div class="loading-state">Buscando lista de exclusivos...</div>';
    } else {
      if(exclusivesData.length === 0) {
        gridContent = '<p class="empty-state">Nenhum Pokémon exclusivo mapeado.</p>';
      } else {
        gridContent = `
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 15px;">
            ${exclusivesData.map(poke => `
              <a href="#/pokemon/${poke.id}" style="display: flex; flex-direction: column; align-items: center; justify-content: center; background: var(--card-bg); border-radius: var(--radius); padding: 15px; text-decoration: none; color: inherit; box-shadow: 0 2px 5px rgba(0,0,0,0.05); transition: transform 0.2s;">
                <img src="${poke.sprites?.other?.home?.front_default || poke.sprites?.front_default || ''}" style="max-height: 80px; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1));" />
                <span style="font-weight: 600; font-size: 0.9em; text-transform: capitalize; margin-top: 10px;">${poke.name}</span>
              </a>
            `).join('')}
          </div>
        `;
      }
    }
    contentArea.innerHTML = `
      <div class="animate-fade" style="padding: 20px 0;">
        <h3 style="margin-bottom: 20px;">${game.exclusivesTitle || 'Exclusivos'}</h3>
        ${gridContent}
      </div>
    `;
  } else if (activeTab === 'leaders') {
    if(!game.leaders || game.leaders.length === 0) {
       contentArea.innerHTML = '<div class="animate-fade" style="padding: 20px 0;"><p>Líderes não cadastrados para esta versão.</p></div>';
       return;
    }
    contentArea.innerHTML = `
      <div class="animate-fade" style="padding: 20px 0;">
        <h3 style="margin-bottom: 20px;">Líderes de Ginásio</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px;">
          ${game.leaders.map((leader, i) => `
            <div class="leader-card" data-idx="${i}" style="background: var(--card-bg); border-radius: var(--radius); padding: 20px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); text-align: center; cursor: pointer; transition: transform 0.2s; border: 2px solid transparent;">
              <img src="./images/gym-leaders/${leader.name.toLowerCase().replace(/[\s.]+/g, '-')}.png" onerror="this.onerror=null; this.src=''; this.style.display='none'" style="max-height: 100px; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.2));" />
              <h4 style="margin-top: 15px; font-size: 1.2em;">${leader.name}</h4>
              <p style="color: var(--text-muted); font-size: 0.9em; margin-bottom: 15px;">${leader.gym}</p>
              <span class="type-pill type-color-${leader.type}">${leader.type}</span>
              ${leader.badge ? `<p style="margin-top: 15px; font-weight: bold; font-size: 0.85em;">Insígnia: ${leader.badge}</p>` : ''}
            </div>
          `).join('')}
        </div>
      </div>
    `;

    contentArea.querySelectorAll('.leader-card').forEach(card => {
      card.addEventListener('mouseover', () => { card.style.transform = 'translateY(-5px)'; card.style.borderColor = game.color || 'var(--text-main)'; });
      card.addEventListener('mouseout', () => { card.style.transform = 'none'; card.style.borderColor = 'transparent'; });
      card.addEventListener('click', () => {
        const idx = card.getAttribute('data-idx');
        selectedLeader = game.leaders[idx];
        renderModal(container);
      });
    });
  }
};

export const renderGameDetail = async (container, slug) => {
  container.innerHTML = '<div class="loading-state">Buscando jogo...</div>';
  
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
    container.innerHTML = '<div class="empty-state">Jogo não encontrado.</div>';
    return;
  }

  let lighterColor = `${game.color}22`; // Append basic hex transparency for the background box if game uses HEX

  container.innerHTML = `
    <div class="animate-fade">
      <nav class="main-nav" style="margin-top: -40px; margin-bottom: 20px; margin-left: -20px; margin-right: -20px; border-radius: 0 0 10px 10px;">
        <div class="nav-inner">
          <a href="#/games" class="nav-btn" style="color: var(--text-main);">< Voltar</a>
        </div>
      </nav>
      
      <div style="background: var(--card-bg); border-radius: var(--radius); padding: 30px; box-shadow: 0 4px 20px rgba(0,0,0,0.05);">
        
        <div style="display: flex; gap: 30px; align-items: flex-end; padding-bottom: 30px; border-bottom: 2px solid var(--border-color); flex-wrap: wrap;">
          <div style="background: ${lighterColor || 'rgba(0,0,0,0.05)'}; padding: 15px; border-radius: var(--radius); border-bottom: 4px solid ${game.color || 'transparent'}; display: flex; justify-content: center; align-items: center; max-width: 250px; width: 100%;">
            <img src="./images/games/${game.slug}.png" alt="${game.name}" style="max-width: 100%; max-height: 250px; object-fit: contain; filter: drop-shadow(4px 4px 8px rgba(0,0,0,0.4));" onerror="this.style.opacity='0.1';" />
          </div>
          <div>
            <h1 style="font-size: 2.5em; font-weight: 800; color: ${game.color || 'inherit'};">${game.name}</h1>
            <p style="font-size: 1.2em; color: var(--text-muted); margin-top: 5px;">Plataforma: ${game.console || 'N/A'}</p>
          </div>
        </div>

        <div id="tabs-container" style="display: flex; gap: 20px; margin-top: 30px; border-bottom: 2px solid var(--border-color);">
          <button class="nav-btn tab-btn active" data-tab="overview" style="padding-bottom: 10px; font-size: 1em;">Overview</button>
          <button class="nav-btn tab-btn" data-tab="exclusives" style="padding-bottom: 10px; font-size: 1em;">Pokémon Exclusivos</button>
          <button class="nav-btn tab-btn" data-tab="leaders" style="padding-bottom: 10px; font-size: 1em;">Líderes de Ginásio</button>
        </div>

        <div id="tab-content-area" style="min-height: 300px;"></div>
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
