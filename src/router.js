import Home from './pages/Home.js';
import PokemonDetail from './pages/PokemonDetail.js';
import GamesSection from './pages/GamesSection.js';
import GameDetail from './pages/GameDetail.js';

const routes = [
  { path: /^\/$/, component: Home },
  { path: /^\/pokemon\/([^/]+)$/, component: PokemonDetail },
  { path: /^\/games$/, component: GamesSection },
  { path: /^\/games\/([^/]+)$/, component: GameDetail }
];

export const router = async () => {
  const hash = window.location.hash.slice(1) || '/';
  
  const appContainer = document.getElementById('app-content');
  if (!appContainer) return;
  
  // Clear currently active component unmount events if we had any
  if (window.unmountCurrent) {
    window.unmountCurrent();
    window.unmountCurrent = null;
  }
  
  let match = null;
  let params = null;
  
  for (const route of routes) {
    const execResult = route.path.exec(hash);
    if (execResult) {
      match = route;
      params = execResult.slice(1);
      break;
    }
  }

  if (match) {
    // Render the component
    appContainer.innerHTML = '<div class="loading-state retro-font">Aguarde...</div>'; // basic loading while mounting
    await match.component(appContainer, ...params);
  } else {
    appContainer.innerHTML = '<div class="empty-state retro-font">Página não encontrada 404</div>';
  }
};
