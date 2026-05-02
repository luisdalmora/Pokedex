import { renderNav } from '../components/Nav.js';
import { translateType } from '../utils/translations.js';
import { 
    fetchLocalGymLeaders, 
    fetchLocalExclusives, 
    fetchPokedexDetails, 
    fetchPokemonDetails,
    getPokemonSpriteUrl,
    resolvePokemonId
} from '../services/api.js';

const platformIcons = {
    'Game Boy': 'game-boy.png',
    'GBC': 'game-boy-color.png',
    'Game Boy Color': 'game-boy-color.png',
    'GBA': 'game-boy-advance.png',
    'DS': 'nintendo-ds.png',
    '3DS': 'nintendo-3ds.png',
    'Switch': 'nintendo-switch.png'
};

const gameColors = {
    'red': '#ef4444', 'blue': '#3b82f6', 'yellow': '#eab308', 'green': '#22c55e',
    'gold': '#f59e0b', 'silver': '#94a3b8', 'crystal': '#06b6d4',
    'ruby': '#dc2626', 'sapphire': '#2563eb', 'emerald': '#10b981', 'firered': '#ef4444', 'leafgreen': '#22c55e',
    'diamond': '#0ea5e9', 'pearl': '#f472b6', 'platinum': '#64748b', 'heartgold': '#d97706', 'soulsilver': '#475569',
    'black': '#1f2937', 'white': '#d1d5db', 'black-2': '#111827', 'white-2': '#e5e7eb',
    'x': '#2563eb', 'y': '#dc2626', 'omega-ruby': '#b91c1c', 'alpha-sapphire': '#1d4ed8',
    'sun': '#f59e0b', 'moon': '#3b82f6', 'ultra-sun': '#ea580c', 'ultra-moon': '#1d4ed8',
    'sword': '#0ea5e9', 'shield': '#e11d48', 'scarlet': '#e11d48', 'violet': '#7c3aed'
};

