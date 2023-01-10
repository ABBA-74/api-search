const imgsSectionEl = document.querySelectorAll('section img');
const btnRandomSearchEl = document.querySelector('#btn-random-search');
const btnCategorySearchEl = document.querySelector('#btn-categ-search');
const inpuSelectCategoryEl = document.querySelector('.input-select-category');
const categoryResultItemEl = document.querySelector('#category-result-item');
const wrapperResultCategoryEl = document.querySelector(
  '.section-category .wrapper:last-child'
);

console.log('wrapper result', wrapperResultCategoryEl);
const pageItemsEl = document.querySelectorAll('.page-item');
let datas = [];
let rows = 6;
let currentPage = 1;

console.log('inpuSelectCategoryEl', inpuSelectCategoryEl);

const fetchData = (param, resultElDom, queryCatSearch = '', method = 'GET') => {
  let url = '';
  if (!queryCatSearch) {
    url = `https://api.publicapis.org/${param}`;
    console.log(url);
  } else {
    url = `https://api.publicapis.org/entries?category=${queryCatSearch}`;
  }

  fetch(url, { method: method }).then(async (responseHTTP) => {
    let resultJSON = await responseHTTP.json();

    console.log('random', resultElDom);
    switch (param) {
      case 'random':
        const entry = resultJSON.entries[0];
        resultElDom.innerHTML = cardEl(
          entry.API,
          entry.Description,
          entry.Auth,
          entry.HTTPS,
          entry.Cors,
          entry.Link,
          entry.Category
        );
        break;
      case 'categories':
        resultJSON.categories.forEach((el, i) => {
          // console.log(el);
          resultElDom.innerHTML += optionSelectEl(el);
        });
        break;
      case 'entries':
        datas = resultJSON.entries;

        handleDisplayEntries(datas);
        break;
      default:
        break;
    }
  });
};

const init = () => {
  // load input category
  const inputSelectCategoryEl = document.querySelector(
    '.input-select-category'
  );
  fetchData('categories', inputSelectCategoryEl);
};

const handleRandomSearch = () => {
  const randomItemEl = document.querySelector('#random-item');
  const randomApiResultEl = document.querySelector('.random-api-result');
  randomItemEl.classList.remove('active');
  randomApiResultEl.style.height = '24rem';
  const data = fetchData('random', randomItemEl);
  setTimeout(() => {
    randomItemEl.classList.add('active');
  }, 150);
};
const handleCategorySearch = () => {
  fetchData('entries', categoryResultItemEl);
};

const generatePagination = (datas) => {
  const paginationEl = document.querySelector('.pagination');

  paginationEl.innerHTML = '';

  let maxPage = Math.ceil(datas.length / rows);
  console.log('maxPage>>>', maxPage);

  for (let i = 1; i < maxPage + 1; i++) {
    paginationEl.innerHTML += createBtnPagination(i);
  }

  const paginationItems = document.querySelectorAll('.page-item');
  const paginationLinks = document.querySelectorAll('.page-link');
  [...paginationItems, ...paginationLinks].forEach((el) =>
    el.addEventListener('click', () => {
      currentPage = el.dataset.noPage;
      console.log('page selectionné ', currentPage);
      handleDisplayEntries(datas, currentPage);
    })
  );
};

const createBtnPagination = (noPage) => {
  return `<li class="page-item ${
    currentPage == noPage ? 'active' : ''
  }" data-no-page="${noPage}">
    <a class="page-link" data-no-page="${noPage}">${noPage}</a>
    </li>`;
};

const handleDisplayEntries = (datas, noPage = 1) => {
  console.log('datas>>>>>>', datas.length);

  categoryResultItemEl.innerHTML = '';
  noPage--;
  generatePagination(datas);

  let indexStart = rows * noPage;
  let indexEnd = indexStart + rows;

  let paginatedDatas = datas.slice(indexStart, indexEnd);
  console.log(indexStart, '<<<<>>>>', indexEnd);
  console.log('<<<<>>>>', paginatedDatas.length);

  for (let i = 0; i < paginatedDatas.length; i++) {
    console.log('ffff', paginatedDatas[i]);
    categoryResultItemEl.innerHTML += cardEl(
      paginatedDatas[i].API,
      paginatedDatas[i].Description,
      paginatedDatas[i].Auth,
      paginatedDatas[i].HTTPS,
      paginatedDatas[i].Cors,
      paginatedDatas[i].Link,
      paginatedDatas[i].Category
    );
  }

  wrapperResultCategoryEl.classList.add('active');
  let minHeightResultsWrapper = wrapperResultCategoryEl.offsetHeight;
  wrapperResultCategoryEl.style.minHeight = `${minHeightResultsWrapper}px`;
};

const cardEl = (nameApi, description, auth, https, cors, link, category) => {
  return `
       <div class="card random-card mt-5">
       <div class="card-header">
       <p class="h4 card-title mb-3">${nameApi}</p>
       <p class="card-text">${description}</p>
       </div>
       <ul class="list-group list-group-flush">
       <li class="list-group-item"><label>Auth</label>${
         auth === '' ? 'NC' : auth
       }</li>
       <li class="list-group-item"><label>HTTPS</label>${
         https ? 'Oui' : 'Non'
       }</li>
       <li class="list-group-item"><label>Cors</label>${
         cors ? 'Oui' : 'Non'
       }</li>
       <li class="list-group-item"><label>Lien</label><a href="${link}" target="_blank" rel="noopener noreferrer" class="link-api">${link}</a></li>
       <li class="list-group-item"><label>Catégorie</label>${category}</li>
       </ul>
       </div> `;
};

const optionSelectEl = (categoryName) => {
  return `
       <option value="${categoryName}">${categoryName}</option>
       `;
};

const handleSearchByCat = () => {
  console.log('change', inpuSelectCategoryEl.value.toLowerCase());
  const catSearch = inpuSelectCategoryEl.value.toLowerCase();
  categoryResultItemEl.innerHTML = '';
  fetchData('entries', categoryResultItemEl, catSearch);
};
const handlePagination = (datas, e) => {
  console.log(e.target.firstChild.textContent);
  handleDisplayEntries(datas, +e.target.firstChild.textContent);
};
init();

/** events listener **/

btnRandomSearchEl.addEventListener('click', handleRandomSearch);

inpuSelectCategoryEl.addEventListener('change', handleSearchByCat);
[...pageItemsEl].forEach((el) => {
  el.addEventListener('click', (e) => handlePagination(datas, e));
});

[...imgsSectionEl].forEach((el) => {
  el.addEventListener('click', () => {
    console.log('clickeddd');
    el.classList.remove('active');
    setTimeout(() => {
      el.classList.add('active');
    }, 150);
  });
});
