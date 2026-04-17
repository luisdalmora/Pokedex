import { typeTranslations } from '../utils/translations.js';

// Helper to render Region Cards
const renderRegionCard = (name, range, slug, extraClass = '', gradient) => `
    <a href="#/games/library?region=${slug}" class="region-card-premium ${extraClass}" style="background: ${gradient};">
        <img src="./assets/images/regions/${slug}.png" class="card-art" alt="${name}" onerror="this.style.display='none'">
        <div class="card-overlay"></div>
        <div class="card-content">
            <h3>${name}</h3>
            <p>${range}</p>
            <button class="btn-explorar">Explorar</button>
        </div>
    </a>
`;

const renderSmallDexCard = (id, title, desc, icon, gradient) => `
    <div class="region-card-premium" style="min-height: 120px; padding: 15px; background: ${gradient}; flex-direction: row; align-items: center; justify-content: flex-start; gap: 15px; cursor: pointer; text-decoration: none;" onclick="window.location.hash = '#/others/${id}'">
        <div style="font-size: 2.5rem; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));">${icon}</div>
        <div class="card-content" style="text-align: left; z-index: 3;">
            <h4 style="font-size: 1.1rem; font-weight: 800; margin: 0; text-shadow: 0 1px 2px rgba(0,0,0,0.5);">${title}</h4>
            <p style="font-size: 0.8rem; font-weight: 500; opacity: 0.9; margin: 5px 0 0; background: none; padding: 0;">${desc}</p>
        </div>
    </div>
`;

