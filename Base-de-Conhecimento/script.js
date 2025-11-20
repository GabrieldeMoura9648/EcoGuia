let cardContainer = document.querySelector(".card-container");
let dados = [];

async function iniciarBusca(){
    const input = document.querySelector('input[type="text"]');
    const termo = input ? input.value.trim().toLowerCase() : '';

    if (dados.length === 0) {
        let resposta = await fetch("data.json");
        dados = await resposta.json();
    }

    let resultados = dados;
    if (termo) {
        resultados = dados.filter(d => {
            const nome =        (d.nome || '').toLowerCase();
            const descricao =   (d['descrição'] || '').toLowerCase();
            const aparicao =    (d['aparição'] || '').toLowerCase();
            const criador =     (d['criador'] || d['criador(es)'] || '').toLowerCase();
            return nome.includes(termo) || descricao.includes(termo) || aparicao.includes(termo) || criador.includes(termo);
        });
    }

    renderizarCards(resultados, termo);
};

function renderizarCards(dados, termo = ''){
    cardContainer.innerHTML = '';

    if (!dados || dados.length === 0) {
        const article = document.createElement('article');
        article.classList.add('card');
        article.innerHTML = `<h2>Nenhum resultado encontrado</h2><p>Sem correspondências${termo ? ` para "${termo}"` : ''}.</p>`;
        cardContainer.appendChild(article);
        return;
    }

    for (let dado of dados) {
        let article = document.createElement("article");
        article.classList.add("card");
        const criador = dado['criador'] || dado['criador(es)'] || '';
        article.innerHTML = 
        `
        <h2>${dado.nome}</h2>
        <p>${dado.aparição}</p>
        <p>${dado['descrição']}</p>
        <p>${criador}</p>
        <a href="${dado.link}" target="_blank">Saiba mais</a>
        `
        cardContainer.appendChild(article);
    }
}