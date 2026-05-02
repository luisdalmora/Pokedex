export const renderNav = (activePath) => {
  return `
    <nav class="main-nav" style="margin-top: -40px; margin-bottom: 40px; margin-left: -20px; margin-right: -20px; border-radius: 0 0 10px 10px;">
      <div class="nav-inner">
        <a href="#/" class="nav-btn ${activePath === '/' ? 'active' : ''}">Pokédex</a>
        <a href="#/games" class="nav-btn ${activePath === '/games' ? 'active' : ''}">Jogos & Regiões</a>
        <a href="#/quiz" class="nav-btn ${activePath === '/quiz' ? 'active' : ''}">Quiz</a>
        <a href="#/compare" class="nav-btn ${activePath === '/compare' ? 'active' : ''}">Comparar</a>
      </div>
    </nav>
  `;
};
