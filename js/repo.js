// Função que pega as linguagens utilizadas e faz o cálculo de quantos porcentagem da linguagem foi utilizado
const getLanguages = async (apiLanguages) => {
    let language = document.getElementById('language'); // Pegando a section#language
    let languageValues = []; // Array onde ficarão os valores de cada linguagem vindo da API
    let totalValue;

    try {
        let { data } = await axios.get(apiLanguages); // Consumindo a API

        // Percorrendo o objeto e reduzindo somando os valores
        Object.keys(data).forEach(item => {
            languageValues.push(data[item]);
            totalValue = languageValues.reduce((total, num) => total + num);
        });

        // Percorrendo o objeto e inserindo na página a porcentagem da linguagem utilizada
        Object.keys(data).forEach(item => {
            let li = document.createElement('li');
            let percent = ((data[item] * 100) / totalValue).toFixed(1); // Calculando a porcentagem da linguagem

            let span = document.createElement('span');
            span.innerHTML = `${percent}%`;
            let random = (Math.random() * 6).toFixed(0);
            span.style.color = colors[random];

            li.innerHTML = `${item}: `;
            li.append(span);
            language.appendChild(li);
        });
    } catch (err) {
        console.log(err);
    }
}

// Função que pega as informações do repositório selecionado
const getRepo = async (avatar, avatarLink, repoLink, userAndRepo, description, linkFork, stars, watchers, forks) => {
    // Consumindo API
    let { data } = await axios.get(`${baseURL}/repos/${repo}`);

    // Inserindo atributos 
    insertAttribute(avatar, 'src', data.owner.avatar_url);
    insertAttribute(avatarLink, 'href', data.owner.html_url);
    insertAttribute(repoLink, 'href', data.html_url);

    // Inserindo valores
    userAndRepo.innerHTML = data.full_name;
    description.innerHTML = data.description || 'Sem descrição...';

    if (!data.fork) {
        linkFork.style.display = 'none';
    } else {
        insertAttribute(linkFork, 'href', data.parent.html_url);
    }

    stars.innerHTML = data.watchers_count;
    watchers.innerHTML = data.subscribers_count;
    forks.innerHTML = data.forks_count;

    getLanguages(data.languages_url);
}

getRepo(avatar, avatarLink, repoLink, userAndRepo, description, linkFork, stars, watchers, forks);