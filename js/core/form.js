import { carregarPagina } from "../navigation/ajax.js";

function toNumber(value) {
    if (!value) return 0;
    const cleaned = String(value).replace(/[^\d]/g, "");
    return cleaned ? Number(cleaned) : 0;
}

function obterDados() {
    return JSON.parse(sessionStorage.getItem("formulario")) || {};
}

function salvarCampo(nome, valor) {
    const dados = obterDados();
    dados[nome] = valor;
    sessionStorage.setItem("formulario", JSON.stringify(dados));
}

export function salvarQuantidadePessoas() {
    salvarCampo("pessoas", document.querySelector('input[name="pessoas"]:checked')?.value);
}

export function salvarTrabalhoRemoto() {
    salvarCampo("trabalhoRemoto", document.querySelector('input[name="trabalho"]:checked')?.value);
}

export function salvarFrequenciaStreaming() {
    salvarCampo("streaming", document.querySelector('input[name="streaming"]:checked')?.value);
}

export function salvarJogosOnline() {
    salvarCampo("jogos", document.querySelector('input[name="jogos"]:checked')?.value);
}

export function salvarVideochamadas() {
    salvarCampo("video", document.querySelector('input[name="video"]:checked')?.value);
}

export function salvarAtividadesImportantes() {
    const atividades = [...document.querySelectorAll('input[name="atividades[]"]:checked')].map(i => i.value);
    salvarCampo("atividades", atividades);
}

export function salvarDispositivosECriticidade() {
    salvarCampo("dispositivos", toNumber(document.getElementById("range-dispositivos")?.value));
    salvarCampo("criticidade", document.querySelector('input[name="criticidade"]:checked')?.value);
}

export function salvarMargemSeguranca() {
    salvarCampo("margem", toNumber(document.getElementById("range-margem")?.value));
    carregarPagina("resultado");
}

function calcularVelocidades(perfil) {
    let dl = 0;
    let ul = 0;

    if (perfil.pessoas === "1") { dl += 20; ul += 10; }
    else if (perfil.pessoas === "2-3") { dl += 50; ul += 20; }
    else if (perfil.pessoas === "4-5") { dl += 100; ul += 40; }
    else if (perfil.pessoas === "6+") { dl += 150; ul += 70; }

    if (perfil.streaming === "raramente") dl += 10;
    else if (perfil.streaming === "semanal") dl += 25;
    else if (perfil.streaming === "diario") dl += 50;
    else if (perfil.streaming === "intenso") dl += 80;

    if (perfil.jogos === "casuais") ul += 10;
    else if (perfil.jogos === "competitivos") ul += 35;

    if (perfil.video === "diario") { dl += 10; ul += 10; }
    else if (perfil.video === "multiplo") { dl += 50; ul += 50; }

    if (Array.isArray(perfil.atividades)) {
        const pesadas = ["redes", "backup", "download", "upload", "streaming4k", "smarthome", "ensino"];
        if (perfil.atividades.some(a => pesadas.includes(a))) {
            dl += 120;
            ul += 80;
        }
    }

    dl += (perfil.dispositivos || 0) * 10;
    ul += (perfil.dispositivos || 0) * 5;

    if (perfil.criticidade === "importante") { dl *= 1.15; ul *= 1.20; }
    else if (perfil.criticidade === "critico") { dl *= 1.40; ul *= 1.50; }

    const margem = perfil.margem || 0;
    dl *= (1 + margem / 100);
    ul *= (1 + margem / 100);

    dl = Math.max(50, Math.round(dl));
    ul = Math.max(20, Math.round(ul));

    let ping = 50;
    if (perfil.jogos === "competitivos") ping = 20;
    if (perfil.criticidade === "critico") ping = 15;

    return { download: dl, upload: ul, ping };
}

function preencherResultado() {
    const dados = obterDados();
    const v = calcularVelocidades(dados);

    document.getElementById("download-ideal").textContent = `${v.download} Mbps`;
    document.getElementById("upload-ideal").textContent = `${v.upload} Mbps`;
    document.getElementById("ping-ideal").textContent = `${v.ping} ms`;

    let perfilHTML = "";
    Object.entries(dados).forEach(([k, v]) => {
        if (v) perfilHTML += `<li>${k}: ${Array.isArray(v) ? v.join(", ") : v}</li>`;
    });
    document.getElementById("perfil-list").innerHTML = perfilHTML;

    const recs = [];
    if (v.download < 100) recs.push("Seu perfil permite planos de 100 Mbps.");
    else if (v.download < 300) recs.push("Planos entre 200–300 Mbps são ideais.");
    else recs.push("Perfis exigentes: considere 500 Mbps a 1 Gbps.");

    if (dados.streaming === "intenso") recs.push("Streaming intenso requer roteador 5 GHz.");
    if (dados.jogos === "competitivos") recs.push("Para jogos competitivos, use cabo sempre que possível.");
    if (dados.video === "multiplo") recs.push("Múltiplas videochamadas exigem upload alto.");

    document.getElementById("recs-list").innerHTML = recs.map(r => `<li>${r}</li>`).join("");
}

document.addEventListener("ajaxContentLoaded", e => {
    if (e.detail.pagina === "resultado") preencherResultado();
});