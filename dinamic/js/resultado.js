function toNumber(value) {
    if (!value) return 0;
    const cleaned = String(value).replace(/[^\d]/g, "");
    return cleaned ? Number(cleaned) : 0;
}

document.addEventListener("ajaxContentLoaded", e => {
    if (e.detail.pagina === "resultado") {
        preencherResultado();
    }
});


/* =========================================================
   CÁLCULO DE VELOCIDADES 
   ========================================================= */
    
function calcularVelocidades(perfil) {
    let dl = 0;
    let ul = 0;

    // Pessoas
    if (perfil.pessoas === "1") { dl += 20; ul += 10; }
    else if (perfil.pessoas === "2-3") { dl += 50; ul += 20; }
    else if (perfil.pessoas === "4-5") { dl += 100; ul += 40; }
    else if (perfil.pessoas === "6+") { dl += 150; ul += 70; }

    // Streaming
    if (perfil.streaming === "leve") { dl += 10; }
    else if (perfil.streaming === "moderado") { dl += 25; }
    else if (perfil.streaming === "intenso") { dl += 80; }

    // Jogos
    if (perfil.jogos === "casual") { ul += 10; }
    else if (perfil.jogos === "competitivos") { ul += 35; }

    // Videochamadas
    if (perfil.video === "simples") { dl += 10; ul += 10; }
    else if (perfil.video === "multiplo") { dl += 50; ul += 50; }

    // Atividades pesadas
    const atividadesPesadas = ["redes", "backup", "download", "upload", "streaming4k", "smarthome", "ensino"];
    if (atividadesPesadas.includes(perfil.atividades)) {
        dl += 120;
        ul += 80;
    }

    // Dispositivos
    dl += perfil.dispositivos * 10;
    ul += perfil.dispositivos * 5;

    // Criticidade
    if (perfil.criticidade === "alto") {
        dl *= 1.15;
        ul *= 1.20;
    }
    else if (perfil.criticidade === "critico") {
        dl *= 1.40;
        ul *= 1.50;
    }

    // Margem extra
    const margem = perfil.margem ? parseFloat(perfil.margem) : 0;
    dl *= (1 + margem / 100);
    ul *= (1 + margem / 100);

    // Limites mínimos 
    dl = Math.max(50, Math.round(dl));
    ul = Math.max(20, Math.round(ul));

    // Ping ideal
    let ping = 50;
    if (perfil.jogos === "competitivos") ping = 20;
    if (perfil.criticidade === "critico") ping = 15;

    return { download: dl, upload: ul, ping };
}


/* =========================================================
   PREENCHER RESULTADO
   ========================================================= */
