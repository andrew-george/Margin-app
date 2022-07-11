const bodyEl = document.querySelector('body');
const typingArea = document.querySelector('.body');
const app = document.querySelector('.app');
const hamburger = document.querySelector('.hamburger');
const sidebar = document.querySelector('.sidebar');
const themeToggler = document.querySelector('.theme-toggler');
const textAreas = document.querySelectorAll('textarea');
const pages = document.querySelectorAll('.page');

window.addEventListener('DOMContentLoaded', () => typingArea.focus());
hamburger.addEventListener('click', () => {
  sidebar.classList.toggle('collapse');
});
sidebar.addEventListener('mouseover', () =>
  sidebar.classList.remove('collapse')
);
sidebar.addEventListener('mouseout', () => sidebar.classList.add('collapse'));

themeToggler.addEventListener('click', () => {
  sidebar.classList.toggle('dark-sidebar');
  bodyEl.classList.toggle('dark-mode');
  textAreas.forEach(area => area.classList.toggle('dark-mode'));
  pages.forEach(page => page.classList.toggle('dark-sidebar'));
});
