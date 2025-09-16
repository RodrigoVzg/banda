//Abrir site com uma página carregada
document.addEventListener("DOMContentLoaded", () => {
    carregarPagina("inicio");
});

//carrossel
const slides = document.querySelectorAll(".slide");
let indice = 0;

document.querySelector(".proximo").addEventListener("click", () => {
    mudarSlide(indice + 1);
});

document.querySelector(".anterior").addEventListener("click", () => {
    mudarSlide(indice - 1);
});

function mudarSlide(novoIndice) {
    slides[indice].classList.remove("ativo");
    indice = (novoIndice + slides.length) % slides.length;
    slides[indice].classList.add("ativo");
    document.querySelector(".slides").style.transform = `translateX(-${indice * 100}%)`;
}
//Ajax
function carregarPagina (busca){
    let conteudoLocal = document.querySelector("#conteudo");
    let requisicao = new XMLHttpRequest();

    requisicao.onreadystatechange = () => {
        if (requisicao.readyState == 4 && requisicao.status == 200) {
            conteudoLocal.innerHTML = requisicao.response;
            if (busca == "calculadora"){
                inicializarSimulador(); 
            }
        }
    }

    requisicao.open('GET', `dinamic/html/${busca}.html`);
    requisicao.send();
}

//Calculadora
function inicializarSimulador() {
    const safetyInput = document.getElementById('safety');
    const safetyValue = document.getElementById('safety-value');

    if (!safetyInput || !safetyValue) return;


    safetyInput.addEventListener('input', () => {
        const val = safetyInput.value;
        safetyValue.textContent = `${val}%`;

        const percent = (val - safetyInput.min) / (safetyInput.max - safetyInput.min) * 100;
        safetyInput.style.setProperty('--value', `${percent}%`);
    });

    const form = document.getElementById('simulador');
    const resultadoMbps = document.getElementById('recom-mbps');
    const planosSugeridos = document.getElementById('planos-sugeridos');

    // Função para calcular Mbps
    function calcularMbps() {
        const tvCount = Number(document.getElementById('tv-count').value);
        const tvUsage = Number(document.querySelector('input[name="tv-usage"]:checked').value);

        const pcCount = Number(document.getElementById('pc-count').value);
        const pcUsage = Number(document.querySelector('input[name="pc-usage"]:checked').value);

        const phoneCount = Number(document.getElementById('phone-count').value);
        const phoneUsage = Number(document.querySelector('input[name="phone-usage"]:checked').value);

        const otherCount = Number(document.getElementById('other-count').value);
        const otherUsage = Number(document.querySelector('input[name="other-usage"]:checked').value);

        const safetyPercent = Number(safetyInput.value);

        let totalMbps =
            tvCount * tvUsage +
            pcCount * pcUsage +
            phoneCount * phoneUsage +
            otherCount * otherUsage;

            totalMbps *= 1 + safetyPercent / 100;
            return Math.ceil(totalMbps);
    }

    // Gera lista de planos compatíveis
    function gerarPlanos(minMbps) {
        const planos = [50, 100, 200, 500, 1000];
        return planos.filter(p => p >= minMbps);
    }

    // Evento do formulário
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const minMbps = calcularMbps();
        resultadoMbps.textContent = `${minMbps} Mbps`;

        const planos = gerarPlanos(minMbps);
        planosSugeridos.innerHTML = planos.length
        ? planos.map(p => `<li>${p} Mbps</li>`).join('')
        : '<li>Nenhum plano disponível</li>';
    });
}

//Limpar Formulario e resetar range
function resetSimulador() {
    const safetyInput = document.getElementById('safety');
    const safetyValue = document.getElementById('safety-value');
    const resultadoMbps = document.getElementById('recom-mbps');
    const planosSugeridos = document.getElementById('planos-sugeridos');

    if (!safetyInput || !safetyValue || !resultadoMbps || !planosSugeridos) return;

    const val = 20;
    safetyValue.textContent = `${val}%`;

    const percent = (val - safetyInput.min) / (safetyInput.max - safetyInput.min) * 100;
    safetyInput.style.setProperty('--value', `${percent}%`);

    resultadoMbps.textContent = '';
    planosSugeridos.innerHTML = '';
}