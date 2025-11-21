let cardContainer = document.querySelector('.card-container'); // seleciona o container onde os cards serão inseridos

let dados = []; // armazena os dados carregados do arquivo JSON

// Função que remove acentos, diacríticos e converte para minúsculas para a busca
function normalizarTexto(texto) {
    if (!texto) return ""; // Se não tiver texto, retorna vazio
    return texto
        .normalize('NFD')                // Separa o acento da letra (ex: 'á' vira 'a' + '´')
        .replace(/[\u0300-\u036f]/g, "") // Apaga os acentos
        .toLowerCase();                  // Deixa tudo minúsculo
}

// função principal que busca dados e filtra com base no termo do input
async function iniciarBusca() {
    const input = document.querySelector('input[type="text"]');
    
    const termo = input ? normalizarTexto(input.value) : '';     // Usa a função normalizarTexto para limpar o que a pessoa digitou

    if (dados.length === 0) {  // carrega os dados do arquivo apenas uma vez
        try {
            const resposta = await fetch('data.json');
            dados = await resposta.json();
        } catch (error) {
            console.error("Erro ao carregar o JSON:", error);
            return;
        }
    }

    let resultados = dados; // Se o termo estiver vazio, retorna todos os dados (lista completa)
    if (termo) {
        resultados = dados.filter(d => {
            // Limpamos os dados do JSON antes de comparar
            const nome = normalizarTexto(d.nome);
            const descricao = normalizarTexto(d.descricao);
            const tipo = normalizarTexto(d.tipo); 
            const curiosidade = normalizarTexto(d.curiosidade);
            
            return ( // devolve true se qualquer campo contiver o termo pesquisado
                nome.includes(termo) ||
                descricao.includes(termo) ||
                tipo.includes(termo) ||
                curiosidade.includes(termo)
            );
        });
    }

    // renderiza os cards com os resultados obtidos
    // Passamos input.value para usar o texto original na mensagem de erro
    renderizarCards(resultados, input.value); 
}

// função que monta e insere os cards no DOM
function renderizarCards(dados, termoOriginal = '') {
    cardContainer.innerHTML = '';

    if (!dados || dados.length === 0) {
        const article = document.createElement('article');
        article.classList.add('card');
        article.innerHTML = `
            <div style="text-align:center; padding: 2rem;">
                <h2>Nenhum item encontrado</h2>
                <p>Não encontramos nada para "${termoOriginal}". Tente buscar por palavras-chave simples (ex: vidro, oleo, pilha).</p>
            </div>
        `;
        cardContainer.appendChild(article);
        return;
    }

    for (const dado of dados) {
        const article = document.createElement('article');
        article.classList.add('card');
        
        const linkHtml = dado.link ? `<a href="${dado.link}" target="_blank">Como descartar</a>` : ''; // Cria o link condicionalmente. Só aparece se dado.link existir

        // Monta o card
        article.innerHTML = `
                <h2>${dado.nome}</h2>
                <p><strong>Tipo: </strong>${dado.tipo}</p>
                <p>${dado.descricao}</p>
                <p><strong>Curiosidade: </strong>${dado.curiosidade}</p>
                ${linkHtml}
                `
        cardContainer.appendChild(article);
    }
}
// Estrutura de busca
document.addEventListener('DOMContentLoaded', () => {
    
    iniciarBusca();  //1. Inicia a busca (carrega e exibe todos os cards na abertura)

    const inputBusca = document.querySelector('input[type="text"]');
    
    if (inputBusca) {
 
        inputBusca.addEventListener('input', iniciarBusca); //2. BUSCA AUTOMÁTICA (ao digitar ou apagar)
    }
});