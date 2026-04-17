import { renderNav } from '../components/Nav.js';

const platformIcons = {
    'Game Boy': 'game-boy.png',
    'GBC': 'game-boy-color.png',
    'Game Boy Color': 'game-boy-color.png',
    'GBA': 'game-boy-advance.png',
    'DS': 'nintendo-ds.png',
    '3DS': 'nintendo-3ds.png',
    'Switch': 'nintendo-switch.png'
};

export const renderGamesLibrary = async (container) => {
    const params = new URLSearchParams(window.location.hash.split('?')[1]);
    const regionSlug = params.get('region') || 'kanto';

    container.innerHTML = `
        ${renderNav('/games')}
        <div class="animate-fade">
            <div style="margin-bottom: 40px; display: flex; justify-content: space-between; align-items: flex-end;">
                <div>
                    <a href="#/games" class="nav-btn" style="color: var(--text-muted); font-weight: bold; text-decoration: none; display: block; margin-bottom: 15px;">&larr; Voltar para Regiões</a>
                    <h2 style="font-size: 3rem; font-weight: 900; margin: 0; letter-spacing: -1.5px;">Biblioteca de Jogos</h2>
                    <p style="color: var(--text-muted); font-size: 1.2rem; margin-top: 5px; font-weight: 500;">Explorando a história de <span style="color: var(--primary-color); text-transform: capitalize;">${regionSlug}</span></p>
                </div>
                <div id="filter-container" class="library-filter-container" style="display: flex; gap: 10px;"></div>
            </div>

            <div id="games-grid" class="animate-fade" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 30px; margin-top: 20px;">
                <div class="loading-state">Consultando banco de dados de jogos...</div>
            </div>
        </div>

        <style>
            .game-card-premium { background: var(--card-bg); border-radius: 35px; overflow: hidden; border: 1px solid var(--border-color); box-shadow: var(--card-shadow); transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); position: relative; display: flex; flex-direction: column; }
            .game-card-premium:hover { transform: translateY(-12px); box-shadow: 0 30px 60px rgba(0,0,0,0.12); border-color: var(--primary-color); }
            
            .game-card-img-wrapper { height: 260px; position: relative; overflow: hidden; background: #e2e8f0; display: flex; align-items: center; justify-content: center; padding: 10px; }
            .game-card-img { transition: transform 0.6s; object-fit: contain; width: auto; max-height: 100%; box-shadow: 0 10px 20px rgba(0,0,0,0.15); }
            .game-card-premium:hover .game-card-img { transform: scale(1.05); }
            
            .console-badge-float { position: absolute; top: 15px; right: 15px; background: rgba(0,0,0,0.7); backdrop-filter: blur(10px); padding: 8px 12px; border-radius: 12px; display: flex; align-items: center; gap: 8px; border: 1px solid rgba(255,255,255,0.1); z-index: 10; }
            .console-icon-tiny { height: 14px; filter: brightness(0) invert(1); }
            .console-name-tiny { color: white; font-size: 0.7rem; font-weight: 800; text-transform: uppercase; }

            .game-card-content { padding: 25px; flex: 1; display: flex; flex-direction: column; }
            .game-card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
            .game-card-title { font-size: 1.4rem; font-weight: 900; margin: 0; color: var(--text-main); }
            .game-card-year { font-size: 0.85rem; font-weight: 800; color: var(--text-muted); background: var(--bg-color); padding: 4px 12px; border-radius: 20px; }
            .game-card-desc { font-size: 0.95rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 25px; flex: 1; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
            
            .explore-link-premium { margin-top: auto; display: inline-flex; align-items: center; gap: 10px; font-weight: 900; color: var(--primary-color); text-decoration: none; font-size: 1rem; transition: gap 0.2s; }
            .explore-link-premium:hover { gap: 15px; }
            
            .filter-pill { background: var(--bg-color); border: 2px solid var(--border-color); padding: 10px 22px; border-radius: 30px; font-weight: 800; color: var(--text-muted); cursor: pointer; transition: 0.3s; }
            .filter-pill.active { background: var(--primary-color); color: white; border-color: var(--primary-color); box-shadow: 0 4px 15px var(--primary-color-rgba); }
        </style>
    `;

    const filterContainer = document.getElementById('filter-container');
    const gamesGrid = document.getElementById('games-grid');

    try {
        const response = await fetch('./src/data/games_registry.json');
        const data = await response.json();
        const region = data.regions.find(r => r.id === regionSlug);

        if (!region) {
            gamesGrid.innerHTML = '<div class="empty-state">Região não encontrada.</div>';
            return;
        }

        const renderGames = (genFilter = 'all') => {
            gamesGrid.innerHTML = '';
            let filteredGens = genFilter === 'all' 
                ? region.generations 
                : region.generations.filter(g => g.gen === parseInt(genFilter));

            filteredGens.forEach(gen => {
                gen.games.forEach(game => {
                    const consoleIcon = platformIcons[game.platform] || 'nintendo-switch.png';
                    const coverImg = `https://img.pokemondb.net/boxes/${game.id.replace('lets-go-pikachu', 'lets-go-pikachu-switch').replace('lets-go-eevee', 'lets-go-eevee-switch')}.jpg`;
                    
                    const card = document.createElement('div');
                    card.className = 'game-card-premium animate-fade';
                    card.innerHTML = `
                        <div class="game-card-img-wrapper">
                            <div class="console-badge-float">
                                <img src="assets/images/consoles/${consoleIcon}" class="console-icon-tiny" onerror="this.src='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png'; this.style.opacity='0.5';">
                                <span class="console-name-tiny">${game.platform}</span>
                            </div>
                            <img src="${coverImg}" 
                                 onerror="this.src='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png'; this.style.opacity='0.2'; this.style.width='40px';" 
                                 class="game-card-img" alt="${game.name}">
                        </div>
                        <div class="game-card-content">
                            <div class="game-card-header">
                                <h3 class="game-card-title">${game.name}</h3>
                                <span class="game-card-year">${game.year}</span>
                            </div>
                            <p class="game-card-desc">${game.desc || 'Explore os detalhes técnicos, líderes de ginásio e Pokémon exclusivos desta versão.'}</p>
                            <a href="#/games/${game.id}" class="explore-link-premium">
                                Explorar Jogo <span>&rarr;</span>
                            </a>
                        </div>
                    `;
                    gamesGrid.appendChild(card);
                });
            });
        };

        // Render Filters
        filterContainer.innerHTML = `
            <button class="filter-pill active" data-gen="all">Todos</button>
            ${region.generations.map(g => `
                <button class="filter-pill" data-gen="${g.gen}">${g.gen === 1 ? '1ª' : g.gen === 2 ? '2ª' : g.gen + 'ª'} Gen</button>
            `).join('')}
        `;

        filterContainer.querySelectorAll('.filter-pill').forEach(btn => {
            btn.addEventListener('click', () => {
                filterContainer.querySelector('.active').classList.remove('active');
                btn.classList.add('active');
                renderGames(btn.dataset.gen);
            });
        });

        renderGames();

    } catch (err) {
        console.error(err);
        gamesGrid.innerHTML = '<div class="empty-state">Erro ao carregar o catálogo de jogos.</div>';
    }
};
