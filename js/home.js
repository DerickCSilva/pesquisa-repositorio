let baseURL = 'https://api.github.com';

let page = 0;
let reposPerPage = 5;
let allRepos;

const loadMoreRepos = () => {
    let nextPage = page + reposPerPage;
    page = nextPage;
    let nextRepos = allRepos.slice(nextPage, nextPage + reposPerPage);

    if (nextRepos.length == 0 || nextRepos.length < 5) {
        document.getElementById('more-repos').disabled = true;
    }

    let areaRepos = document.getElementById('area-repos');
    nextRepos.map(repo => {
        let section = document.createElement('section');
        section.classList.add('repo')
        section.setAttribute('onclick', `viewRepoInfo('${repo.full_name}')`);

        areaRepos.appendChild(section);

        let img = document.createElement('img');
        img.setAttribute('src', './img/file.png');
        img.setAttribute('alt', 'Ícone pasta');
        section.appendChild(img);

        let div = document.createElement('div');
        div.classList.add('infos-repo');
        section.appendChild(div);

        let h2 = document.createElement('h2');
        h2.innerHTML = repo.full_name;
        let p = document.createElement('p');
        p.innerHTML = repo.description || '<b> - - - </b>';
        div.appendChild(h2);
        div.appendChild(p);
    });
}

const getField = (...idNames) => {
    let fields = {};

    idNames.map(idName => {
        let field = idName;
        fields[field] = document.getElementById(idName);
    });
    return fields;
}

const insertValue = (fields, values) => {
    Object.keys(fields).forEach((item) => {
        if (item != 'githubLink') fields[item].innerHTML = values[item];
    });
}

const insertAttribute = (fields, values) => {
    Object.keys(fields).forEach((item) => {
        if (item === 'avatar') {
            fields[item].setAttribute('src', values[item]);
        } else if (item === 'githubLink') {
            fields[item].setAttribute('href', values[item]);
        }
    });
}

const viewRepoInfo = (repo) => {
    localStorage.setItem('repo', repo);
    window.location.href = '/pages/repo.html';
}

const insertRepos = (data) => {
    allRepos = data;
    page = 0;
    data = data.slice(page, reposPerPage);

    document.getElementById('more-repos').style.display = 'block';
    if (data.length >= 5) {
        document.getElementById('more-repos').disabled = false;
    }

    let areaRepos = document.getElementById('area-repos');
    document.getElementById('username').value = '';

    areaRepos.innerText = "";
    data.map(repo => {
        let section = document.createElement('section');
        section.classList.add('repo')
        section.setAttribute('onclick', `viewRepoInfo('${repo.full_name}')`);

        areaRepos.appendChild(section);

        let img = document.createElement('img');
        img.setAttribute('src', './img/file.png');
        img.setAttribute('alt', 'Ícone pasta');
        section.appendChild(img);

        let div = document.createElement('div');
        div.classList.add('infos-repo');
        section.appendChild(div);

        let h2 = document.createElement('h2');
        h2.innerHTML = repo.full_name;
        let p = document.createElement('p');
        p.innerHTML = repo.description || '<b> - - - </b>';
        div.appendChild(h2);
        div.appendChild(p);
    });
}

const getRepos = async (username) => {
    let { data } = await axios.get(`https://api.github.com/users/${username}/repos`);
    insertRepos(data);
}

const searchUser = async (e, username) => {
    e.preventDefault();
    username = username.value;

    let fields = getField('name', 'login', 'followers', 'following', 'bio', 'avatar', 'githubLink');

    try {

        let { data } = await axios.get(`${baseURL}/users/${username}`);
        document.getElementById('area-user').style.display = 'flex';
        document.getElementById('not-found').style.display = 'none';

        let values = {
            name: data.name,
            login: data.login,
            followers: `Seguidores: ${data.followers}`,
            following: `Seguindo: ${data.following}`,
            bio: `"${data.bio}"`,
            avatar: data.avatar_url,
            githubLink: data.html_url
        }

        insertAttribute(fields, values);
        insertValue(fields, values);

        getRepos(username);
    } catch (err) {
        document.getElementById('area-repos').innerHTML = '';
        document.getElementById('area-user').style.display = 'none';
        document.getElementById('not-found').style.display = 'block';
        document.getElementById('more-repos').style.display = 'none';
        console.log(err);
    }
}