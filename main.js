const facts = [
  {
    title: "A Especiaria",
    description: "A canela é uma das especiarias mais antigas conhecidas pelo homem. Era tão valiosa na antiguidade que chegava a ser mais preciosa que o ouro! Ela é extraída da casca interna de árvores do gênero Cinnamomum.",
    image: "./stick.png",
    url: "https://pt.wikipedia.org/wiki/Canela"
  },
  {
    title: "Cidade de Canela - RS",
    description: "Canela é um famoso município turístico da Serra Gaúcha no Brasil. Curiosamente, seu nome não vem da especiaria, mas de uma antiga árvore 'caneleira' que ficava no centro e servia de ponto de encontro para tropeiros.",
    image: "./city.png",
    url: "https://pt.wikipedia.org/wiki/Canela_(Rio_Grande_do_Sul)"
  },
  {
    title: "Magia e Misticismo",
    description: "Na cultura popular e misticismo, a canela é frequentemente associada à atração de prosperidade, sucesso e amor. Soprar canela na porta de casa no primeiro dia do mês é uma simpatia muito comum no Brasil!",
    image: "./magical.png",
    url: "https://pt.wikipedia.org/wiki/Canela#Usos_e_cren%C3%A7as"
  },
  {
    title: "Canela vs Cássia",
    description: "Você sabia que a maior parte da 'canela' em pó vendida no supermercado é, na verdade, Cássia? A canela verdadeira (Cinnamomum verum) é mais doce e quebradiça, originária do Sri Lanka.",
    image: "./stick.png",
    url: "https://pt.wikipedia.org/wiki/Canela#Canela-verdadeira_e_a_c%C3%A1ssia"
  },
  {
    title: "Povo Canela",
    description: "Os Canelas são um grupo indígena brasileiro do estado do Maranhão, pertencentes à família linguística jê. Eles se subdividem em grupos como os Ramkokamekrá e Apaniekrá.",
    image: "./magical.png",
    url: "https://pt.wikipedia.org/wiki/Canelas_(povos_ind%C3%ADgenas)"
  }
];

// Elementos do DOM
const canelaImage = document.getElementById('canela-image');
const factTitle = document.getElementById('fact-title');
const factDesc = document.getElementById('fact-desc');
const factSource = document.getElementById('fact-source');
const canelaBtn = document.getElementById('canela-btn');
const themeToggle = document.getElementById('theme-toggle');
const factCard = document.querySelector('.fact-card');
const counterValue = document.getElementById('click-counter');
const globalCounterValue = document.getElementById('global-counter');

// Estado
let currentFactIndex = -1;
let clickCount = parseInt(localStorage.getItem('clicanela_count') || '0', 10);
let globalClickCount = 0;

// Atualiza o contador global na tela buscando da API
async function fetchGlobalCount() {
  try {
    // cache: 'no-store' ensures we always fetch the real-time value and not a browser cached response
    const res = await fetch('https://api.counterapi.dev/v1/clicanela/global_clicks', { cache: 'no-store' });
    const data = await res.json();
    if (data && data.count !== undefined) {
      globalClickCount = data.count;
      globalCounterValue.innerText = globalClickCount;
    }
  } catch (error) {
    console.error("Erro ao buscar contador global:", error);
    globalCounterValue.innerText = "Error";
  }
}

// Incrementa o contador global de forma transparente
async function incrementGlobalCount() {
  // Otimista: já atualiza a UI localmente antes da resposta
  globalClickCount++;
  globalCounterValue.innerText = globalClickCount;
  
  // Envia em background
  fetch('https://api.counterapi.dev/v1/clicanela/global_clicks/up', { cache: 'no-store' })
    .then(r => r.json())
    .then(data => {
      // Corrige se houver descompasso (alguém clicou ao mesmo tempo)
      if (data && data.count) {
        globalClickCount = data.count;
        globalCounterValue.innerText = globalClickCount;
      }
    })
    .catch(err => console.error("Erro ao incrementar contador global:", err));
}

// Atualiza o contador na tela
function updateCounter() {
  counterValue.innerText = clickCount;
}

// Lógica de Randomizar Canela
function renderRandomCanela() {
  // Esconde o card para animar
  factCard.classList.add('hide');
  canelaImage.style.opacity = '0';

  setTimeout(() => {
    let nextIndex;
    // Garante que não repita o mesmo fato seguidamente
    do {
      nextIndex = Math.floor(Math.random() * facts.length);
    } while (nextIndex === currentFactIndex && facts.length > 1);

    currentFactIndex = nextIndex;
    const fact = facts[nextIndex];

    // Atualiza conteúdo
    canelaImage.src = fact.image;
    factTitle.innerText = fact.title;
    factDesc.innerText = fact.description;
    factSource.href = fact.url;

    // Mostra novamente com animação
    canelaImage.style.opacity = '1';
    factCard.classList.remove('hide');
  }, 300); // tempo de espera da transição CSS
}

// Clique na Canela
canelaBtn.addEventListener('click', () => {
  clickCount++;
  localStorage.setItem('clicanela_count', clickCount.toString());
  updateCounter();
  
  // Atualiza o contador mundial de forma assíncrona
  incrementGlobalCount();

  renderRandomCanela();
});

// Acessibilidade no botão (tecla Enter ou Espaço)
canelaBtn.addEventListener('keypress', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    canelaBtn.click();
  }
});

// Lógica do Theme Toggle
function initTheme() {
  // Verifica preferência salva ou do sistema
  const savedTheme = localStorage.getItem('clicanela_theme');
  const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', initialTheme);
  updateThemeIcon(initialTheme);
}

function updateThemeIcon(theme) {
  themeToggle.innerText = theme === 'dark' ? '☀️' : '🌙';
}

themeToggle.addEventListener('click', () => {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('clicanela_theme', newTheme);
  updateThemeIcon(newTheme);
});

// Inicialização
updateCounter();
initTheme();
renderRandomCanela();
fetchGlobalCount();

// Lógica do Cookie Modal (LGPD)
const cookieOverlay = document.getElementById('cookie-overlay');
const acceptCookiesBtn = document.getElementById('accept-cookies');
const rejectCookiesBtn = document.getElementById('reject-cookies');

function initCookieBanner() {
  const hasAccepted = localStorage.getItem('clicanela_cookies_accepted');
  if (!hasAccepted) {
    // Mostra o modal se não aceitou ainda e bloqueia o scroll
    document.body.style.overflow = 'hidden';
    cookieOverlay.classList.remove('hide');
  }
}

acceptCookiesBtn.addEventListener('click', () => {
  localStorage.setItem('clicanela_cookies_accepted', 'true');
  cookieOverlay.classList.add('hide');
  document.body.style.overflow = '';
});

rejectCookiesBtn.addEventListener('click', () => {
  window.location.href = "https://www.google.com/search?q=Onde+posso+encontrar+canela%3F";
});

initCookieBanner();
