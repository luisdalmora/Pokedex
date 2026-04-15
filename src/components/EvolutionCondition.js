const getIconUrl = (type, name) => {
  if (type === 'item') {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${name}.png`;
  }
  // Fallbacks visuais locais com emojis ou CSS
  return '';
};

const titleCase = (str) => {
  return str.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
};

const EvolutionCondition = (details, fallback = null, childName = '') => {
  if (!details && !fallback) return '';

  let html = '';
  let conditionText = '';
  let iconHtml = '';

  // Usar fallback manual primeiro
  if (fallback) {
    // É um fallback genérico ou específico do filho?
    let fallbackData = fallback;
    if (fallback.targets && fallback.targets[childName]) {
      fallbackData = fallback.targets[childName];
    }
    
    if (fallbackData.condition) {
      conditionText = fallbackData.condition;
      
      // Ícones customizados do fallback (textuais / visuais para facilitar)
      if (fallbackData.icon === 'rotate-icon') iconHtml = '🔄📱';
      else if (fallbackData.icon === 'location') iconHtml = '📍';
      else if (fallbackData.icon === 'spin') iconHtml = '🌪️';
      else if (fallbackData.icon?.includes('stats')) iconHtml = '⚔️🛡️';
      else iconHtml = '✨';

      html = `
        <div class="evo-condition fallback-condition tooltip-container" style="display: flex; flex-direction: column; align-items: center; justify-content: center; position: relative;">
           <div style="font-size: 24px; filter: drop-shadow(0 2px 2px rgba(0,0,0,0.1));" title="${conditionText}">${iconHtml}</div>
           <span class="tooltip-text retro-font" style="font-size: 0.6em; text-align: center; white-space: nowrap;">${conditionText}</span>
        </div>
      `;
      return html;
    }
  }

  // Parse details from PokeAPI se nenhum fallback bater
  if (!details) return '';

  // LEVEL
  if (details.min_level) {
    conditionText = `Lvl ${details.min_level}`;
    html += `
      <div class="evo-condition trigger-level" style="background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 12px; padding: 4px 8px; font-weight: bold; font-size: 0.8em; color: var(--text-main); margin-bottom: 2px;">
        ${conditionText}
      </div>
    `;
  } else if (details.trigger?.name === 'level-up' && !details.min_level) {
    conditionText = 'Level Up';
    html += `
      <div class="evo-condition trigger-level" style="background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 12px; padding: 4px 8px; font-weight: bold; font-size: 0.8em; color: var(--text-main); margin-bottom: 2px;">
        ⭐ Lvl Up
      </div>
    `;
  }

  // ITEM
  if (details.item) {
    conditionText = titleCase(details.item.name);
    iconHtml = `<img src="${getIconUrl('item', details.item.name)}" alt="${conditionText}" style="width: 32px; height: 32px; image-rendering: pixelated; filter: drop-shadow(1px 2px 3px rgba(0,0,0,0.2));" onerror="this.onerror=null;this.src='./images/items/fallback.png';this.style.display='none';this.insertAdjacentHTML('afterend', '🪨');" title="Item: ${conditionText}" />`;
    html += `
      <div class="evo-condition trigger-item tooltip-container" style="display: flex; flex-direction: column; align-items: center;">
        ${iconHtml}
        <span class="tooltip-text retro-font" style="font-size: 0.6em;">${conditionText}</span>
      </div>
    `;
  }

  // TRADE
  if (details.trigger?.name === 'trade') {
    conditionText = 'Troca';
    if (details.held_item) {
       conditionText += ` c/ ${titleCase(details.held_item.name)}`;
    }
    html += `
      <div class="evo-condition trigger-trade tooltip-container" style="display: flex; flex-direction: column; align-items: center;">
        <div style="font-size: 20px;" title="${conditionText}">🔄</div>
        ${details.held_item ? `<img src="${getIconUrl('item', details.held_item.name)}" style="width:24px; margin-top: -5px;" onerror="this.style.display='none';"/>` : ''}
        <span class="tooltip-text retro-font" style="font-size: 0.6em; white-space: nowrap;">${conditionText}</span>
      </div>
    `;
  }

  // HAPPINESS / AFFECTION / BEAUTY
  if (details.min_happiness) {
    conditionText = `Felicidade ${details.min_happiness}`;
    html += `<div class="evo-condition trigger-happiness tooltip-container" style="font-size: 20px; color: #ff4d4d;" title="${conditionText}">❤️ <span class="tooltip-text retro-font" style="font-size: 0.6em; white-space:nowrap; color:white;">${conditionText}</span></div>`;
  }
  if (details.min_affection) {
    conditionText = `Afeição ${details.min_affection}`;
    html += `<div class="evo-condition trigger-affection tooltip-container" style="font-size: 20px; color: #ffb3b3;" title="${conditionText}">💕 <span class="tooltip-text retro-font" style="font-size: 0.6em; white-space:nowrap; color:white;">${conditionText}</span></div>`;
  }

  // TIME OF DAY
  if (details.time_of_day) {
    iconHtml = details.time_of_day === 'day' ? '☀️' : '🌙';
    conditionText = details.time_of_day === 'day' ? 'De Dia' : 'De Noite';
    html += `<div class="evo-condition trigger-time tooltip-container" style="font-size: 20px;" title="${conditionText}">${iconHtml} <span class="tooltip-text retro-font" style="font-size: 0.6em; white-space:nowrap;">${conditionText}</span></div>`;
  }

  // WEATHER (Rain)
  if (details.needs_overworld_rain) {
    html += `<div class="evo-condition trigger-rain tooltip-container" style="font-size: 20px;" title="Na Chuva">🌧️ <span class="tooltip-text retro-font" style="font-size: 0.6em; white-space:nowrap;">Chuva</span></div>`;
  }

  // LOCATION
  if (details.location) {
    conditionText = `Em ${titleCase(details.location.name)}`;
    html += `<div class="evo-condition trigger-location tooltip-container" style="font-size: 20px;" title="${conditionText}">📍 <span class="tooltip-text retro-font" style="font-size: 0.6em; white-space:nowrap;">${conditionText}</span></div>`;
  }

  // KNOWS MOVE (Coupled with other triggers usually like level-up)
  if (details.known_move) {
     conditionText = `Saber ${titleCase(details.known_move.name)}`;
     html += `<div class="evo-condition trigger-move tooltip-container" style="font-size: 18px;" title="${conditionText}">🎯 <span class="tooltip-text retro-font" style="font-size: 0.6em; white-space:nowrap;">${conditionText}</span></div>`;
  }
  
  if (details.known_move_type) {
     conditionText = `Saber Ataque Tipo ${titleCase(details.known_move_type.name)}`;
     html += `<div class="evo-condition trigger-move-type tooltip-container" style="font-size: 18px;" title="${conditionText}">🔮 <span class="tooltip-text retro-font" style="font-size: 0.6em; white-space:nowrap;">${conditionText}</span></div>`;
  }

  // PARTY SPECIES (E.g. Mantyke -> Mantine needs Remoraid)
  if (details.party_species) {
    conditionText = `Com ${titleCase(details.party_species.name)} na equipe`;
    html += `<div class="evo-condition trigger-party tooltip-container" style="font-size: 18px;" title="${conditionText}">🫂 <span class="tooltip-text retro-font" style="font-size: 0.6em; white-space:nowrap;">${conditionText}</span></div>`;
  }

  // GENDER
  if (details.gender) {
     // 1: Female, 2: Male
     const genderStr = details.gender === 1 ? '♀️ Fêmea' : '♂️ Macho';
     html += `<div class="evo-condition trigger-gender tooltip-container" style="font-size: 14px; font-weight: bold; background: var(--bg-color); border-radius: 8px; padding: 2px 4px; border: 1px solid var(--border-color);" title="${genderStr}">${genderStr} <span class="tooltip-text retro-font" style="font-size: 0.6em; white-space:nowrap;">Apenas ${genderStr}</span></div>`;
  }

  // STATS (Tyrogue is an example, handled mechanically by PokeAPI min_affection or just stats... wait, it's relative_physical_stats)
  if (details.relative_physical_stats !== null && details.relative_physical_stats !== undefined) {
    let statText = "Ataque = Defesa";
    if (details.relative_physical_stats === 1) statText = "Ataque > Defesa";
    if (details.relative_physical_stats === -1) statText = "Ataque < Defesa";
    
    html += `<div class="evo-condition trigger-stats tooltip-container" style="font-size: 16px; font-weight: bold; border-bottom: 2px solid #ccc;" title="${statText}">⚔️🛡️ <span class="tooltip-text retro-font" style="font-size: 0.6em; white-space:nowrap;">${statText}</span></div>`;
  }

  if (html === '' && !details.min_level && details.trigger?.name !== 'level-up') {
      // Outros desconhecidos
       html += `<div class="evo-condition trigger-unknown tooltip-container" style="font-size: 16px;" title="Condição Especial">✨ <span class="tooltip-text retro-font" style="font-size: 0.6em; white-space:nowrap;">Evolução Especial</span></div>`;
  }

  return `
    <div class="evo-conditions-wrapper" style="display: flex; flex-direction: row; align-items: center; justify-content: center; gap: 8px; padding: 5px 10px; background: rgba(255,255,255,0.7); border-radius: 12px; min-height: 40px; z-index: 2; margin: 0 5px;">
        ${html}
        <div class="evo-arrow-symbol" style="color: var(--text-muted); font-size: 20px; line-height: 1; font-weight: bold; margin-left: 5px;">→</div>
    </div>
  `;
};

export default EvolutionCondition;
