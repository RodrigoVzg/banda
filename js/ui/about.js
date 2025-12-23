export async function abrirPopupQuemSomos() {

    if (document.getElementById("popup-overlay")) return;

    const overlay = document.createElement("div");
    overlay.id = "popup-overlay";
    overlay.className = "popup-overlay";

    document.body.appendChild(overlay);

    try {
        const response = await fetch("/html/about.html");
        if (!response.ok) {
            throw new Error("Erro ao carregar popup");
        }

        overlay.innerHTML = await response.text();

        const fechar = () => overlay.remove();

        overlay.querySelector(".popup-close")
            .addEventListener("click", fechar);

        overlay.addEventListener("click", (e) => {
            if (e.target === overlay) fechar();
        });

    } catch (err) {
        overlay.remove();
        console.error("Falha ao carregar popup:", err);
    }
}
