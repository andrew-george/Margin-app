//* Global variables
const bodyEl = document.querySelector('body');
const sidebar = document.querySelector('.sidebar');
const hamburger = document.querySelector('.hamburger');
const themeToggler = document.querySelector('.theme-toggler');
const mainEl = document.querySelector('main');
const textAreas = document.querySelectorAll('textarea');
const pagesContainer = document.querySelector('.pages-container');
const addNoteBtn = document.querySelector('.add-note');
let deleteBtn;

let acitvePageID;
////////////////////////////////////////////////////////////////////////////////
//* LOCAL STORAGE
function getLS() {
  return JSON.parse(localStorage.getItem('margin-pages')) || [];
}

function saveLS(pageToSave) {
  const pages = getLS();
  const existing = pages.find(page => page.id == pageToSave.id);

  if (existing) {
    //-update
    existing.title = pageToSave.title ? pageToSave.title : 'Untitled';
    existing.body = pageToSave.body;
    existing.date = Intl.DateTimeFormat('en-us', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date());
  } else {
    //-save new
    pages.push(pageToSave);
  }

  localStorage.setItem('margin-pages', JSON.stringify(pages));
}

function deleteFromLS(id) {
  const pages = getLS();
  const newPages = pages.filter(page => page.id !== id);

  localStorage.setItem('margin-pages', JSON.stringify(newPages));
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function renderInSidebar(id, title = 'Untitled', date = new date()) {
  const markup = `
      <div class="page" data-page-id=${id}>
      <div class="title">${title}</div>
      <p class="date">${date}</p>
      </div>
`;

  pagesContainer.insertAdjacentHTML('afterbegin', markup);
}

function renderInPreview(id, title = '', date = new date(), body = '') {
  const markup = `
        <div class="hero-area" data-page-id=${id}>
          <textarea
            class="main-title"
            placeholder="Page title.."
            maxlength="20"
          >${title}</textarea>
          <textarea class="body" placeholder="Type Here...">${body}</textarea>
          <i class="fa-solid fa-trash-can delete-btn"></i>
        </div>
  `;
  mainEl.innerHTML = markup;

  deleteBtn = document.querySelector('.delete-btn');

  deleteBtn.addEventListener('click', () => {
    const pages = getLS();
    const pageToDelete = pages.find(page => page.id == acitvePageID);

    Swal.fire({
      text: 'Delete this page?',
      icon: 'question',
      iconColor: '#666',
      width: '18rem',
      toast: 'true',
      confirmButtonColor: '#dd0000',
      showCancelButton: 'true',
      confirmButtonText: 'Yes!',
    }).then(result => {
      if (result.isConfirmed) {
        removePage(pageToDelete.id);
      }
    });
  });
}

function addListeners() {
  //- retrieve DOM elements
  const pagesEl = document.querySelectorAll('.page');

  pagesEl.forEach(page => {
    page.addEventListener('click', () => {
      const pages = getLS();
      const clickedID = +page.dataset.pageId;
      const fetchedObj = pages.find(page => page.id == clickedID);
      select(fetchedObj.id);
    });
  });
}

function updateView() {
  pagesContainer.innerHTML = '';
  // mainEl.innerHTML = '';
  //getLS
  const pages = getLS();
  //generate whole list
  pages.forEach(page => {
    renderInSidebar(page.id, page.title, page.date);
  });
}

function select(id) {
  const pages = getLS();
  const selectedPage = pages.find(page => page.id == id);
  acitvePageID = id;

  renderInPreview(
    selectedPage.id,
    selectedPage.title,
    selectedPage.date,
    selectedPage.body
  );

  renderSelection();
  checkForEdits();
}

function renderSelection() {
  const pagesEl = document.querySelectorAll('.page');
  const clickedEl = Array.from(pagesEl).find(
    page => page.dataset.pageId == acitvePageID
  );
  pagesEl.forEach(page => page.classList.remove('selected'));
  clickedEl.classList.add('selected');
}

function checkForEdits() {
  let titleInput = document.querySelector('.main-title');
  let noteInput = document.querySelector('.body');

  const pages = getLS();
  const fetchedObj = pages.find(page => page.id == acitvePageID);

  titleInput.addEventListener('input', e => {
    fetchedObj.title = e.target.value.trim();
    fetchedObj.date = Intl.DateTimeFormat('en-us', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date());
    saveLS(fetchedObj);
    updateView();
    renderSelection();
    addListeners();
  });

  noteInput.addEventListener('input', e => {
    fetchedObj.body = e.target.value.trim();
    fetchedObj.date = Intl.DateTimeFormat('en-us', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date());
    saveLS(fetchedObj);
    updateView();
    renderSelection();
    addListeners();
  });
}

function removePage(id) {
  deleteFromLS(id);

  const pages = getLS();
  if (pages.length == 0) {
    updateView();
    document.querySelector('.hero-area').innerHTML = '';
    return;
  }
  if (pages.length < 1) {
    updateView();
    return;
  } else {
    const firstObj = pages[0];
    acitvePageID = firstObj.id;
    updateView();
    select(firstObj.id);
    renderInPreview(firstObj.id, firstObj.title, firstObj.date, firstObj.body);
    addListeners();
  }
}
///////////////////////////////////////////////////////////////////////////////////////////////////
//* SETUP
window.addEventListener('DOMContentLoaded', () => {
  //- retrieve LS and render List
  updateView();
  addListeners();

  //* Additional Features

  //- toggle collapse sidebar
  hamburger.addEventListener('click', () =>
    sidebar.classList.toggle('collapse')
  );

  //- dark theme toggle
  themeToggler.addEventListener('click', () => {
    const textAreas = document.querySelectorAll('textarea');

    sidebar.classList.toggle('dark-sidebar');
    bodyEl.classList.toggle('dark-mode');
    textAreas.forEach(area => area.classList.toggle('dark-mode'));
    pagesEl.forEach(page => page.classList.toggle('dark-sidebar'));
  });
});

////////////////////////////////////////////
//* BUTTONS EVENT LISTENERS
//- add new
addNoteBtn.addEventListener('click', () => {
  const page = {
    id: Math.trunc(Math.random() * 1000000),
    title: 'Untitled',
    body: '',
    date: Intl.DateTimeFormat('en-us', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date()),
  };

  saveLS(page);
  updateView();
  addListeners();
  select(page.id);
});

/////////////////////////////////////////////////////////////////////////////
