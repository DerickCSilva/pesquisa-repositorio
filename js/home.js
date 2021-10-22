// Função que carrega mais repositórios
const loadMoreRepos = (areaRepos) => {
    // Setando páginas e quais repositórios vão ser mostrado
    let nextPage = page + reposPerPage;
    page = nextPage;
    let nextRepos = allRepos.slice(nextPage, nextPage + reposPerPage);

    // Desabilitar botão de ver mais repos se não tiver mais repos para exibir
    if (nextRepos.length == 0 || nextRepos.length < 5) {
        document.getElementById('more-repos').disabled = true;
    }
    
    // Imprimindo mais repositórios
    nextRepos.map(repo => {
        // Criando a section que ficará informações do repositório (Título e descrição)
        let section = document.createElement('section');
        section.classList.add('repo'); // Aplicando classe
        insertAttribute(section, 'onclick', `viewRepoInfo('${repo.full_name}')`); // Aplicando função quando clicar na section

        areaRepos.appendChild(section); // Colocando a section na div#area-repos

        // Criando imagem
        let img = document.createElement('img');
        insertAttribute(img, 'src', './img/file.png');
        section.appendChild(img); // Colocando imagem na section

        // Criando a div com as informações do repositório
        let div = document.createElement('div');
        div.classList.add('infos-repo');
        section.appendChild(div); // Colocando a div na section

        // Criando e colocando o título
        let h2 = document.createElement('h2');
        h2.innerHTML = repo.full_name;

        // Criando e colocando a descrição
        let p = document.createElement('p');
        p.innerHTML = repo.description || '<b> - - - </b>';

        // Colocando o título e a descrição na div
        div.appendChild(h2);
        div.appendChild(p);
    });
}

// Função que retorna um objeto com os campos onde serão inseridos informações do usuário
const getField = (...idNames) => {
    let fields = {};

    idNames.map(idName => {
        let field = idName;
        fields[field] = document.getElementById(idName);
    });
    return fields;
}

// Função que insere informação do usuário no campo exato
const insertValue = (fields, values) => {
    Object.keys(fields).forEach((item) => {
        if (item != 'githubLink') fields[item].innerHTML = values[item];
    });
}

// Função que seta qual é repositório selecionado no localStorage e manda para página de repo.html 
const viewRepoInfo = (repo) => {
    localStorage.setItem('repo', repo);
    window.location.href = '/pages/repo.html';
}

// Função que insere os repositórios na página
const insertRepos = (data) => {
    allRepos = data; // Pegando todos repositórios em uma variável
    page = 0; // Setando a página como 0
    data = data.slice(page, reposPerPage); // Pegando quantos repos serão apresentados

    document.getElementById('more-repos').style.display = 'block';

    // Se a qntd de repos que for impresso for maior igual a 5
    if (data.length >= 5) {
        document.getElementById('more-repos').disabled = false;
    }

    // Tirando todos os repositórios que estão na tela
    let areaRepos = document.getElementById('area-repos');
    areaRepos.innerText = "";

    document.getElementById('username').value = ''; // Limpando o campo do usuário

    // Imprimindo 5 repositórios do usuário
    data.map(repo => {
        // Criando a section que ficará informações do repositório (Título e descrição)
        let section = document.createElement('section');
        section.classList.add('repo'); // Aplicando classe
        insertAttribute(section, 'onclick', `viewRepoInfo('${repo.full_name}')`); // Aplicando função quando clicar na section

        areaRepos.appendChild(section); // Colocando a section na div#area-repos

        // Criando imagem
        let img = document.createElement('img');
        insertAttribute(img, 'src', './img/file.png');
        section.appendChild(img); // Colocando imagem na section

        // Criando a div com as informações do repositório
        let div = document.createElement('div');
        div.classList.add('infos-repo');
        section.appendChild(div); // Colocando a div na section

        // Criando e colocando o título
        let h2 = document.createElement('h2');
        h2.innerHTML = repo.full_name;

        // Criando e colocando a descrição
        let p = document.createElement('p');
        p.innerHTML = repo.description || '<b> - - - </b>';

        // Colocando o título e a descrição na div
        div.appendChild(h2);
        div.appendChild(p);
    });
}

// Função que consulta os repositórios do usuário e chama a função de cima
const getRepos = async (username) => {
    try {
        let { data } = await axios.get(`https://api.github.com/users/${username}/repos`);      
        insertRepos(data);  
    } catch (err) {
        console.log(err);
    }
}

// Função que busca o usuário
const searchUser = async (event, username) => {
    event.preventDefault(); // Segura o form

    username = username.value; // Pegando o valor do input#username

    // Pegando os campos da página que fica as informações do usuário 
    let fields = getField('name', 'login', 'followers', 'following', 'bio', 'avatar', 'githubLink');

    try {
        let { data } = await axios.get(`${baseURL}/users/${username}`); // Consumindo API para pegar informações do usuário

        // Mostra a area do usuário e oculta not-found
        document.getElementById('area-user').style.display = 'flex'; 
        document.getElementById('not-found').style.display = 'none';

        // Criando um objeto que pegar todos os valores necessário da API
        let values = {
            name: data.name,
            login: data.login,
            followers: `Seguidores: <b> ${data.followers} </b>`,
            following: `Seguindo: <b> ${data.following} </b>`,
            bio: `"${data.bio}"`,
            avatar: data.avatar_url,
            githubLink: data.html_url
        }

        // Chamando as funções necessárias
        insertAttribute(false, false, false, fields, values); 
        insertValue(fields, values);

        getRepos(username);
    } catch (err) { // Setando estilos caso de erro na requisição da API
        document.getElementById('area-repos').innerHTML = '';
        document.getElementById('area-user').style.display = 'none';
        document.getElementById('not-found').style.display = 'block';
        document.getElementById('more-repos').style.display = 'none';

        console.log(err);
    }
}