# 🔴 Pokédex Web App

Uma Pokédex completa, moderna e interativa desenvolvida inteiramente com **JavaScript Puro (Vanilla JS)**, sem o uso de frameworks. Este projeto nasceu com o objetivo de oferecer uma experiência premium autêntica, misturando o charme das gerações retro de Pokémon com a fluidez de interfaces web modernas e dinâmicas.

A aplicação consome a [PokéAPI](https://pokeapi.co/) clássica para extração dos dados e provê suporte robusto a multi-gerações.

---

## 🌟 Principais Funcionalidades

- **Design Premium e Dinâmico:** Interface totalmente customizada com temas dinâmicos (Claro e Escuro), fontes modernas, micro-interações e cores sólidas baseadas na tipagem natural de cada Pokémon.
- **Renderização e Performance:** Arquitetura *Single Page Application* (SPA) otimizada através de separação por *views* (importações dinâmicas). Rolagem infinita (*Infy-scroll*) e *Lazy Loading* garantem que centenas de elementos sejam carregados na tela sem travamentos.
- **Detalhes Profundos:** Visualização minuciosa dos Pokémon incluindo seus stats base em barras animadas, descrição na Pokédex totalmente traduzida para Português (PT-BR), formas alternativas dinâmicas e árvore de evolução ricamente ilustrada informando os exatos métodos evolutivos.
- **Sistema de Jogos e Regiões:** Explore não apenas a lista tradicional da Pokédex, mas separe sua navegação por versões do jogo (Kanto, Johto, Hoenn...) e descubra rapidamente as equipes específicas de cara um dos grandes **Líderes de Ginásio**.
- **Minigame "Quem é esse Pokémon?":** Teste seus conhecimentos do mundo das monstrinhos com um sistema de quiz aleatório em formato de silhuetas integrado à Pokédex.
- **Favoritos e Filtros Avançados:** Salve seus parceiros prediletos diretamente no cache do seu navegador e realize buscas poderosas baseadas em nome, ID ou tipagem.

## 🛠 Arquitetura e Tecnologias

A antiga infraestrutura baseada em React/Vite foi removida em decorrência da **refatoração e migração por completo para Vanilla JavaScript**. As responsabilidades agora estão divididas sistematicamente para melhor isolamento e manutenibilidade:

- **HTML5 e CSS3 Vanilla:** Foco forte no uso de **CSS Custom Properties (Variáveis)** em `/css/style.css` para lidar com dark/light modes e *Color Coding* das tipagens, mantendo uma fundação sólida de Layout em Flexbox e Grid.
- **ES6 Modules:** Funcionalidades de interface como `/js/views/pokemonDetail.js` e `/js/views/home.js` são importadas sob demanda pelo roteador minimalista implementado no `app.js`.
- **Roteamento Dinâmico Mínimo:** Baseado em Hash Fragments (`window.location.hash`), permitindo histórico consistente (`#/, #/pokemon/charizard, #/quiz`).
- **Nenhum Sistema de Build Frontend Necessário!** Não há Webpack, Babel, ou Vite. É plugar no servidor e jogar!

## 📦 Estrutura de Arquivos

```text
/
├── css/
│   └── style.css            # Estilos centralizados e design system
├── src/
│   └── data/                # Bases de dados manuais (Líderes de ginásio, fallback de evos e gerações)
├── js/
│   ├── api.js               # Wrapper da API (PokéAPI) e rotinas de requisição/cache.
│   ├── app.js               # Roteador principal e gerenciador global.
│   ├── events.js            # Gerenciamento de rolagem infinita, filtragem e listeners.
│   ├── render.js            # Lógicas de renderização de cards e micro-componentes.
│   ├── state.js             # Objeto central com estado reativo e Cache LocalStorage.
│   ├── translations.js      # Helpers para tradução En -> PT-BR de atributos e tipos.
│   └── views/               # Telas dinamicamente carregadas.
│       ├── home.js
│       ├── pokemonDetail.js
│       ├── gameDetail.js
│       ├── games.js
│       └── quiz.js
├── index.html               # Arquivo raiz do projeto.
```

## 🚀 Como Executar Localmente

Sendo agora uma aplicação JavaScript puramente nativa, ela não precisa de dependências via NPM para funcionar. No entanto, o navegador bloqueia execuções baseadas no protocolo `file://` que contenham `import/export`.

Portanto, só é preciso **executá-la usando um servidor estático**:

### Opção 1: Via extensões do VS Code (Recomendado)
- Instale a extensão do `Live Server`.
- Abra o arquivo `index.html`.
- Clique no ícone de "Go Live" na barra inferior direita do editor.

### Opção 2: Via XAMPP / Apache / Nginx
- Se você já dispõe de um servidor (como seu diretório atual possivelmente é `C:\xampp\htdocs\Pokedex`), basta ligar o módulo **Apache**.
- Acessar `http://localhost/Pokedex` no seu browser moderno (Chrome, Edge ou Firefox).

### Opção 3: Usando Python
Se tiver o Python no computador, rode no terminal na raiz do projeto:
\`\`\`bash
python -m http.server 8000
\`\`\`
Acesse: `http://localhost:8000/`

---
*Desenvolvido com foco na estética impecável e modularização robusta.*
