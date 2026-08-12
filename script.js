// ==========================================
// ECOCOLETA - SISTEMA DE RECICLAGEM
// ==========================================

const form = document.getElementById("ecoForm");

const materialInput = document.getElementById("material");
const quantidadeInput = document.getElementById("quantidade");
const pontoInput = document.getElementById("ponto");

const message = document.getElementById("message");

const totalKgElement = document.getElementById("totalKg");
const totalPointsElement = document.getElementById("totalPoints");
const totalColetasElement = document.getElementById("totalColetas");
const treesElement = document.getElementById("trees");

const heroKgElement = document.getElementById("heroKg");
const heroPointsElement = document.getElementById("heroPoints");

const historyBody = document.getElementById("historyBody");
const emptyHistory = document.getElementById("emptyHistory");

const clearDataButton = document.getElementById("clearData");


// ==========================================
// CONFIGURAÇÃO DE PONTOS
// ==========================================

// Cada kg de material gera uma quantidade diferente de pontos.
const pontosPorMaterial = {
    "Plástico": 10,
    "Papel": 8,
    "Vidro": 7,
    "Metal": 12,
    "Eletrônico": 20
};


// ==========================================
// CARREGAR DADOS
// ==========================================

let registros = JSON.parse(
    localStorage.getItem("ecocoleta_registros")
) || [];


// ==========================================
// FORMATAÇÃO
// ==========================================

function formatarNumero(numero) {
    return Number(numero).toLocaleString("pt-BR", {
        maximumFractionDigits: 1
    });
}


// ==========================================
// ATUALIZAR DASHBOARD
// ==========================================

function atualizarDashboard() {

    const totalKg = registros.reduce(
        (total, registro) => total + Number(registro.quantidade),
        0
    );

    const totalPontos = registros.reduce(
        (total, registro) => total + Number(registro.pontos),
        0
    );

    const totalColetas = registros.length;

    /*
        Estimativa visual:
        a cada 20 kg reciclados = 1 árvore equivalente.
    */
    const arvores = Math.floor(totalKg / 20);

    totalKgElement.textContent = `${formatarNumero(totalKg)} kg`;

    totalPointsElement.textContent =
        totalPontos.toLocaleString("pt-BR");

    totalColetasElement.textContent =
        totalColetas.toLocaleString("pt-BR");

    treesElement.textContent =
        arvores.toLocaleString("pt-BR");

    heroKgElement.textContent =
        formatarNumero(totalKg);

    heroPointsElement.textContent =
        totalPontos.toLocaleString("pt-BR");
}


// ==========================================
// ATUALIZAR HISTÓRICO
// ==========================================

function atualizarHistorico() {

    historyBody.innerHTML = "";

    if (registros.length === 0) {
        emptyHistory.style.display = "block";
        return;
    }

    emptyHistory.style.display = "none";

    // Mostra primeiro os registros mais recentes.
    const registrosOrdenados = [...registros].reverse();

    registrosOrdenados.forEach((registro) => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${registro.material}</td>

            <td>
                ${formatarNumero(registro.quantidade)} kg
            </td>

            <td>
                ${registro.ponto}
            </td>

            <td>
                +${registro.pontos} pts
            </td>
        `;

        historyBody.appendChild(row);
    });
}


// ==========================================
// SALVAR DADOS
// ==========================================

function salvarDados() {

    localStorage.setItem(
        "ecocoleta_registros",
        JSON.stringify(registros)
    );
}


// ==========================================
// EXIBIR MENSAGEM
// ==========================================

function mostrarMensagem(texto, tipo) {

    message.textContent = texto;

    message.className = "message";

    if (tipo) {
        message.classList.add(tipo);
    }

    setTimeout(() => {
        message.textContent = "";
        message.className = "message";
    }, 3500);
}


// ==========================================
// REGISTRAR RECICLAGEM
// ==========================================

form.addEventListener("submit", function (event) {

    event.preventDefault();

    const material = materialInput.value;
    const quantidade = Number(quantidadeInput.value);
    const ponto = pontoInput.value;

    // Validação
    if (!material || !quantidade || !ponto) {

        mostrarMensagem(
            "Preencha todos os campos.",
            "error"
        );

        return;
    }

    if (quantidade <= 0) {

        mostrarMensagem(
            "Informe uma quantidade maior que zero.",
            "error"
        );

        return;
    }


    // Calcula os pontos
    const pontosBase = pontosPorMaterial[material];

    const pontos = Math.round(
        quantidade * pontosBase
    );


    // Cria o registro
    const novoRegistro = {

        id: Date.now(),

        material: material,

        quantidade: quantidade,

        ponto: ponto,

        pontos: pontos,

        data: new Date().toISOString()

    };


    // Adiciona ao array
    registros.push(novoRegistro);


    // Salva no navegador
    salvarDados();


    // Atualiza a interface
    atualizarDashboard();
    atualizarHistorico();


    // Mensagem
    mostrarMensagem(
        `Reciclagem registrada! Você ganhou ${pontos} pontos. 🌱`,
        "success"
    );


    // Limpa formulário
    form.reset();

});


// ==========================================
// LIMPAR HISTÓRICO
// ==========================================

clearDataButton.addEventListener("click", function () {

    if (registros.length === 0) {

        mostrarMensagem(
            "Não há registros para apagar.",
            "error"
        );

        return;
    }


    const confirmar = confirm(
        "Tem certeza que deseja apagar todo o histórico?"
    );


    if (!confirmar) {
        return;
    }


    registros = [];

    salvarDados();

    atualizarDashboard();
    atualizarHistorico();

    mostrarMensagem(
        "Histórico apagado com sucesso.",
        "success"
    );

});


// ==========================================
// INICIALIZAÇÃO
// ==========================================

atualizarDashboard();

atualizarHistorico();