import Header from './components/Header.js';
import { router } from './router.js';

let darkMode = false;

const toggleTheme = () => {
  darkMode = !darkMode;
  localStorage.setItem('pokedex_theme', darkMode ? 'dark' : 'light');
  
  if (darkMode) {
    document.body.setAttribute('data-theme', 'dark');
  } else {
    document.body.removeAttribute('data-theme');
  }
  
  // Re-render header to update icon
  renderHeader();
};

const renderHeader = () => {
  const headerContainer = document.getElementById('header-container');
  if (headerContainer) {
    headerContainer.innerHTML = Header({ darkMode });
    
    // Attach event listener for theme toggle
    const toggleBtn = headerContainer.querySelector('.theme-toggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', toggleTheme);
    }
  }
};

const init = () => {
  const root = document.getElementById('root');
  root.innerHTML = `
    <div class="App">
      <div id="header-container"></div>
      <div id="app-content"></div>
    </div>
  `;

  // Initialize Theme
  const savedTheme = localStorage.getItem('pokedex_theme');
  if (savedTheme === 'dark') {
    darkMode = true;
    document.body.setAttribute('data-theme', 'dark');
  }

  renderHeader();

  // Listen for hash changes
  window.addEventListener('hashchange', router);
  
  // Initial route
  router();
};

document.addEventListener('DOMContentLoaded', init);
