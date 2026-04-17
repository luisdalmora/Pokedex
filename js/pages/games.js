import { fetchRegionList, fetchRegionDetails, fetchGenerationDetails } from '../services/api.js';
import { renderNav } from '../components/Nav.js';

let cachedRegions = null;

const romanToNum = (roman) => {
  const ro = roman.toUpperCase();
  const vals = { I:1, V:5, X:10 };
  let num = 0;
  for(let i=0; i<ro.length; i++) {
     let curr = vals[ro[i]], next = vals[ro[i+1]];
     if (next && next > curr) { num += next - curr; i++; } else { num += curr; }
  }
  return num;
};

export const initGamesView = async (container) => {
  container.innerHTML = `
    ${renderNav('/games')}
    <div style="margin-bottom: 40px; text-align:center;">
       <h2 style="font-size: 2.5rem; font-weight: 800; margin-bottom: 10px;">🗺️ Mundo Pokémon</h2>
       <p style="color: var(--text-muted); font-size: 1.2rem;">Escolha uma região para explorar seus jogos e Pokédex nativa.</p>
    </div>
    <div id="regions-content"><div class="loading-state">Buscando regiões no satélite...</div></div>
  `;

  const content = document.getElementById('regions-content');

  if (!cachedRegions) {
    try {
      const basicList = await fetchRegionList();
      const regionPromises = basicList.map(r => fetchRegionDetails(r.name));
      const fullRegions = await Promise.all(regionPromises);
      
      const genMapping = {};
      
      // Enhance with Generation Data
      for(let r of fullRegions) {
         if(!r || !r.main_generation) continue;
         if(!genMapping[r.main_generation.name]) {
             const genData = await fetchGenerationDetails(r.main_generation.name);
             genMapping[r.main_generation.name] = genData;
         }
         r.genData = genMapping[r.main_generation.name];
         r.generationNumber = romanToNum(r.main_generation.name.split('-')[1] || 'I');
      }
      
      cachedRegions = fullRegions.filter(r => r && r.main_generation).sort((a,b) => a.generationNumber - b.generationNumber);
    } catch(e) {
      console.error(e);
      content.innerHTML = '<div class="empty-state">Erro ao conectar com PokéAPI.</div>';
      return;
    }
  }

  // Render Pipeline
  let html = `<div class="animate-fade timeline-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 30px;">`;
  
  cachedRegions.forEach(region => {
     const count = region.genData ? region.genData.pokemon_species.length : '?';
     const genRoman = region.main_generation.name.split('-')[1].toUpperCase();
     
     html += `
        <a href="#/games/library?region=${region.name}" style="display: flex; flex-direction: column; background: var(--card-bg); border-radius: 20px; overflow: hidden; box-shadow: 0 10px 20px rgba(0,0,0,0.05); text-decoration: none; color: inherit; transition: all 0.3s; border: 1px solid var(--border-color); position: relative;" class="region-card">
          
          <div style="height: 180px; position:relative; overflow:hidden; background:var(--bg-color); display:flex; justify-content:center; align-items:center;">
             <img src="./assets/images/regions/${region.name}.png" onerror="this.onerror=null; this.src='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/town-map.png'; this.style.opacity='0.5'; this.style.objectFit='contain'; this.style.width='50%';" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s;" class="region-img" alt="${region.name}"/>
             <div style="position: absolute; top:0; left:0; right:0; bottom:0; background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);"></div>
             <h3 style="position:absolute; bottom: 20px; left: 20px; color: white; font-size: 2rem; font-weight: 800; text-transform: capitalize; text-shadow: 0 2px 4px rgba(0,0,0,0.5); margin:0;">${region.name}</h3>
             
             <span style="position:absolute; top: 15px; right: 15px; background: rgba(255,255,255,0.9); color: #000; font-weight: 800; padding: 5px 15px; border-radius: 20px; font-size: 0.9em; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">Gen ${genRoman}</span>
          </div>

          <div style="padding: 25px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
              <div style="display:flex; align-items:center; gap:8px;">
                 <span style="font-size: 1.2rem;">🐾</span>
                 <span style="font-weight: 700; color: var(--text-main);">${count} Inéditos Pokémon</span>
              </div>
            </div>
            
            <div style="margin-top: 15px; border-top: 1px solid var(--border-color); padding-top: 15px; display: flex; align-items: center; gap: 8px; font-weight: 700; color: #ef4444; font-size: 0.95rem;">
               <span>Explorar Pokédex Regional</span>
               <span>&rarr;</span>
            </div>
          </div>
        </a>
     `;
  });

  html += `</div>
    <style>
      .region-card:hover { transform: translateY(-8px); box-shadow: 0 20px 30px rgba(0,0,0,0.1); border-color:#ef4444; }
      .region-card:hover .region-img { transform: scale(1.05); }
    </style>
  `;

  content.innerHTML = html;
};
