import { fetchPokemonDetails, fetchRegionsList, fetchRegionGames } from '../services/api.js';
import ImageWithFallback from '../components/ImageWithFallback.js';

let activeTab = 'overview';
let game = null;
let exclusivesData = [];
let loadingExclusives = true;
let selectedLeader = null;

const renderModal = (container) => {
  const modalEl = container.querySelector('#leader-modal-root');
  if (!selectedLeader) {
    modalEl.innerHTML = '';
    return;
  }

  const teamHtml = selectedLeader.team.map((poke, idx) => `
    <div class="pokemon-column">
      <div class="circle-avatar">
        <img 
          src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-i/red-blue/transparent/${poke.id}.png" 
          onerror="this.onerror = null; this.src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${poke.id}.png';"
          alt="${poke.name}" 
          class="sprite-pixelated"
        />
      </div>
      <h4 class="retro-font poke-name-title">${poke.name}</h4>
      <div class="poke-level-box">Level ${poke.level}</div>
      <div class="poke-types-row">
        ${poke.types.map(t => `<span class="type-pill-small retro-font" style="background-color: var(--type-${t})">${t.toUpperCase()}</span>`).join('')}
      </div>
      <div class="attacks-box retro-font">
        <strong>Attacks:</strong>
        ${poke.attacks.map(atk => `<div class="attack-name">${atk}</div>`).join('')}
      </div>
    </div>
  `).join('');

  modalEl.innerHTML = `
    <div class="leader-modal-overlay animate-fade" id="modal-overlay">
      <div class="leader-modal-panel" id="modal-panel">
        <button class="close-panel retro-font" id="modal-close">&times;</button>
        <div class="leader-panel-scroll">
          <div class="leader-panel-row">
            <div class="leader-column">
              <div class="circle-avatar">
                ${ImageWithFallback({
                  src: `./images/gym-leaders/${selectedLeader.name.toLowerCase().replace(/[\s.]+/g, '-')}.png`,
                  alt: selectedLeader.name,
                  fallbackText: "?"
                })}
              </div>
              <h4 class="retro-font team-name-title">Gym Leader<br/>${selectedLeader.name}</h4>
              <div class="leader-meta">
                <strong>Battle Type</strong>
                <p>Single Battle</p>
                <strong class="mt-2" style="display:block">Items</strong>
              </div>
            </div>
            ${teamHtml}
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
    btn.style.backgroundColor = '';
    btn.style.borderColor = '';
    if (btn.dataset.tab === activeTab) {
      btn.classList.add('active');
      btn.style.backgroundColor = game.color;
      btn.style.borderColor = game.color;
    }
  });

  const contentArea = container.querySelector('#tab-content-area');
  contentArea.innerHTML = '';

  if (activeTab === 'overview') {
    contentArea.innerHTML = `
      <div class="overview-tab animate-fade">
        <h3 class="retro-font">Detalhes</h3>
        <ul class="details-list">
          <li><strong>Ano de Lançamento:</strong> ${game.year}</li>
          <li><strong>Região:</strong> ${game.region}</li>
        </ul>
        <h3 class="retro-font mt-4">Descrição</h3>
        <p class="retro-text">${game.description}</p>
        <h3 class="retro-font mt-4">Features</h3>
        <ul class="features-list">
          ${game.features && game.features.map(f => `<li>✓ ${f}</li>`).join('')}
        </ul>
      </div>
    `;
  } else if (activeTab === 'exclusives') {
    let gridContent = '';
    if (loadingExclusives) {
      gridContent = Array.from({ length: 6 }).map(() => '<div class="skeleton card-skeleton"></div>').join('');
    } else {
      if(exclusivesData.length === 0) {
        gridContent = '<p style="grid-column: 1 / -1">Nenhum Pokémon exclusivo mapeado.</p>';
      } else {
        gridContent = exclusivesData.map(poke => {
          const pokeSprite = poke.sprites?.other?.home?.front_default 
            || poke.sprites?.other?.['official-artwork']?.front_default
            || poke.sprites?.front_default 
            || '';
          return `
            <a href="#/pokemon/${poke.id}" class="pokemon-card exclusive-card">
              <img src="${pokeSprite}" alt="${poke.name}" class="pokemon-sprite" />
              <h4 class="capitalize">${poke.name}</h4>
            </a>
          `;
        }).join('');
      }
    }
    contentArea.innerHTML = `
      <div class="exclusives-tab animate-fade">
        <h3 class="retro-font tooltip-title">${game.exclusivesTitle || 'Exclusivos'}</h3>
        <div class="pokemon-grid">${gridContent}</div>
      </div>
    `;
  } else if (activeTab === 'leaders') {
    if(!game.leaders || game.leaders.length === 0) {
       contentArea.innerHTML = '<div class="leaders-tab animate-fade"><p>Líderes não cadastrados para esta versão.</p></div>';
       return;
    }
    contentArea.innerHTML = `
      <div class="leaders-tab animate-fade">
        <h3 class="retro-font">Líderes de Ginásio (${game.region})</h3>
        <div class="leaders-grid">
          ${game.leaders.map((leader, i) => {
            const leaderSlug = leader.name.toLowerCase().replace(/[\s.]+/g, '-');
            const hasTeam = leader.team && leader.team.length > 0;
            return `
              <div class="leader-card ${hasTeam ? 'clickable-leader' : ''}" data-idx="${i}">
                ${ImageWithFallback({
                  src: `./images/gym-leaders/${leaderSlug}.png`,
                  alt: leader.name,
                  className: 'leader-img',
                  fallbackText: '?'
                })}
                <h4 class="retro-font mt-2">${leader.name}</h4>
                <p class="leader-gym">${leader.gym}</p>
                <span class="type-pill retro-font" style="background-color: var(--type-${leader.type})">${leader.type}</span>
                <div class="leader-badge-container mt-2">
                  <p><strong>Insígnia:</strong><br/>${leader.badge}</p>
                  ${game.slug === 'red' || game.slug === 'blue' || game.slug === 'green' || game.slug === 'yellow' ? `
                    <div style="margin-top: 10px;">
                      <img 
                        src="./images/badges/${leader.badge.toLowerCase().replace(' ', '-')}.png" 
                        onerror="this.onerror=null; this.src='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${leader.badge.toLowerCase().replace(' ', '-')}.png';"
                        alt="${leader.badge}" 
                        style="width: 32px; height: 32px; image-rendering: pixelated;"
                      />
                    </div>
                  ` : ''}
                </div>
                ${hasTeam ? '<p class="click-to-view text-xs mt-2" style="color: var(--text-muted)">Clique para ver equipe</p>' : ''}
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;

    contentArea.querySelectorAll('.leader-card.clickable-leader').forEach(card => {
      card.addEventListener('click', () => {
        const idx = card.getAttribute('data-idx');
        selectedLeader = game.leaders[idx];
        renderModal(container);
      });
    });
  }
};

const handleKeydown = (e) => {
  if (e.key === 'Escape' && selectedLeader) {
    selectedLeader = null;
    const modalEl = document.getElementById('leader-modal-root');
    if (modalEl) modalEl.innerHTML = '';
  }
};

const GameDetail = async (container, slug) => {
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
    container.innerHTML = '<main class="container retro-font">Jogo não encontrado.</main>';
    return;
  }

  container.innerHTML = `
    <main class="container game-detail-page animate-fade">
      <a href="#/games" class="back-link retro-font">< Voltar para Jogos</a>
      
      <div class="game-detail-header" style="border-color: ${game.color}">
        <div class="game-banner" style="background-color: ${game.color}"></div>
        ${ImageWithFallback({
          src: `./images/games/${game.slug}.png`,
          alt: `${game.name} Cover`,
          className: "game-detail-cover"
        })}
        <h1 class="retro-font" style="color: ${game.color}">${game.name}</h1>
      </div>

      <div class="tabs-container" id="tabs-container">
        <button class="retro-font tab-btn active" data-tab="overview">Overview</button>
        <button class="retro-font tab-btn" data-tab="exclusives">${game.slug === 'yellow' ? 'Em Amarelo' : 'Exclusivos'}</button>
        <button class="retro-font tab-btn" data-tab="leaders">Líderes</button>
      </div>

      <div class="tab-content" id="tab-content-area" style="border-color: ${game.color}">
      </div>
      
      <div id="leader-modal-root"></div>
    </main>
  `;

  window.removeEventListener('keydown', handleKeydown);
  window.addEventListener('keydown', handleKeydown);
  
  window.unmountCurrent = () => window.removeEventListener('keydown', handleKeydown);

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

export default GameDetail;
