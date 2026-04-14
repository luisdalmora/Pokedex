const ProgressBar = ({ label, value, max = 255 }) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  const getColor = (val) => {
    if (val < 50) return '#f34444'; // Red
    if (val < 90) return '#ffdd57'; // Yellow
    return '#66bb6a'; // Green
  };

  return `
    <div class="stat-row">
      <span class="stat-label retro-font">${label}</span>
      <span class="stat-value retro-font">${value}</span>
      <div class="progress-bg">
        <div 
          class="progress-fill" 
          style="width: ${percentage}%; background-color: ${getColor(value)};"
        ></div>
      </div>
    </div>
  `;
};

export default ProgressBar;
