let baseURL = 'https://api.github.com';

let repo = localStorage.getItem('repo');

let colors = ['#FE2E2E', '#FE9A2E', '#2EFE2E', '#2E2EFE', '#2ECCFA', '#CC2EFA', '#585858'];

const getLanguages = async (apiLanguages) => {
    let language = document.getElementById('language');
    let languageValues = [];
    let totalValue;

    let { data } = await axios.get(apiLanguages);
    Object.keys(data).forEach(item => {
        languageValues.push(data[item]);
        totalValue = languageValues.reduce((total, num) => total + num);
    });

    Object.keys(data).forEach(item => {
        let li = document.createElement('li');
        let percent = ((data[item] * 100) / totalValue).toFixed(1);
        let span = document.createElement('span');
        span.innerHTML = `${percent}%`;
        let random = (Math.random() * 6).toFixed(0);
        span.style.color = colors[random];
        li.innerHTML = `${item}: `;
        li.append(span);
        language.appendChild(li);
    });

}

const getRepo = async () => {
    let { data } = await axios.get(`${baseURL}/repos/${repo}`);
    document.getElementById('avatar').setAttribute('src', data.owner.avatar_url);
    document.getElementById('avatar').setAttribute('alt', 'Avatar usuário');
    document.getElementById('avatar-link').setAttribute('href', data.owner.html_url);
    document.getElementById('userAndRepo').innerHTML = data.full_name;
    document.getElementById('repo-link').setAttribute('href', data.html_url);
    document.getElementById('description').innerHTML = data.description || 'Sem descrição...';

    if (!data.fork) {
        document.getElementById('link-fork').style.display = 'none';
    } else {
        document.getElementById('link-fork').setAttribute('href', data.parent.html_url);
    }

    document.getElementById('stars').innerHTML = data.watchers_count;
    document.getElementById('watchers').innerHTML = data.subscribers_count;
    document.getElementById('forks').innerHTML = data.forks_count;

    getLanguages(data.languages_url);
}

getRepo();