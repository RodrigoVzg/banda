document.addEventListener("DOMContentLoaded", () => {
    carregarPagina("analise");
});

let paginaAtual = "";

function carregarPagina(pagina, seletor = "#conteudo") {
    paginaAtual = pagina;

    const conteudoLocal = document.querySelector(seletor);
    const xhr = new XMLHttpRequest();

    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {

                conteudoLocal.innerHTML = xhr.responseText;

                // Dispara evento para JS internos
                document.dispatchEvent(new CustomEvent("ajaxContentLoaded", {
                    detail: { pagina }
                }));
            } else {
                conteudoLocal.innerHTML = `<p style="color:red;">Erro ao carregar ${pagina}.html</p>`;
            }
        }
    };

    xhr.open("GET", `dinamic/html/${pagina}.html`, true);
    xhr.send();
}


// =====================================
//  SALVAR DADOS NO sessionStorage
// =====================================

function salvarCampo(nomeCampo, valor) {
    let dados = JSON.parse(sessionStorage.getItem("formulario")) || {};
    dados[nomeCampo] = valor;
    sessionStorage.setItem("formulario", JSON.stringify(dados));
}


// ========== Funções chamadas nos botões ==========
function salvarQuantidadePessoas() {
    salvarCampo("pessoas", document.querySelector('input[name="pessoas"]:checked')?.value);
}

function salvarTrabalhoRemoto() {
    salvarCampo("trabalhoRemoto", document.querySelector('input[name="trabalho"]:checked')?.value);
}

function salvarFrequenciaStreaming() {
    salvarCampo("streaming", document.querySelector('input[name="streaming"]:checked')?.value);
}

function salvarJogosOnline() {
    salvarCampo("jogos", document.querySelector('input[name="jogos"]:checked')?.value);
}

function salvarVideochamadas() {
    salvarCampo("video", document.querySelector('input[name="video"]:checked')?.value);
}

function salvarAtividadesImportantes() {
    const atividades = [...document.querySelectorAll('input[name="atividades[]"]:checked')].map(i => i.value);
    salvarCampo("atividades", atividades);
}

function salvarDispositivosECriticidade() {
    salvarCampo("dispositivos", document.getElementById("range-dispositivos").value);
    salvarCampo("criticidade", document.querySelector('input[name="criticidade"]:checked')?.value);
}

function salvarMargemSeguranca() {
    salvarCampo("margem", document.getElementById("range-margem").value);
    carregarPagina("resultado");
}


// =====================================
//  CONTROLES DE RANGE
// =====================================
function inicializarRanges() {
    const ranges = [
        { id: "range-dispositivos", label: "val-dispositivos", sufixo: " dispositivos" },
        { id: "range-margem",       label: "val-margem",       sufixo: "%" }
    ];

    ranges.forEach(r => {
        const input = document.getElementById(r.id);
        const label = document.getElementById(r.label);
        if (!input || !label) return;

        const atualizar = () => {
            label.textContent = input.value + r.sufixo;

            const pct = (input.value - input.min) / (input.max - input.min) * 100;
            input.style.background = `linear-gradient(to right, #007bff ${pct}%, #ddd ${pct}%)`;
        };

        atualizar();
        input.addEventListener("input", atualizar);
    });
}

document.addEventListener("ajaxContentLoaded", inicializarRanges);