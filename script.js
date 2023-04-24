// const mainContainer = document.querySelector('.main');
// const inputSearch = document.querySelector('input');

// inputSearch.addEventListener('keyup', searchRepo)


// async function searchRepo () {
//     return await fetch(`https://api.github.com/search/repositories?q=${inputSearch.value}`).then(res => res.json()).then(data => console.log(data))
// }

const userInList = 5;
const URL = 'https://api.github.com/';

class View {
    constructor() {
        this.main = document.querySelector('.main');
        this.form = this.createElement('form', 'form');
        this.inputEl = this.createElement('input', 'input');
        this.inputEl.placeholder = "Введите репозиторий"
        this.unordererList = this.createElement('ul', 'options');

        this.main.append(this.form);
        this.form.append(this.inputEl);
        this.form.append(this.unordererList);
    }

    createElement(elementTag, elementClass) {
        const element = document.createElement(elementTag);
        if (elementClass) {
            element.classList.add(elementClass);
        }
        return element;
    }

    createRepo(userData) {
        const userElement = this.createElement('li', 'options-list');
        userElement.addEventListener('click', () => this.showUserData(userData.full_name))
        userElement.innerHTML = `${userData.owner.login}`;
        this.unordererList.append(userElement)
    }


    showUserData(login) {
        const userEl = this.createElement('div', 'profile-card')
        const btn = this.createElement('button', 'btn_close')
        const data = this.loadUserData(login).then(res => {
            const profile = this.createDataList(res)
            userEl.append(profile)
            userEl.append(btn)
        })
        if (document.getElementsByClassName("profile-card").length < 3) {
            this.main.append(userEl);
        }
        this.inputEl.value = '';
        this.unordererList.innerHTML = ''

        btn.addEventListener('click', () => this.removeCard(userEl))
    }

    removeCard(user) {
        this.main.removeChild(user);
    }

    createDataList(data) {
        const block = this.createElement('div', 'info');
        const pLanguage = this.createElement('p', 'info_name')
        const pName = this.createElement('p', 'info_owner')
        const pStars =this.createElement('p', 'info_stars')

        pLanguage.textContent = `Name: ${data.language}`;
        pName.textContent = `Owner: ${data.full_name}`;
        pStars.textContent = `Stars: ${data.stargazers_count}`;

        block.append(pLanguage)
        block.append(pName)
        block.append(pStars)

        return block;
    }

    loadUserData(fullName) {
        const urls = `${URL}repos/${fullName}`
        return fetch(urls).then( (res) => res.json());
    }
}



class Search {
    constructor(view) {
        this.view = view;
        this.view.inputEl.addEventListener('keyup', this.debounce(this.searchUsers.bind(this), 500))
    }

    async searchUsers(){
        const searchValue = this.view.inputEl.value
        if (searchValue) {
            this.loadUsers(searchValue).then(response => this.updateUsers(response))
        } else {
            this.clearUsers()
        }
    }

    async loadUsers(searchValue) {
        return await fetch(`https://api.github.com/search/repositories?q=${searchValue}&per_page=${userInList}`);
    }

    updateUsers(response, isUpdate = false) {
        let users;
        if (response.ok) {
            if (!isUpdate) {
                this.clearUsers();
            }
            response.json().then((res) => {
                if (res.items) {
                    users = res.items;
                    users.forEach(user => this.view.createRepo(user));
                } else {
                    this.clearUsers();
                }
            });
        } else {
            console.log('Error 1' + response.status);
        }
    }


    clearUsers() {
        this.view.unordererList.innerHTML = '';
    }

    debounce(func, wait, immediate) {
        let timeout;
        return function () {
          let context = this, args = arguments;
          let later = function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
          };
          let callNow = immediate && !timeout;
          clearTimeout(timeout);
          timeout = setTimeout(later, wait);
          if (callNow) func.apply(context, args);
        };
      };


}



new Search(new View());