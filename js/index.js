// Global (Usado nos dois arquivos)
let baseURL = 'https://api.github.com';

// Usado apenas na home.html
let page = 0;
let reposPerPage = 5;
let allRepos;

// Usado apenas no repo.html
let repo = localStorage.getItem('repo');
let colors = ['#FE2E2E', '#FE9A2E', '#2EFE2E', '#2E2EFE', '#2ECCFA', '#CC2EFA', '#585858'];

// Função que insere atributo em algum campo
const insertAttribute = (tag, attribute, value, fields = false, values) => {
    if(fields) {
        Object.keys(fields).forEach((item) => {
            if (item === 'avatar') {
                fields[item].setAttribute('src', values[item]);
            } else if (item === 'githubLink') {
                fields[item].setAttribute('href', values[item]);
            }
        });
    } else {
        tag.setAttribute(attribute, value);
    }
}