import { renderNav } from '../components/Nav.js';
import { translateType } from '../utils/translations.js';
import { 
    fetchLocalGymLeaders, 
    fetchLocalExclusives, 
    fetchPokedexDetails, 
    fetchPokemonDetails,
    getVersionSprite 
} from '../services/api.js';

export const renderGameDetail = async (container, gameSlug) => {
    container.innerHTML = '<div class="loading-state">Carregando detalhes do jogo...</div>';

    try {
        const response = await fetch('./src/data/games_registry.json');
        const data = await response.json();
        
        let foundGame = null;
        let foundRegion = null;
        let foundGen = null;

        for (const region of data.regions) {
            for (const gen of region.generations) {
                const game = gen.games.find(g => g.id === gameSlug);
                if (game) {
                    foundGame = game;
                    foundRegion = region;
                    foundGen = gen;
                    break;
                }
            }
            if (foundGame) break;
        }

        if (!foundGame) {
            container.innerHTML = '<div class="empty-state">Jogo não encontrado no registro.</div>';
            return;
        }

        const gymLeaders = await fetchLocalGymLeaders(foundRegion.id);
        const exclusivesData = await fetchLocalExclusives(foundRegion.id);

        container.innerHTML = `
            ${renderNav('/games')}
            <div class="animate-fade">
                <!-- Premium Header -->
                <div class="game-detail-hero" style="background: linear-gradient(to right, rgba(0,0,0,0.8), transparent), url('./assets/images/backgrounds/hero-bg.jpg'); background-size: cover; background-position: center;">
                    <div class="hero-inner">
                        <div class="detail-cover-wrapper-lg">
                            <img src="./assets/images/games/${foundGame.id}.png" 
                                 onerror="this.onerror=null; this.src='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png'; this.style.opacity='0.2';"
                                 class="detail-cover-img-lg" alt="${foundGame.name}">
                        </div>
                        <div class="hero-text-content">
                            <span class="version-tag">${foundGen.name}</span>
                            <h1 class="game-title-huge">${foundGame.name}</h1>
                            <div class="game-meta-pills">
                                <span class="meta-pill">📅 ${foundGame.year}</span>
                                <span class="meta-pill">💿 ${foundGame.platform}</span>
                                <span class="meta-pill">🗺️ ${foundRegion.name}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Desktop Sidebar Layout -->
                <div class="detail-layout-grid">
                    <main class="detail-main-content">
                        <nav class="detail-tabs">
                            <button class="tab-btn-modern active" data-tab="overview">Visão Geral</button>
                            <button class="tab-btn-modern" data-tab="pokedex">Pokédex</button>
                            <button class="tab-btn-modern" data-tab="exclusives">Exclusivos</button>
                            <button class="tab-btn-modern" data-tab="gyms">Líderes</button>
                            <button class="tab-btn-modern" data-tab="special">Especial</button>
                        </nav>

                        <div id="tab-content" class="tab-view-container animate-fade">
                            <!-- Dynamic Content -->
                        </div>
                    </main>

                    <aside class="detail-sidebar">
                        <div class="sidebar-card">
                            <h3>Informações da Região</h3>
                            <div class="region-preview-card" style="background-image: url('./assets/images/regions/${foundRegion.id}.png');">
                                 <div class="region-overlay">
                                     <h4>${foundRegion.name}</h4>
                                 </div>
                            </div>
                            <p class="region-desc-short">Explorar o mapa e segredos desta região clássica.</p>
                            <a href="#/games/library?region=${foundRegion.id}" class="btn-premium btn-secondary" style="width: 100%; justify-content: center; margin-top: 15px;">Ver Mapa Completo</a>
                        </div>
                    </aside>
                </div>
            </div>

            <style>
                .game-detail-hero { height: 350px; border-radius: 30px; margin-top: -30px; display: flex; align-items: center; padding: 0 50px; position: relative; overflow: hidden; }
                .hero-inner { display: flex; align-items: center; gap: 40px; z-index: 2; color: white; }
                .detail-cover-img-lg { width: 180px; height: 260px; object-fit: cover; border-radius: 15px; box-shadow: 0 15px 30px rgba(0,0,0,0.5); }
                .game-title-huge { font-size: 3.5rem; font-weight: 900; margin: 10px 0; }
                .version-tag { background: rgba(255,255,255,0.2); backdrop-filter: blur(10px); padding: 5px 15px; border-radius: 20px; font-weight: 800; text-transform: uppercase; font-size: 0.8rem; letter-spacing: 1px; }
                .game-meta-pills { display: flex; gap: 10px; margin-top: 15px; }
                .meta-pill { background: rgba(255,255,255,0.1); padding: 8px 15px; border-radius: 20px; font-weight: 600; font-size: 0.9rem; }
                
                .detail-layout-grid { display: grid; grid-template-columns: 1fr 300px; gap: 40px; margin-top: 40px; }
                .detail-tabs { display: flex; gap: 30px; border-bottom: 2px solid var(--border-color); margin-bottom: 30px; }
                .tab-btn-modern { background: none; border: none; padding: 15px 0; font-weight: 800; color: var(--text-muted); cursor: pointer; position: relative; font-size: 1.1rem; }
                .tab-btn-modern.active { color: #ef4444; }
                .tab-btn-modern.active::after { content: ""; position: absolute; bottom: -2px; left: 0; right: 0; height: 4px; background: #ef4444; border-radius: 2px; }
                
                .sidebar-card { background: var(--card-bg); padding: 25px; border-radius: 25px; box-shadow: var(--card-shadow); }
                .region-preview-card { height: 150px; border-radius: 15px; background-size: cover; background-position: center; position: relative; margin: 15px 0; overflow: hidden; }
                .region-overlay { position: absolute; bottom: 0; left: 0; right: 0; padding: 20px; background: linear-gradient(to top, rgba(0,0,0,0.8), transparent); color: white; }
            </style>
        `;

        const tabContentArea = document.getElementById('tab-content');
        const tabBtns = container.querySelectorAll('.tab-btn-modern');

        const renderTab = async (tabId) => {
            tabBtns.forEach(b => b.classList.toggle('active', b.dataset.tab === tabId));
            tabContentArea.innerHTML = '<div class="loading-state">Puxando dados técnicos...</div>';

            if (tabId === 'overview') {
                tabContentArea.innerHTML = `
                    <div class="animate-fade">
                        <h2 style="font-weight: 800; margin-bottom: 20px;">📘 Visão Geral</h2>
                        <p style="font-size: 1.2rem; line-height: 1.8; color: var(--text-main);">${foundGame.desc || 'Informação sobre o enredo em desenvolvimento.'}</p>
                    </div>
                `;
            } 
            else if (tabId === 'pokedex') {
                tabContentArea.innerHTML = '<div class="loading-state">Mapeando Pokédex Regional...</div>';
                // Fetch Pokedex from PokéAPI based on region
                const pokedexName = foundRegion.id === 'kanto' ? 'kanto' : foundRegion.id;
                const dex = await fetchPokedexDetails(pokedexName);
                if (!dex) {
                    tabContentArea.innerHTML = '<div class="empty-state">Pokédex não linkada na PokéAPI para esta região.</div>';
                    return;
                }
                
                tabContentArea.innerHTML = `
                    <div class="animate-fade">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px;">
                            <h2 style="font-weight: 800;">🧬 Pokédex de ${foundRegion.name}</h2>
                            <span style="font-weight: 700; opacity: 0.6;">${dex.pokemon_entries.length} espécies</span>
                        </div>
                        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 15px;">
                            ${dex.pokemon_entries.slice(0, 50).map(entry => `
                                <div class="mini-dex-card" style="background: var(--card-bg); padding: 15px; border-radius: 20px; text-align: center; border: 1px solid var(--border-color);">
                                    <div style="font-weight: 800; font-size: 0.8rem; margin-bottom: 10px;">#${String(entry.entry_number).padStart(3, '0')}</div>
                                    <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${entry.pokemon_species.url.split('/').filter(Boolean).pop()}.png" style="width: 80px; height: 80px;" alt="${entry.pokemon_species.name}">
                                    <div style="font-weight: 700; text-transform: capitalize; margin-top: 5px;">${entry.pokemon_species.name}</div>
                                </div>
                            `).join('')}
                        </div>
                        <p style="margin-top: 20px; text-align: center; color: var(--text-muted); font-size: 0.9rem;">Exibindo os primeiros 50 Pokémon da região.</p>
                    </div>
                `;
            }
            else if (tabId === 'exclusives') {
                if (!exclusivesData) {
                    tabContentArea.innerHTML = '<div class="empty-state">Dados de exclusivos ainda não mapeados para este épico.</div>';
                    return;
                }
                const versions = Object.keys(exclusivesData);
                tabContentArea.innerHTML = `
                    <div class="animate-fade">
                        <h2 style="font-weight: 800; margin-bottom: 25px;">⚔️ Exclusivos da Versão</h2>
                        <div class="exclusives-split" style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px;">
                            ${versions.map(v => `
                                <div class="version-column">
                                    <h3 style="text-transform: capitalize; margin-bottom: 20px; color: ${v === 'red' || v === 'gold' || v === 'ruby' ? '#ef4444' : '#3b82f6'}; font-weight: 900; font-size: 1.5rem;">${v}</h3>
                                    <div style="display: grid; gap: 10px;">
                                        ${exclusivesData[v].map(p => `
                                            <div style="background: var(--card-bg); padding: 10px 20px; border-radius: 12px; border-left: 5px solid ${v === 'red' || v === 'gold' || v === 'ruby' ? '#ef4444' : '#3b82f6'}; font-weight: 700; text-transform: capitalize;">
                                                ${p}
                                            </div>
                                        `).join('')}
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
            }
            else if (tabId === 'gyms') {
                tabContentArea.innerHTML = `
                    <div class="animate-fade">
                        <h2 style="font-weight: 800; margin-bottom: 25px;">🏆 Líderes de Ginásio & Elite Four</h2>
                        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 25px;">
                            ${gymLeaders.map(leader => `
                                <div class="leader-card-premium" style="background: var(--card-bg); border-radius: 25px; padding: 25px; box-shadow: var(--card-shadow); text-align: center; border: 1px solid var(--border-color); position: relative; overflow: hidden;">
                                    <div class="type-badge-mini ${leader.type.toLowerCase()}" style="position: absolute; top: 15px; right: 15px; width: 30px; height: 30px; border-radius: 50%; background: var(--type-color-${leader.type.toLowerCase()}); display: flex; justify-content: center; align-items: center; color: white; font-size: 0.8rem; font-weight: 900;">${leader.type[0]}</div>
                                    <div style="width: 100px; height: 100px; background: var(--bg-color); border-radius: 50%; display: flex; justify-content: center; align-items: center; margin: 0 auto 20px;">
                                        <img src="./assets/images/leaders/${leader.name.toLowerCase().replace(/[\\s.]+/g, '-')}.png" onerror="this.onerror=null; this.src='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png'; this.style.opacity='0.2';" style="max-height: 80px;">
                                    </div>
                                    <h4 style="font-size: 1.2rem; font-weight: 800;">${leader.name}</h4>
                                    <p style="color: var(--text-muted); font-size: 0.9rem; margin-top: 5px;">${leader.gym}</p>
                                    <div style="margin-top: 20px; display: flex; justify-content: center; gap: 8px;">
                                        ${leader.team ? leader.team.map(pk => `<div title="${pk.name} (Lv. ${pk.level})" style="width: 35px; height: 35px; background: var(--bg-color); border-radius: 8px; font-size: 0.6rem; display: flex; align-items: center; justify-content: center; font-weight: 800;">${pk.name[0]}</div>`).join('') : ''}
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
            }
            else if (tabId === 'special') {
                tabContentArea.innerHTML = `
                    <div class="animate-fade">
                        <h2 style="font-weight: 800; margin-bottom: 25px;">✨ Conteúdo Especial</h2>
                        <div style="background: var(--card-bg); padding: 40px; border-radius: 30px; text-align: center; border: 2px dashed var(--border-color);">
                            <span style="font-size: 3rem;">🌟</span>
                            <h3 style="margin-top: 20px;">Dados em processamento</h3>
                            <p style="color: var(--text-muted); margin-top: 10px;">Estamos extraindo informações de Mega Evoluções, Totens e formas regionais para esta versão.</p>
                        </div>
                    </div>
                `;
            }
        };

        tabBtns.forEach(btn => btn.addEventListener('click', () => renderTab(btn.dataset.tab)));
        renderTab('overview');

    } catch (err) {
        console.error(err);
        container.innerHTML = '<div class="empty-state">Erro ao carregar detalhes do jogo.</div>';
    }
};
