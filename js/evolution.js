export const extractEvolutions = (chainData) => {
  const evolutions = [];
  
  const parseNode = (node, currentEvolvesTo = []) => {
    const speciesName = node.species.name;
    const evoDetails = node.evolution_details[0];
    
    let method = 'level-up';
    if (evoDetails) {
      if (evoDetails.trigger.name === 'use-item' && evoDetails.item) {
        method = `item-${evoDetails.item.name}`;
      } else if (evoDetails.trigger.name === 'trade') {
        method = 'trade';
      } else if (evoDetails.min_level) {
        method = `level-${evoDetails.min_level}`;
      } else if (evoDetails.min_happiness) {
        method = `happiness-${evoDetails.min_happiness}`;
      }
    }
    
    const entry = {
      name: speciesName,
      method: evoDetails ? method : 'base',
      evolves_to: []
    };
    
    // Process next evolutions
    if (node.evolves_to && node.evolves_to.length > 0) {
      node.evolves_to.forEach(childNode => {
        parseNode(childNode, entry.evolves_to);
      });
    }
    
    currentEvolvesTo.push(entry);
  };
  
  if (chainData && chainData.chain) {
    parseNode(chainData.chain, evolutions);
  }
  
  return evolutions.length > 0 ? evolutions[0] : null;
};