export const renderHomeView = async (container) => {
    container.innerHTML = `
        <!-- Panoramic Hero Section with Integrated UI (Compact) -->
        <section class="hero-dashboard animate-fade" style="background-image: url('./assets/images/backgrounds/hero-bg.png'); height: 260px; flex-direction: column; align-items: stretch; justify-content: space-between; padding: 20px 8%; border-radius: 0;">
            <!-- Top Bar: Theme Toggle -->
            <div style="display: flex; justify-content: flex-end; width: 100%;">
                <button class="theme-toggle" id="hero-theme-toggle" style="background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.2); backdrop-filter: blur(10px); padding: 8px; border-radius: 50%; color: white; cursor: pointer; transition: 0.3s; display: flex; align-items: center; justify-content: center;">
                    <svg fill="currentColor" width="18" height="18" viewBox="0 0 24 24"><path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-3.03 0-5.5-2.47-5.5-5.5 0-1.82.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z"/></svg>
                </button>
            </div>

            <!-- Middle Row: Branding -->
            <div class="hero-content" style="max-width: 900px; margin: 0; padding: 0; display: flex; align-items: baseline; gap: 30px;">
                <h1 class="hero-title" style="font-size: 3rem; line-height: 1; margin: 0; font-weight: 950; letter-spacing: -1.5px; color: white;">Pokédex Completa</h1>
                <p class="hero-subtitle" style="font-size: 1rem; opacity: 0.8; border-left: 3px solid #fcd34d; padding-left: 15px; max-width: 450px; color: white; margin: 0;">Explore Pokémon por região, jogos ou Pokédex especiais.</p>
            </div>

            <!-- Bottom Row: Integrated Navigation Menu (Tight) -->
            <nav class="dashboard-tabs" style="margin-top: 20px; justify-content: flex-start; position: relative; top: 0; background: none;">
                <div class="tabs-container" style="background: rgba(255,255,255,0.1); backdrop-filter: blur(15px); border: 1px solid rgba(255,255,255,0.1); padding: 5px; border-radius: 40px; box-shadow: 0 10px 25px rgba(0,0,0,0.2);">
                    <button class="tab-item active" data-target="section-pokedex" style="color: white; padding: 10px 25px; font-size: 0.9rem;">
                        <span>📅</span> Pokédex
                    </button>
                    <button class="tab-item" data-target="section-jogos" style="color: white; padding: 10px 25px; font-size: 0.9rem;">
                        <span>🎮</span> Jogos
                    </button>
                    <button class="tab-item" data-target="section-outros" style="color: white; padding: 10px 25px; font-size: 0.9rem;">
                        <span>🔘</span> Outros
                    </button>
                </div>
            </nav>
        </section>

        <div id="dashboard-content" class="dashboard-content-layout">
            <!-- Pokédex Section -->
            <section id="section-pokedex">
                <h2 class="section-title" style="margin-top: 0;">Pokédex</h2>
                <div class="region-grid animate-fade">
                    ${renderRegionCard('National', '1 a 1025', 'national', 'region-card-wide', 'linear-gradient(135deg, #f59e0b, #d97706)')}
                    ${renderRegionCard('Kanto', '1 a 151', 'kanto', '', 'linear-gradient(135deg, #ef4444, #b91c1c)')}
                    ${renderRegionCard('Johto', '152 a 251', 'johto', '', 'linear-gradient(135deg, #ec4899, #be185d)')}
                    ${renderRegionCard('Hoenn', '252 a 386', 'hoenn', '', 'linear-gradient(135deg, #10b981, #059669)')}
                    ${renderRegionCard('Sinnoh', '387 a 493', 'sinnoh', '', 'linear-gradient(135deg, #06b6d4, #0891b2)')}
                    ${renderRegionCard('Unova', '494 a 649', 'unova', '', 'linear-gradient(135deg, #6366f1, #4338ca)')}
                    ${renderRegionCard('Kalos', '650 a 721', 'kalos', '', 'linear-gradient(135deg, #f43f5e, #be185d)')}
                    ${renderRegionCard('Alola', '722 a 809', 'alola', '', 'linear-gradient(135deg, #3b82f6, #1d4ed8)')}
                    ${renderRegionCard('Galar', '810 a 898', 'galar', '', 'linear-gradient(135deg, #10b981, #065f46)')}
                    ${renderRegionCard('Hisui', '899 a 905', 'hisui', '', 'linear-gradient(135deg, #0ea5e9, #0369a1)')}
                    ${renderRegionCard('Paldea', '906 a 1025', 'paldea', '', 'linear-gradient(135deg, #c026d3, #a21caf)')}
                </div>
            </section>

            <!-- Jogos Section -->
            <section id="section-jogos">
                <h2 class="section-title">Jogos</h2>
                <div id="games-container" class="games-grid animate-fade" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px;">
                    <div class="loading-state">Carregando Biblioteca de Jogos...</div>
                </div>
            </section>

            <!-- Outros Pokédex Section -->
            <section id="section-outros">
                <h2 class="section-title">Outros Pokédex</h2>
                <div class="outros-grid animate-fade">
                    ${renderSmallDexCard('shiny', 'Shiny Dex', 'Pokémon com sprites shiny', '✨', 'linear-gradient(135deg, #10b981, #047857)')}
                    ${renderSmallDexCard('competitive', 'Competitive Dex', 'Cortes de elite e batalhas.', '⚔️', 'linear-gradient(135deg, #8b5cf6, #6d28d9)')}
                    ${renderSmallDexCard('size', 'Size Dex', 'Pokémon com tamanhos/peso.', '📏', 'linear-gradient(135deg, #f43f5e, #be185d)')}
                    ${renderSmallDexCard('go', 'Pokémon GO', 'Pokémon de batalhas GO.', '📱', 'linear-gradient(135deg, #38bdf8, #0284c7)')}
                </div>
            </section>
        </div>
    `;

    const tabItems = container.querySelectorAll('.tab-item');

    tabItems.forEach(item => {
        item.addEventListener('click', () => {
            tabItems.forEach(t => t.classList.remove('active'));
            item.classList.add('active');
            const targetId = item.getAttribute('data-target');
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                const navHeight = document.querySelector('.dashboard-tabs').offsetHeight;
                window.scrollTo({
                    top: targetElement.offsetTop - navHeight - 20,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Integrated Theme Toggle Logic
    const themeBtn = document.getElementById('hero-theme-toggle');
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const targetTheme = currentTheme === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', targetTheme);
            localStorage.setItem('pokedex-theme', targetTheme);
        });
    }

    const loadGames = async () => {
        const gamesContainer = document.getElementById('games-container');
        try {
            const res = await fetch('./src/data/games_registry.json');
            const data = await res.json();
            
            const platformIcons = {
                'Game Boy': 'game-boy.png', 'GBC': 'game-boy-color.png', 'Game Boy Color': 'game-boy-color.png',
                'GBA': 'game-boy-advance.png', 'DS': 'nintendo-ds.png', '3DS': 'nintendo-3ds.png', 'Switch': 'nintendo-switch.png'
            };

            // Let's show a few featured ones from different generations
            const featuredGames = [];
            data.regions.forEach(r => {
                r.generations.forEach(gen => {
                    gen.games.slice(0, 1).forEach(g => {
                        featuredGames.push({...g, region: r.name, platformIcon: platformIcons[g.platform] || 'nintendo-switch.png'});
                    });
                });
            });

            gamesContainer.innerHTML = featuredGames.slice(0, 9).map(g => `
                <a href="#/games/${g.id}" class="game-card-premium animate-fade" style="text-decoration: none;">
                    <div class="game-card-img-wrapper" style="height: 200px; background: #f1f5f9; display: flex; align-items: center; justify-content: center; padding: 10px;">
                        <div class="console-badge-float" style="background: rgba(255,255,255,0.9); border: 1px solid rgba(0,0,0,0.1); padding: 6px 10px;">
                            <img src="assets/images/consoles/${g.platformIcon}" class="console-icon-tiny" style="filter: none; height: 16px;" onerror="this.src='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png'; this.style.opacity='0.5';">
                            <span class="console-name-tiny" style="color: #334155; font-size: 0.65rem;">${g.platform}</span>
                        </div>
                        <img src="https://img.pokemondb.net/boxes/${g.id.replace('lets-go-pikachu', 'lets-go-pikachu-switch').replace('lets-go-eevee', 'lets-go-eevee-switch')}.jpg" 
                             onerror="this.src='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png'; this.style.opacity='0.2'; this.style.width='40px';" 
                             class="game-card-img" alt="${g.name}" style="object-fit: contain; width: auto; max-height: 100%; box-shadow: 0 8px 15px rgba(0,0,0,0.1);">
                    </div>
                    <div class="game-card-content" style="padding: 15px;">
                        <h4 style="font-size: 1rem; font-weight: 900; margin: 0; color: var(--text-main);">${g.name}</h4>
                        <div style="font-size: 0.75rem; font-weight: 800; color: var(--text-muted); margin-top: 5px;">${g.region} • ${g.year}</div>
                    </div>
                </a>
            `).join('') + `
                <div style="grid-column: 1 / -1; text-align: center; margin-top: 20px;">
                    <a href="#/games/library" class="btn-premium btn-primary" style="display: inline-flex;">Ver Biblioteca Completa &rarr;</a>
                </div>
            `;
        } catch (e) {
            gamesContainer.innerHTML = '<div class="empty-state">Erro ao carregar jogos.</div>';
        }
    };


    loadGames();

    window.unmountCurrent = () => { };
};
