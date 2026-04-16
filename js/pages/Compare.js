import { fetchPokemonDetails } from '../services/api.js';
import { getSprite, formatId } from '../utils/helpers.js';
import { translateStat } from '../utils/translations.js';
import { createTypePill } from '../components/PokemonCard.js';
import { renderNav } from '../components/Nav.js';

const renderSlot = (pokemon, slotId) => {
  if (!pokemon) {
    return `
      <div class="compare-slot" id="slot-${slotId}">
        <input type="text" id="input-${slotId}" class="search-input-fancy" placeholder="Nome ou ID...">
        <button id="btn-${slotId}" style="margin-top:15px; padding: 10px 20px; border-radius: 20px; border:none; background:#ef4444; color:white; font-weight:bold; cursor:pointer;">Carregar</button>
      </div>
    `;
  }

  const primaryType = pokemon.types[0].type.name;
  
  return `
    <div class="compare-slot filled type-bg-${primaryType}" id="slot-${slotId}" style="position:relative; color:white; overflow:hidden;">
      <button class="clear-btn" data-slot="${slotId}" style="position:absolute; top:10px; right:10px; background:rgba(0,0,0,0.5); color:white; border:none; border-radius:50%; width:30px; height:30px; cursor:pointer;">✕</button>
      <img src="${getSprite(pokemon)}" style="width:150px; height:150px; object-fit:contain; filter:drop-shadow(0 5px 10px rgba(0,0,0,0.3));"/>
      <h3 style="font-size: 1.5rem; text-transform:capitalize; margin: 10px 0;">
        <span style="opacity:0.7; font-size:1rem; margin-right:5px;">${formatId(pokemon.id)}</span>${pokemon.name.replace('-', ' ')}
      </h3>
      <div style="display:flex; gap:5px; justify-content:center; margin-bottom: 20px;">
        ${pokemon.types.map(t => createTypePill(t.type.name).outerHTML).join('')}
      </div>
    </div>
  `;
};

const renderStatsComparison = (p1, p2) => {
   if (!p1 || !p2) return '';
   
   let html = `<div style="grid-column: 1/-1; background:var(--card-bg); padding:30px; border-radius:var(--radius); margin-top:20px;">
      <h3 style="text-align:center; margin-bottom:20px;">Comparação de Atributos</h3>`;
      
   for(let i=0; i<p1.stats.length; i++) {
      const s1 = p1.stats[i].base_stat;
      const s2 = p2.stats[i].base_stat;
      const statName = translateStat(p1.stats[i].stat.name);
      
      const c1 = s1 > s2 ? 'stat-win' : (s1 < s2 ? 'stat-lose' : '');
      const c2 = s2 > s1 ? 'stat-win' : (s2 < s1 ? 'stat-lose' : '');
      
      html += `
        <div style="display:flex; justify-content:space-between; margin-bottom:15px; border-bottom:1px solid var(--border-color); padding-bottom:5px;">
           <span class="${c1}" style="font-weight:bold; width:50px; text-align:right;">${s1}</span>
           <span style="color:var(--text-muted); text-transform:uppercase; font-size:0.85em; font-weight:700;">${statName}</span>
           <span class="${c2}" style="font-weight:bold; width:50px; text-align:left;">${s2}</span>
        </div>
      `;
   }
   
   const total1 = p1.stats.reduce((acc, curr) => acc + curr.base_stat, 0);
   const total2 = p2.stats.reduce((acc, curr) => acc + curr.base_stat, 0);
   
   html += `
        <div style="display:flex; justify-content:space-between; margin-top:20px; font-size:1.2em;">
           <span class="${total1 > total2 ? 'stat-win' : (total1 < total2 ? 'stat-lose' : '')}" style="font-weight:900;">${total1}</span>
           <span style="font-weight:900;">TOTAL</span>
           <span class="${total2 > total1 ? 'stat-win' : (total2 < total1 ? 'stat-lose' : '')}" style="font-weight:900;">${total2}</span>
        </div>
   `;
   html += `</div>`;
   return html;
};

export const renderCompareView = async (container) => {
  let pokemon1 = null;
  let pokemon2 = null;

  const render = () => {
    container.innerHTML = `
      ${renderNav('/compare')}
      <div class="animate-fade">
        <h2 style="text-align:center; font-size: 2rem; margin-bottom: 30px;">Comparador Pokédex</h2>
        <div class="compare-container">
          ${renderSlot(pokemon1, 1)}
          <div class="compare-vs">VS</div>
          ${renderSlot(pokemon2, 2)}
        </div>
        ${renderStatsComparison(pokemon1, pokemon2)}
      </div>
    `;
    attachEvents();
  };

  const loadSlot = async (slotId) => {
    const input = document.getElementById(`input-${slotId}`);
    if(!input || !input.value.trim()) return;
    
    document.getElementById(`btn-${slotId}`).textContent = 'Carregando...';
    try {
       const p = await fetchPokemonDetails(input.value.trim().toLowerCase());
       if (p) {
         if (slotId === 1) pokemon1 = p;
         else pokemon2 = p;
         render();
       } else {
         alert('Pokémon não encontrado.');
         document.getElementById(`btn-${slotId}`).textContent = 'Carregar';
       }
    } catch(e) {
       alert('Erro ao carregar.');
       document.getElementById(`btn-${slotId}`).textContent = 'Carregar';
    }
  };

  const attachEvents = () => {
    const btn1 = document.getElementById('btn-1');
    const btn2 = document.getElementById('btn-2');
    if (btn1) btn1.addEventListener('click', () => loadSlot(1));
    if (btn2) btn2.addEventListener('click', () => loadSlot(2));

    document.querySelectorAll('.clear-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const slot = e.target.dataset.slot;
        if (slot === '1') pokemon1 = null;
        if (slot === '2') pokemon2 = null;
        render();
      });
    });
  };

  render();
};
