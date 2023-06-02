const loginForm = document.querySelector('#welcome-form');

const messagesSection = document.querySelector('#messages-section');

const messagesList = document.querySelector('#messages-list');

const addMessageForm = document.querySelector('#add-messages-form');

const userNameInput = document.querySelector('#username');

const messageContentInput = document.querySelector('#message-content');

let userName = '';

function login(e) {
  e.preventDefault();
  if (userNameInput.value == '') {
    alert('Pole login jest puste!');
  } else {
    userName = userNameInput.value;
    loginForm.classList.remove('show');
    messagesSection.classList.add('show');
  }
}

loginForm.addEventListener('submit', (e) => {
  login(e);
});

function addMessage(author, content) {
  const message = document.createElement('li');
  message.classList.add('message');
  message.classList.add('message--received');
  if (author === userName) {
    message.classList.add('message--self');
  }
  message.innerHTML = `
  <h3 class='message__author'>${userName === author ? 'You' : author}</h3>
  <div class='message__content'>${content}</div>
  `;
  messagesList.appendChild(message);
}

function sendMessage(e) {
  e.preventDefault();
  if (messageContentInput.value === '') {
    alert('Wpisz tekst!');
  } else {
    addMessage(userName, messageContentInput.value);
    messageContentInput.value = '';
  }
}

addMessageForm.addEventListener('submit', (e) => {
  sendMessage(e);
});
