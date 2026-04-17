import { fetchPokemonDetails } from '../services/api.js';
import { getSprite } from '../utils/helpers.js';
import { renderNav } from '../components/Nav.js';

const state = { quiz: null };

export const renderQuizView = async (container) => {
  container.innerHTML = '<div class="loading-state">Preparando o Quiz...</div>';

  if (!state.quiz) {
    state.quiz = { current: null, score: 0, guessed: false };
  }

  const loadNewPokemon = async () => {
    state.quiz.guessed = false;
    const randomId = Math.floor(Math.random() * 898) + 1; // generation 1 to 8 to avoid forms/errors from 9+ if incomplete arts
    try {
      const pokemon = await fetchPokemonDetails(randomId);
      if(!pokemon) throw new Error("Not found");
      state.quiz.current = pokemon;
      renderQuizUI();
    } catch(e) {
       loadNewPokemon();
    }
  };

  const renderQuizUI = () => {
    if(!state.quiz.current) return;
    
    const sprite = getSprite(state.quiz.current);
    
    container.innerHTML = `
      ${renderNav('/quiz')}

      <div class="animate-fade container" style="margin-top: 40px; background: var(--card-bg); border-radius: 20px; padding: 40px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); text-align: center; max-width: 600px;">
        
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; border-bottom: 2px solid var(--border-color); padding-bottom: 10px;">
          <h2 style="font-size: 2rem; font-weight: 800; display: flex; align-items: center; gap: 10px;"><span style="font-size: 1.8rem;">🤔</span> Quem é esse Pokémon?</h2>
          <div style="background: #ef4444; color: white; padding: 5px 15px; border-radius: 20px; font-weight: bold; font-size: 1.2rem;">
            Pontos: <span id="quiz-score">${state.quiz.score}</span>
          </div>
        </div>

        <div style="margin: 30px auto; width: 250px; height: 250px; display: flex; justify-content: center; align-items: center; position: relative;">
          <!-- Fundos ou efeitos podem entrar aqui -->
          <img id="quiz-sprite" src="${sprite}" style="max-width: 100%; max-height: 100%; object-fit: contain; filter: brightness(0); pointer-events: none; transition: filter 1s ease-in-out;" />
        </div>

        <div id="quiz-controls" style="display: flex; flex-direction: column; gap: 15px; max-width: 400px; margin: 0 auto;">
          <input type="text" id="quiz-guess" class="search-input" placeholder="Digite o nome do Pokémon..." style="width: 100%; text-align: center; font-size: 1.2rem;" autocomplete="off" />
          <button id="quiz-submit" class="load-more" style="width: 100%;">Adivinhar</button>
        </div>

        <div id="quiz-result" style="margin-top: 20px; font-size: 1.2rem; font-weight: bold; min-height: 30px;"></div>
        <button id="quiz-next" class="load-more" style="display: none; width: 100%; max-width: 400px; margin: 20px auto 0 auto; background: var(--type-color-grass);">Próximo Pokémon</button>
      </div>
    `;

    const input = document.getElementById('quiz-guess');
    const submitBtn = document.getElementById('quiz-submit');
    const nextBtn = document.getElementById('quiz-next');
    const resultDiv = document.getElementById('quiz-result');
    const imgObj = document.getElementById('quiz-sprite');

    const handleGuess = () => {
      if(state.quiz.guessed) return;
      const guess = input.value.trim().toLowerCase();
      const realName = state.quiz.current.name.toLowerCase();
      
      state.quiz.guessed = true;
      imgObj.style.filter = "drop-shadow(0 10px 15px rgba(0,0,0,0.3))"; // Remove silhouette
      
      if(guess === realName || realName.includes(guess) && guess.length > 3) {
        state.quiz.score++;
        document.getElementById('quiz-score').textContent = state.quiz.score;
        resultDiv.innerHTML = `<span style="color: #4ade80;">Acertou! É o ${state.quiz.current.name}!</span>`;
      } else {
        state.quiz.score = 0; // Reseta na falha
        document.getElementById('quiz-score').textContent = state.quiz.score;
        resultDiv.innerHTML = `<span style="color: #ef4444;">Errou! Era o ${state.quiz.current.name}. A pontuação foi zerada.</span>`;
      }
      
      submitBtn.style.display = 'none';
      input.disabled = true;
      nextBtn.style.display = 'block';
    };

    submitBtn.addEventListener('click', handleGuess);
    input.addEventListener('keypress', (e) => {
      if(e.key === 'Enter') handleGuess();
    });

    nextBtn.addEventListener('click', () => {
      container.innerHTML = '<div class="loading-state">Buscando próximo Pokémon...</div>';
      loadNewPokemon();
    });
    
    // Auto focus
    setTimeout(() => { if(input) input.focus(); }, 100);
  };

  if(!state.quiz.current) {
    await loadNewPokemon();
  } else {
    renderQuizUI();
  }

};
