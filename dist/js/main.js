//* Global variables
const bodyEl = document.querySelector('body');
const sidebar = document.querySelector('.sidebar');
const hamburger = document.querySelector('.hamburger');
const themeToggler = document.querySelector('.theme-toggler');
const textAreas = document.querySelectorAll('textarea');
const pagesContainer = document.querySelector('.pages-container');
const addNoteBtn = document.querySelector('.add-note');
let titleInput = document.querySelector('.main-title');
let noteInput = document.querySelector('.body');
const deleteBtn = document.querySelector('.delete-btn');

////////////////////////////////////////////////////////////////////////////////
//* LOCAL STORAGE
function getLS() {
  return JSON.parse(localStorage.getItem('margin-pages')) || [];
}

function saveLS(pageToSave) {
  // Edit/Update
  const pages = getLS();
  const existing = pages.find(page => page.id == pageToSave.id);

  if (existing) {
    //-update
    existing.title = pageToSave.title;
    existing.body = pageToSave.body;
    existing.updated = Intl.DateTimeFormat('en-us', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date());
  } else {
    pages.push(pageToSave);
  }

  localStorage.setItem('margin-pages', JSON.stringify(pages));
}

function deleteFromLS(id) {
  const pages = getLS();
  const newPages = pages.filter(page => page.id !== id);

  localStorage.setItem('margin-pages', JSON.stringify(newPages));
}
//////////////////////////////////////////////////////////////////
let acitvePageID;

const Page = class {
  constructor() {
    this.id = Math.trunc(Math.random() * 1000000);
    this.title = 'Untitled';
    this.body = '';
    this.date = Intl.DateTimeFormat('en-us', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date());
  }
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function buildPagePrototype(page) {
  page.renderInSidebar = function () {
    const markup = `
      <div class="page" data-page-id=${this.id}>
      <div class="title">${this.title}</div>
      <p class="date">${this.updated || this.date}</p>
      </div>
`;

    pagesContainer.insertAdjacentHTML('afterbegin', markup);
  };

  page.select = function (id) {
    const pages = getLS();
    const selectedPage = pages.find(page => page.id == id);
    titleInput.value = selectedPage.title;
    noteInput.value = selectedPage.body;
    acitvePageID = id;
  };

  page.removePage = function () {
    deleteFromLS(this.id);

    const data = getLS();
    const firstObj = data[data.length - 1];
    titleInput.value = firstObj.title;
    noteInput.value = firstObj.body;
    acitvePageID = firstObj.id;
  };
}
///////////////////////////////////////////////////////////////////////////
//* SETUP
window.addEventListener('DOMContentLoaded', () => {
  const data = getLS();

  data.forEach(page => {
    buildPagePrototype(page);
    page.renderInSidebar();
  });

  //-DOM ELEMENTS
  const pagesEl = document.querySelectorAll('.page');

  pagesEl.forEach(page => {
    page.addEventListener('click', () => {
      const clickedID = +page.dataset.pageId;
      const fetchedObj = data.find(page => page.id == clickedID);
      fetchedObj.select(fetchedObj.id);
    });
  });

  //-TODO: refresh sidebarView with every event

  titleInput.addEventListener('input', e => {
    const fetchedObj = data.find(page => page.id == acitvePageID);
    fetchedObj.title = e.target.value;
    saveLS(fetchedObj);
  });

  noteInput.addEventListener('input', e => {
    const fetchedObj = data.find(page => page.id == acitvePageID);
    fetchedObj.body = e.target.value;
    saveLS(fetchedObj);
  });

  //* Additional Features

  //- toggle collapse sidebar
  hamburger.addEventListener('click', () =>
    sidebar.classList.toggle('collapse')
  );

  //- dark theme toggle
  themeToggler.addEventListener('click', () => {
    sidebar.classList.toggle('dark-sidebar');
    bodyEl.classList.toggle('dark-mode');
    textAreas.forEach(area => area.classList.toggle('dark-mode'));
    pagesEl.forEach(page => page.classList.toggle('dark-sidebar'));
  });
  ////////////////////////////////////////////
  //* BUTTONS EVENT LISTENERS
  //- add new
  addNoteBtn.addEventListener('click', () => {
    const newPage = new Page();
    buildPagePrototype(newPage);
    //- actions
    newPage.renderInSidebar();

    //-save to LS
    saveLS(newPage);
    newPage.select(newPage.id);
  });

  deleteBtn.addEventListener('click', () => {
    const pageToDelete = data.find(page => page.id == acitvePageID);

    Swal.fire({
      text: 'Delete this page?',
      icon: 'question',
      toast: 'true',
      confirmButtonColor: '#dd0000',
      showCancelButton: 'true',
      confirmButtonText: 'Yes!',
    }).then(() => {
      pageToDelete.removePage();
    });
  });
  //////////////////////////////////////////////////////////////////////////////
});
