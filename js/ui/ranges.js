export function inicializarRanges() {
    const ranges = [
        { id: "range-dispositivos", label: "val-dispositivos", sufixo: " dispositivos" },
        { id: "range-margem", label: "val-margem", sufixo: "%" }
    ];

    ranges.forEach(r => {
        const input = document.getElementById(r.id);
        const label = document.getElementById(r.label);
        if (!input || !label) return;

        const atualizar = () => {
            label.textContent = input.value + r.sufixo;
            const pct = (input.value - input.min) / (input.max - input.min) * 100;
            input.style.background =
                `linear-gradient(to right, #007bff ${pct}%, #ddd ${pct}%)`;
        };

        atualizar();
        input.addEventListener("input", atualizar);
    });
}

document.addEventListener("ajaxContentLoaded", inicializarRanges);