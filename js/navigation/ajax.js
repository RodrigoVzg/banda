export function carregarPagina(pagina, seletor = "#conteudo") {
    const container = document.querySelector(seletor);
    const xhr = new XMLHttpRequest();

    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                container.innerHTML = xhr.responseText;
                document.dispatchEvent(
                    new CustomEvent("ajaxContentLoaded", { detail: { pagina } })
                );
            } else {
                container.innerHTML = `<p style="color:red;">Erro ao carregar ${pagina}.html</p>`;
            }
        }
    };

    xhr.open("GET", `/html/${pagina}.html`, true);
    xhr.send();
}