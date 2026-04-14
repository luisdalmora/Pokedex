const ImageWithFallback = ({ src, alt, className = '', fallbackText = 'Imagem não encontrada' }) => {
  const fallbackHtml = `<div class='img-fallback ${className}'><span class='retro-font text-xs'>${fallbackText}</span></div>`;
  const encodedFallback = fallbackHtml.replace(/'/g, "&apos;").replace(/"/g, "&quot;");

  return `
    <img 
      src="${src}" 
      alt="${alt}" 
      class="retro-border-img ${className}" 
      onerror="this.outerHTML='${encodedFallback}';"
    />
  `;
};

export default ImageWithFallback;