export const renderGameDetail = async (container, gameSlug) => {
    container.innerHTML = '<div class="loading-state">Carregando guia do treinador...</div>';

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
            container.innerHTML = '<div class="empty-state">Jogo não encontrado.</div>';
            return;
        }

        const gymLeaders = await fetchLocalGymLeaders(foundRegion.id);
        const exclusivesData = await fetchLocalExclusives(foundRegion.id);
        const consoleIcon = platformIcons[foundGame.platform] || 'nintendo-switch.png';
        const gameColor = gameColors[foundGame.id] || '#ef4444';
        const gameCover = `https://img.pokemondb.net/boxes/${foundGame.id}.jpg`;

        container.innerHTML = `
            ${renderNav('/games')}
            <div class="animate-fade">
                <div class="game-detail-hero" style="background: linear-gradient(to right, ${gameColor}dd, #000000dd), url('./assets/images/backgrounds/hero-bg.png'); background-size: cover; background-position: center;">
                    <div class="hero-inner">
                        <div class="box-art-outer">
                            <img src="${gameCover}" onerror="this.src='./assets/images/games/fallback.png'; this.style.opacity='0.5';" class="detail-cover-img-premium">
                        </div>
                        <div class="hero-text-content">
                            <div class="gen-badge-hub" style="border-color: ${gameColor}55;">
                                <img src="./assets/images/consoles/${consoleIcon}" class="console-img-small">
                                <span>${foundGen.name} • ${foundGame.platform}</span>
                            </div>
                            <h1 class="game-title-main">${foundGame.name}</h1>
                            <div class="meta-row-premium">
                                <span class="badge-glass">📅 ${foundGame.year}</span>
                                <span class="badge-glass">📍 ${foundRegion.name}</span>
                                <span class="badge-glass">✨ ${foundGame.platform}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="detail-layout-grid-premium">
                    <main class="main-column">
                        <nav class="game-tabs-premium">
                            <button class="tab-link active" data-tab="overview">Visão Geral</button>
                            <button class="tab-link" data-tab="pokedex">Pokédex</button>
                            <button class="tab-link" data-tab="exclusives">Exclusivos</button>
                            <button class="tab-link" data-tab="gyms">Líderes</button>
                        </nav>

                        <div id="game-tab-content" class="tab-content-area-premium"></div>
                    </main>

                    <aside class="side-column">
                        <div class="info-card-premium">
                            <h3>Sobre ${foundRegion.name}</h3>
                            <div class="region-thumb" style="background-image: url('./assets/images/regions/${foundRegion.id}.png');">
                                <div class="thumb-overlay"><h4>${foundRegion.name}</h4></div>
                            </div>
                            <p>${foundRegion.name} é uma das regiões mais icônicas da franquia, repleta de mistérios e Pokémon poderosos.</p>
                            <a href="#/games/library?region=${foundRegion.id}" class="btn-premium btn-primary" style="width:100%; justify-content:center; margin-top:20px; background: ${gameColor};">Explorar Região</a>
                        </div>
                    </aside>
                </div>
            </div>

            <style>
                :root { --accent-game: ${gameColor}; }
                .game-detail-hero { height: 420px; border-radius: 40px; margin-top: -20px; display: flex; align-items: center; padding: 0 60px; color: white; position: relative; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.3); }
                .hero-inner { display: flex; align-items: center; gap: 50px; z-index: 5; }
                .box-art-outer { padding: 12px; background: rgba(255,255,255,0.08); backdrop-filter: blur(20px); border-radius: 25px; border: 1px solid rgba(255,255,255,0.15); box-shadow: 0 30px 60px rgba(0,0,0,0.6); }
                .detail-cover-img-premium { width: 190px; height: 270px; object-fit: cover; border-radius: 12px; }
                .game-title-main { font-size: 5rem; font-weight: 950; margin: 10px 0; text-shadow: 0 5px 20px rgba(0,0,0,0.5); letter-spacing: -2px; }
                .gen-badge-hub { display: inline-flex; align-items: center; gap: 12px; background: rgba(255,255,255,0.9); padding: 8px 20px; border-radius: 40px; font-weight: 800; font-size: 0.85rem; text-transform: uppercase; border: 1px solid rgba(0,0,0,0.1); color: #334155; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
                .console-img-small { height: 20px; filter: none; }
                .meta-row-premium { display: flex; gap: 15px; margin-top: 25px; }
                .badge-glass { background: rgba(255,255,255,0.1); backdrop-filter: blur(15px); padding: 12px 25px; border-radius: 30px; font-weight: 600; font-size: 1rem; border: 1px solid rgba(255,255,255,0.1); }

                .detail-layout-grid-premium { display: grid; grid-template-columns: 1fr 340px; gap: 50px; margin-top: 50px; padding-bottom: 80px; }
                .game-tabs-premium { display: flex; gap: 40px; border-bottom: 2px solid var(--border-color); margin-bottom: 45px; }
                .tab-link { background: none; border: none; padding: 22px 0; font-weight: 800; color: var(--text-muted); cursor: pointer; position: relative; font-size: 1.25rem; transition: 0.3s; }
                .tab-link.active { color: var(--accent-game); }
                .tab-link.active::after { content: ""; position: absolute; bottom: -2px; left: 0; right: 0; height: 6px; background: var(--accent-game); border-radius: 6px; }

                .info-card-premium { background: var(--card-bg); padding: 35px; border-radius: 40px; box-shadow: var(--card-shadow); border: 1px solid var(--border-color); }
                .region-thumb { height: 200px; border-radius: 25px; background-size: cover; background-position: center; position: relative; margin: 25px 0; overflow: hidden; border: 1px solid var(--border-color); }
                .thumb-overlay { position: absolute; bottom: 0; left: 0; right: 0; padding: 25px; background: linear-gradient(to top, rgba(0,0,0,0.9), transparent); color: white; }

                .exclusives-grid-5 { display: grid; grid-template-columns: repeat(5, 1fr); gap: 15px; }
                .pk-card-mini { background: var(--card-bg); border-radius: 22px; padding: 18px; text-align: center; border: 1px solid var(--border-color); transition: 0.3s; box-shadow: 0 4px 10px rgba(0,0,0,0.02); }
                .pk-card-mini:hover { transform: translateY(-8px); border-color: var(--accent-game); box-shadow: 0 15px 30px rgba(0,0,0,0.08); }
                .pk-sprite-universal { width: 90px; height: 90px; object-fit: contain; margin: 0 auto; }
                .pixelated { image-rendering: pixelated; }
                .pk-name-mini { font-size: 0.9rem; font-weight: 800; margin-top: 12px; text-transform: capitalize; color: var(--text-main); }

                .leader-row-premium { background: var(--card-bg); border-radius: 40px; border: 1px solid var(--border-color); margin-bottom: 40px; overflow: hidden; box-shadow: var(--card-shadow); display: grid; grid-template-columns: 260px 1fr; }
                .leader-id-card { padding: 45px 25px; background: var(--bg-color); border-right: 1px solid var(--border-color); text-align: center; }
                .leader-portrait-frame { width: 150px; height: 150px; border-radius: 50%; background: var(--card-bg); margin: 0 auto 25px; display: flex; align-items: center; justify-content: center; border: 6px solid var(--border-color); overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.1); }
                .leader-team-grid-pills { padding: 35px; display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 20px; align-content: center; }
                .team-member-pill { background: var(--card-bg); padding: 15px; border-radius: 20px; text-align: center; border: 1px solid var(--border-color); transition: 0.3s; }
                .team-member-pill:hover { border-color: var(--accent-game); background: var(--bg-color); }
                
                .type-dot-row { display: flex; gap: 5px; justify-content: center; margin-top: 10px; }
                .type-dot-sm { width: 10px; height: 10px; border-radius: 50%; border: 1px solid rgba(0,0,0,0.1); }
            </style>
        `;

        const tabArea = document.getElementById('game-tab-content');
        const tabLinks = container.querySelectorAll('.tab-link');

        const renderTab = async (tabId) => {
            tabLinks.forEach(l => l.classList.toggle('active', l.dataset.tab === tabId));
            tabArea.innerHTML = '<div class="loading-state">Puxando guia completo...</div>';

            if (tabId === 'overview') {
                const devs = foundGen.gen < 6 ? 'GAME FREAK / Nintendo' : 'The Pokémon Company';
                tabArea.innerHTML = `
                    <div class="animate-fade">
                        <h2 style="font-weight: 900; margin-bottom: 30px;">📘 Visão Geral do Jogo</h2>
                        <div style="background: var(--card-bg); padding: 50px; border-radius: 40px; border: 1px solid var(--border-color); line-height: 1.8; box-shadow: var(--card-shadow);">
                            <p style="font-size: 1.4rem; color: var(--text-main); font-weight: 500; margin-bottom: 40px;">
                                ${foundGame.desc || 'Uma jornada épica aguarda por você. Explore cada canto de ' + foundRegion.name + ', capture Pokémon raros e torne-se o campeão supremo nesta versão lendária.'}
                            </p>
                            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px;">
                                <div style="background: var(--bg-color); padding: 30px; border-radius: 25px; text-align: center; border: 1px solid var(--border-color);">
                                    <div style="color: var(--text-muted); font-size: 0.8rem; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;">Geração</div>
                                    <div style="font-weight: 950; font-size: 1.25rem; margin-top: 8px;">Geração ${foundGen.gen}</div>
                                </div>
                                <div style="background: var(--bg-color); padding: 30px; border-radius: 25px; text-align: center; border: 1px solid var(--border-color);">
                                    <div style="color: var(--text-muted); font-size: 0.8rem; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;">Status</div>
                                    <div style="font-weight: 950; font-size: 1.25rem; margin-top: 8px;">Completo</div>
                                </div>
                                <div style="background: var(--bg-color); padding: 30px; border-radius: 25px; text-align: center; border: 1px solid var(--border-color);">
                                    <div style="color: var(--text-muted); font-size: 0.8rem; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;">Plataforma</div>
                                    <div style="font-weight: 950; font-size: 1.25rem; margin-top: 8px;">${foundGame.platform}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }
            else if (tabId === 'pokedex') {
                const dex = await fetchPokedexDetails(foundRegion.id === 'kanto' ? 'kanto' : foundRegion.id);
                tabArea.innerHTML = `
                    <div class="animate-fade">
                        <div style="display:flex; justify-content:space-between; align-items:baseline; margin-bottom:30px;">
                            <h2 style="font-weight: 950; font-size: 2.2rem;">🧬 Pokédex de ${foundRegion.name}</h2>
                            <span style="font-weight: 800; opacity: 0.4;">${dex ? dex.pokemon_entries.length : 0} Pokémon</span>
                        </div>
                        <div class="exclusives-grid-5">
                            ${dex ? dex.pokemon_entries.map(e => {
                                const id = e.pokemon_species.url.split('/').filter(Boolean).pop();
                                const sprite = getPokemonSpriteUrl(id, foundGame.id);
                                return `
                                    <div class="pk-card-mini">
                                        <div style="font-size: 0.8rem; font-weight: 900; opacity: 0.3; margin-bottom: 5px;">#${String(id).padStart(3, '0')}</div>
                                        <img src="${sprite}" class="pk-sprite-universal ${foundGen.gen < 6 ? 'pixelated' : ''}">
                                        <div class="pk-name-mini">${e.pokemon_species.name}</div>
                                    </div>
                                `;
                            }).join('') : '<div class="empty-state">Dados da Pokédex indisponíveis.</div>'}
                        </div>
                    </div>
                `;
            }
            else if (tabId === 'exclusives') {
                if (!exclusivesData) { tabArea.innerHTML = '<div class="empty-state">Sem dados de exclusivos mapeados.</div>'; return; }
                const versions = Object.keys(exclusivesData).filter(v => v !== 'unobtainable_in_platinum');
                
                let html = '<div class="animate-fade">';
                for (const v of versions) {
                    const isCurrent = gameSlug.includes(v.toLowerCase()) || v.toLowerCase().includes(gameSlug);
                    html += `
                        <div style="margin-bottom: 60px; opacity: ${isCurrent ? '1' : '0.7'};">
                            <h3 style="text-transform: uppercase; font-weight: 950; margin-bottom: 25px; border-left: 10px solid ${isCurrent ? gameColor : 'var(--border-color)'}; padding-left: 20px; font-size: 1.8rem;">Pokémon Exclusivos: ${v}</h3>
                            <div class="exclusives-grid-5">
                    `;
                    for (const name of exclusivesData[v]) {
                        const info = await resolvePokemonId(name);
                        const sprite = info ? getPokemonSpriteUrl(info.id, foundGame.id) : 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png';
                        html += `
                            <div class="pk-card-mini" style="border-bottom: 4px solid ${isCurrent ? gameColor : 'transparent'};">
                                <img src="${sprite}" class="pk-sprite-universal ${foundGen.gen < 6 ? 'pixelated' : ''}">
                                <div class="pk-name-mini">${name}</div>
                            </div>
                        `;
                    }
                    html += `</div></div>`;
                }
                html += '</div>';
                tabArea.innerHTML = html;
            }
            else if (tabId === 'gyms') {
                const gymLeadersGroup = gymLeaders.filter(l => l.gym !== 'Elite Four' && l.gym !== 'Champion');
                const eliteFourGroup = gymLeaders.filter(l => l.gym === 'Elite Four' || l.gym === 'Champion');
                
                tabArea.innerHTML = `
                    <div class="animate-fade">
                        <h2 style="font-weight: 950; font-size: 2.2rem; margin-bottom: 40px;">🏆 Líderes de Ginásio</h2>
                        ${await Promise.all(gymLeadersGroup.map(l => renderLeaderRow(l, foundGame.id))).then(res => res.join(''))}

                        <h2 style="font-weight: 950; font-size: 2.2rem; margin: 60px 0 40px;">🌟 Elite Four & Campeão</h2>
                        ${await Promise.all(eliteFourGroup.map(l => renderLeaderRow(l, foundGame.id))).then(res => res.join(''))}
                    </div>
                `;
            }
        };

        const renderLeaderRow = async (leader, gameVersion) => {
            const leaderSlug = leader.name.toLowerCase().replace(/[\s.]+/g, '').replace('(elite)', '');
            const portrait = `https://play.pokemonshowdown.com/sprites/trainers/${leaderSlug}.png`;
            
            const teamHtml = await Promise.all(leader.team.map(async pk => {
                const info = await resolvePokemonId(pk.name);
                const sprite = info ? getPokemonSpriteUrl(info.id, gameVersion) : 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png';
                return `
                    <div class="team-member-pill">
                        <img src="${sprite}" class="pk-sprite-universal ${foundGen.gen < 6 ? 'pixelated' : ''}" style="width: 70px; height: 70px;">
                        <div style="font-weight: 800; font-size: 0.85rem; margin-top: 8px; text-transform: capitalize;">${pk.name}</div>
                        <div style="font-size: 0.8rem; font-weight: 700; opacity: 0.5;">Lv. ${pk.level}</div>
                        <div class="type-dot-row">
                            ${info ? info.types.map(t => `<div class="type-dot-sm" style="background: var(--type-color-${t});" title="${translateType(t)}"></div>`).join('') : ''}
                        </div>
                    </div>
                `;
            })).then(res => res.join(''));

            return `
                <div class="leader-row-premium" style="border-left: 12px solid var(--type-color-${leader.type.toLowerCase()});">
                    <div class="leader-id-card">
                        <div class="leader-portrait-frame">
                            <img src="${portrait}" onerror="this.src='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png'; this.style.opacity='0.2';">
                        </div>
                        <div style="font-weight: 950; font-size: 1.6rem; letter-spacing: -1px;">${leader.name}</div>
                        <div style="font-size: 0.8rem; font-weight: 800; color: var(--text-muted); text-transform: uppercase;">${leader.gym}</div>
                        <div style="margin-top: 15px; background: var(--type-color-${leader.type.toLowerCase()}); color: white; padding: 6px 18px; border-radius: 20px; display: inline-block; font-size: 0.8rem; font-weight: 900; text-transform: uppercase;">
                            ${translateType(leader.type)}
                        </div>
                    </div>
                    <div class="leader-team-grid-pills">
                        ${teamHtml}
                    </div>
                </div>
            `;
        };

        container.querySelectorAll('.tab-link').forEach(btn => btn.addEventListener('click', () => renderTab(btn.dataset.tab)));
        renderTab('overview');

    } catch (err) {
        console.error(err);
        container.innerHTML = '<div class="error-state">Falha crítica ao carregar a Pokédex de Jogos.</div>';
    }
};
