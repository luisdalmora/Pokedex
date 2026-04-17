import { renderNav } from '../components/Nav.js';

export const renderGamesLibrary = async (container) => {
    const params = new URLSearchParams(window.location.hash.split('?')[1]);
    const regionSlug = params.get('region') || 'kanto';

    container.innerHTML = `
        ${renderNav('/games')}
        <div class="animate-fade">
            <div style="margin-bottom: 40px;">
                <a href="#/games" class="nav-btn" style="color: var(--text-muted); font-weight: bold; text-decoration: none;">&larr; Voltar para Regiões</a>
                <div style="display: flex; align-items: center; gap: 15px; margin-top: 20px;">
                    <span style="font-size: 2.5rem;">🎮</span>
                    <h2 style="font-size: 2.5rem; font-weight: 800; margin: 0;">Biblioteca de Jogos</h2>
                </div>
                <p style="color: var(--text-muted); font-size: 1.1rem; margin-top: 10px; text-transform: capitalize;">Explorando a história de ${regionSlug}</p>
            </div>

            <div id="filter-container" class="library-filter-container">
                <!-- Filters will be injected here -->
            </div>

            <div id="games-grid" class="animate-fade" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 30px; margin-top: 20px;">
                <!-- Games will be injected here -->
            </div>
        </div>
    `;

    const filterContainer = document.getElementById('filter-container');
    const gamesGrid = document.getElementById('games-grid');

    try {
        const response = await fetch('./src/data/games_registry.json');
        const data = await response.json();
        const region = data.regions.find(r => r.id === regionSlug);

        if (!region) {
            gamesGrid.innerHTML = '<div class="empty-state">Região não encontrada no registro.</div>';
            return;
        }

        const renderGames = (genFilter = 'all') => {
            gamesGrid.innerHTML = '';
            let filteredGens = genFilter === 'all' 
                ? region.generations 
                : region.generations.filter(g => g.gen === parseInt(genFilter));

            filteredGens.forEach(gen => {
                gen.games.forEach(game => {
                    const card = document.createElement('div');
                    card.className = 'game-card animate-fade';
                    card.innerHTML = `
                        <div class="game-card-img-wrapper">
                            <img src="./assets/images/games/${game.id}.png" 
                                 onerror="this.onerror=null; this.src='./images/games/${game.id}.png'; this.onerror=() => { this.src='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png'; this.style.opacity='0.2'; };" 
                                 class="game-card-img" alt="${game.name}">
                        </div>
                        <div class="game-card-content">
                            <div class="game-card-header">
                                <h3 class="game-card-title">${game.name}</h3>
                                <span class="game-card-year">${game.year}</span>
                            </div>
                            <p class="game-card-desc">${game.desc || 'Explorar detalhes técnicos desta versão e seus Pokémon exclusivos.'}</p>
                            <div class="game-card-footer">
                                <a href="#/games/${game.id}" class="explore-link">
                                    Explorar Jogo <span>&rarr;</span>
                                </a>
                            </div>
                        </div>
                    `;
                    gamesGrid.appendChild(card);
                });
            });
        };

        // Render Filters
        const allGens = region.generations.map(g => g.gen);
        filterContainer.innerHTML = `
            <button class="filter-pill active" data-gen="all">Todos</button>
            ${region.generations.map(g => `
                <button class="filter-pill" data-gen="${g.gen}">${g.name}</button>
            `).join('')}
        `;

        filterContainer.querySelectorAll('.filter-pill').forEach(btn => {
            btn.addEventListener('click', () => {
                filterContainer.querySelector('.active').classList.remove('active');
                btn.classList.add('active');
                renderGames(btn.dataset.gen);
            });
        });

        // Initial Render
        renderGames();

    } catch (err) {
        console.error(err);
        gamesGrid.innerHTML = '<div class="empty-state">Erro ao carregar o registro de jogos.</div>';
    }
};
