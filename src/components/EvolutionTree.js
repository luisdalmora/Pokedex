import EvolutionCard from './EvolutionCard.js';
import EvolutionCondition from './EvolutionCondition.js';

// Função para extrair o ID a partir da URL (ex: "https://pokeapi.co/api/v2/pokemon-species/133/")
const extractId = (url) => {
  const parts = url.split('/').filter(Boolean);
  return parts[parts.length - 1];
};

const renderNode = (node, specialEvolutionsData) => {
  const currentId = extractId(node.species.url);
  const isBranchParent = node.evolves_to && node.evolves_to.length > 1;
  const isLeaf = !node.evolves_to || node.evolves_to.length === 0;

  // Renderiza si mesmo
  const selfHtml = `
    <div class="evo-node ${isBranchParent ? 'evo-branch-parent' : ''}" style="display: flex; flex-direction: row; align-items: center; position: relative;">
      ${EvolutionCard(currentId, node.species.name)}
      ${!isLeaf && !isBranchParent ? '<div class="evo-line-right"></div>' : ''}
    </div>
  `;

  if (isLeaf) return selfHtml;

  // Tem filhos!
  let childrenHtml = '';
  const fallbackNode = specialEvolutionsData.find(s => s.pokemon === node.species.name);

  if (isBranchParent) {
     // Multiplas ramificações
     const branchesHtml = node.evolves_to.map(child => {
        const details = child.evolution_details && child.evolution_details[0] ? child.evolution_details[0] : null;
        return `
          <div class="evo-branch" style="display: flex; flex-direction: row; align-items: center; position: relative;">
            <div class="evo-branch-line-horiz"></div>
            ${EvolutionCondition(details, fallbackNode, child.species.name)}
            ${renderNode(child, specialEvolutionsData)}
          </div>
        `;
     }).join('');

     childrenHtml = `
       <div class="evo-branches-container" style="display: flex; flex-direction: column; justify-content: center; gap: 20px; position: relative; margin-left: 20px;">
         <div class="evo-vertical-line" style="position: absolute; left: -20px; top: 50%; height: ${((node.evolves_to.length - 1) / node.evolves_to.length) * 100}%; transform: translateY(-50%); width: 2px; background: var(--border-color); z-index: 1;"></div>
         ${branchesHtml}
       </div>
     `;
     
     return `
       <div class="evo-wrapper" style="display: flex; flex-direction: row; align-items: center;">
         ${selfHtml}
         ${childrenHtml}
       </div>
     `;
  } else {
     // Única ramificação
     const child = node.evolves_to[0];
     const details = child.evolution_details && child.evolution_details[0] ? child.evolution_details[0] : null;
     
     childrenHtml = `
       ${EvolutionCondition(details, fallbackNode, child.species.name)}
       <div style="margin-left: 10px;">
         ${renderNode(child, specialEvolutionsData)}
       </div>
     `;

     return `
       <div class="evo-wrapper line-wrapper" style="display: flex; flex-direction: row; align-items: center;">
         ${selfHtml}
         ${childrenHtml}
       </div>
     `;
  }
};

const EvolutionTree = (chain, specialEvolutionsData = []) => {
  if (!chain) return '<div class="retro-font">Nenhum dado de evolução.</div>';

  return `
    <div class="evolution-tree-container" style="width: 100%; overflow-x: auto; padding: 40px 20px; display: flex; justify-content: center; background: radial-gradient(circle, rgba(0,0,0,0.03) 0%, transparent 100%); border-radius: 12px; margin-top: 20px;">
      <div class="evolution-tree-inner animate-fade" style="min-width: min-content;">
        ${renderNode(chain, specialEvolutionsData)}
      </div>
    </div>
  `;
};

export default EvolutionTree;