function preencherResultado() {

    const dados = JSON.parse(sessionStorage.getItem("formulario")) || {};

    const velocidades = calcularVelocidades(dados);

    // Exibe velocidades
    document.getElementById("download-ideal").textContent =
        velocidades.download + " Mbps";

    document.getElementById("upload-ideal").textContent =
        velocidades.upload + " Mbps";

    document.getElementById("ping-ideal").textContent =
        velocidades.ping + " ms";

    // PERFIL
    let perfilHTML = "";
    if (dados.pessoas) perfilHTML += `<li>Pessoas: ${dados.pessoas}</li>`;
    if (dados.streaming) perfilHTML += `<li>Streaming: ${dados.streaming}</li>`;
    if (dados.jogos) perfilHTML += `<li>Jogos: ${dados.jogos}</li>`;
    if (dados.video) perfilHTML += `<li>Videochamadas: ${dados.video}</li>`;
    if (dados.atividades) perfilHTML += `<li>Atividades: ${dados.atividades.join(", ")}</li>`;
    if (dados.dispositivos) perfilHTML += `<li>Dispositivos: ${dados.dispositivos}</li>`;
    if (dados.criticidade) perfilHTML += `<li>Criticidade: ${dados.criticidade}</li>`;
    if (dados.margem) perfilHTML += `<li>Margem extra: ${dados.margem}%</li>`;

    document.getElementById("perfil-list").innerHTML = perfilHTML;


    /* =========================================================
       RECOMENDAÇÕES 
       ========================================================= */
    const recs = [];

    if (velocidades.download < 100)
        recs.push("Seu perfil permite planos de 100 Mbps.");
    else if (velocidades.download < 300)
        recs.push("Planos entre 200–300 Mbps são ideais.");
    else
        recs.push("Perfis exigentes: considere 500 Mbps a 1 Gbps.");

    if (dados.streaming === "intenso")
        recs.push("Streaming intenso requer roteador 5 GHz.");

    if (dados.jogos === "competitivos")
        recs.push("Para jogos competitivos, use cabo sempre que possível.");

    if (dados.video === "multiplo")
        recs.push("Múltiplas videochamadas exigem upload alto e estável.");

    document.getElementById("recs-list").innerHTML =
        recs.map(r => `<li>${r}</li>`).join("");


    /* =========================================================
       DICAS 
       ========================================================= */


    ul.innerHTML = "";

    // 1. adiciona dicas fixas
    dicasFixas.forEach(d => {
        const li = document.createElement("li");
        li.textContent = d;
        ul.appendChild(li);
    });

    // 2. adiciona dicas personalizadas, com base nos dados do formulário
    adicionarDicas(dados, ul);
}
function adicionarDicas(perfil, lista) {


    const dicasExtras = [];

    // Streaming
    if (perfil.streaming === "intenso") {
        dicasExtras.push("Use cabo ou Wi-Fi 5 GHz para streaming em 4K");
        dicasExtras.push("Evite roteadores antigos (2.4 GHz apenas)");
    }

    // Jogos
    if (perfil.jogos === "competitivos") {
        dicasExtras.push("Ative QoS no roteador para priorizar jogos online");
        dicasExtras.push("Use conexão cabeada para reduzir latência");
        dicasExtras.push("Evite uso intenso da rede enquanto joga");
    }

    // Videochamada
    if (perfil.video === "multiplo") {
        dicasExtras.push("Prefira upload acima de 100 Mbps para muitas chamadas simultâneas");
        dicasExtras.push("Feche abas e apps que usam banda durante reuniões");
    }

    // Atividades pesadas
    if (perfil.atividades && perfil.atividades.includes("backup")) {
        dicasExtras.push("Agende backups pesados para horários fora do pico");
        dicasExtras.push("Use compressão ou upload incremental quando possível");
    }

    if (perfil.atividades && perfil.atividades.includes("download")) {
        dicasExtras.push("Prefira baixar arquivos grandes em horários de pouca movimentação");
    }

    if (perfil.atividades && perfil.atividades.includes("upload")) {
        dicasExtras.push("Use cabos de rede para uploads longos");
        dicasExtras.push("Verifique se há limitações de upload no roteador (QoS mal configurado)");
    }

    if (perfil.atividades && perfil.atividades.includes("smarthome")) {
        dicasExtras.push("Separe dispositivos IoT em uma rede 2.4GHz dedicada");
        dicasExtras.push("Use nomes diferentes para redes 2.4 GHz e 5 GHz");
    }

    // Criticidade alta
    if (perfil.criticidade === "critico") {
        dicasExtras.push("Use um roteador Wi-Fi 6 ou superior");
        dicasExtras.push("Tenha um segundo link como redundância (4G/5G)");
        dicasExtras.push("Configure failover automático");
    }

    // Dispositivos
    if (perfil.dispositivos > 10) {
        dicasExtras.push("Divida a rede entre banda 2.4 GHz e 5 GHz para evitar congestionamento");
        dicasExtras.push("Desconecte dispositivos que não estão sendo usados");
    }

    // Pessoas
    if (perfil.pessoas === "6+") {
        dicasExtras.push("Use um roteador que suporte MU-MIMO para múltiplos usuários simultâneos");
        dicasExtras.push("Considere instalar um segundo ponto de acesso");
    }

    dicasExtras.forEach(d => {
        const li = document.createElement("li");
        li.textContent = d;
        lista.appendChild(li);
    });
}
