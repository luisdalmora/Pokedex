import { fetchEvolutionChain, fetchSpeciesDetails } from '../services/api.js';
import { translateMethod } from '../utils/translations.js';

export const renderEvolutionTree = async (container, speciesUrl) => {
  try {
    const evoData = await fetchEvolutionChain(speciesUrl);
    if (!evoData || !evoData.chain) return;

    const buildChainHtml = (node) => {
      let html = `
        <a href="#/pokemon/${node.species.name}" class="evo-node hoverable-node">
          <div class="evo-img-wrapper">
            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${node.species.url.split('/').slice(-2,-1)[0]}.png" class="evo-img" onerror="this.src='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${node.species.url.split('/').slice(-2,-1)[0]}.png'" />
          </div>
          <span class="evo-name">${node.species.name.replace('-', ' ')}</span>
        </a>
      `;
      
      if (node.evolves_to && node.evolves_to.length > 0) {
         html += `<div class="evo-branches">`;
         node.evolves_to.forEach(child => {
            let methodDisplay = '';
            const details = child.evolution_details[0];
            
            if(details) {
               if(details.item) {
                 methodDisplay = `<div class="evo-method-wrapper"><img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${details.item.name}.png" class="evo-item-img" onerror="this.style.display='none';"/><span>${translateMethod('item-' + details.item.name)}</span></div>`;
               } else if(details.trigger.name === 'trade') {
                 methodDisplay = `<div class="evo-method-wrapper"><span class="evo-icon">🔁</span><span>Troca</span></div>`;
                 if(details.held_item) methodDisplay = `<div class="evo-method-wrapper"><img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${details.held_item.name}.png" class="evo-item-img" onerror="this.style.display='none';"/><span>Troca c/ Item</span></div>`;
               } else if(details.min_level) {
                 methodDisplay = `<div class="evo-method-wrapper"><span class="evo-icon">📊</span><span>Nv ${details.min_level}</span></div>`;
               } else if(details.min_happiness) {
                 methodDisplay = `<div class="evo-method-wrapper"><span class="evo-icon">✨</span><span>Felicidade ${details.time_of_day ? (details.time_of_day==='day'?'☀️':'🌙') : ''}</span></div>`;
               } else if(details.location) {
                 methodDisplay = `<div class="evo-method-wrapper"><span class="evo-icon">📍</span><span>Local</span></div>`;
               } else {
                 methodDisplay = `<div class="evo-method-wrapper"><span class="evo-icon">✨</span><span>Especial</span></div>`;
               }
            }
            
            html += `
              <div class="evo-branch">
                <div class="evo-arrow">
                  <span class="arrow-icon">&rarr;</span>
                  <span class="arrow-text">${methodDisplay}</span>
                </div>
                ${buildChainHtml(child)}
              </div>
            `;
         });
         html += `</div>`;
      }
      return html;
    };

    const evosHtml = `
      <div class="evolution-container">
        <h3 class="section-title"><span class="icon">🧬</span>Cadeia de Evolução</h3>
        <div class="evolution-tree">
          ${buildChainHtml(evoData.chain)}
        </div>
      </div>
    `;
    
    container.innerHTML = evosHtml;
  } catch (error) {
    console.error('Failed to render evolution tree', error);
  }
};
