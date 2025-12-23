import { carregarPagina } from "./navigation/ajax.js";
import {
    salvarQuantidadePessoas,
    salvarTrabalhoRemoto,
    salvarFrequenciaStreaming,
    salvarJogosOnline,
    salvarVideochamadas,
    salvarAtividadesImportantes,
    salvarDispositivosECriticidade,
    salvarMargemSeguranca
} from "./core/form.js";
import "./ui/ranges.js";
import { abrirPopupQuemSomos } from "./ui/about.js";

document.addEventListener("DOMContentLoaded", () => {
    document
        .getElementById("btn-quem-somos")
        .addEventListener("click", abrirPopupQuemSomos);
});

window.carregarPagina = carregarPagina;
window.salvarQuantidadePessoas = salvarQuantidadePessoas;
window.salvarTrabalhoRemoto = salvarTrabalhoRemoto;
window.salvarFrequenciaStreaming = salvarFrequenciaStreaming;
window.salvarJogosOnline = salvarJogosOnline;
window.salvarVideochamadas = salvarVideochamadas;
window.salvarAtividadesImportantes = salvarAtividadesImportantes;
window.salvarDispositivosECriticidade = salvarDispositivosECriticidade;
window.salvarMargemSeguranca = salvarMargemSeguranca;

document.addEventListener("DOMContentLoaded", () => {
    carregarPagina("analise");
});

