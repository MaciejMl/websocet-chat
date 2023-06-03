const loginForm = document.querySelector('#welcome-form');
const messagesSection = document.querySelector('#messages-section');
const messagesList = document.querySelector('#messages-list');
const addMessageForm = document.querySelector('#add-messages-form');
const userNameInput = document.querySelector('#username');
const messageContentInput = document.querySelector('#message-content');

const socket = io();

socket.on('message', ({ author, content }) => addMessage(author, content));
socket.on('join', (author) => {
  if (userName !== '') {
    joinMessage(author);
  }
});
socket.on('left', (author) => {
  if (userName !== '') {
    leftMessage(author);
  }
});

let userName = '';

function login(e) {
  e.preventDefault();
  if (userNameInput.value == '') {
    alert('Pole login jest puste!');
  } else {
    userName = userNameInput.value;
    socket.emit('loggedIn', userName);
    loginForm.classList.remove('show');
    messagesSection.classList.add('show');
  }
}

loginForm.addEventListener('submit', (e) => {
  login(e);
});

function joinMessage(author) {
  const message = document.createElement('li');
  message.classList.add('message');
  message.classList.add('message--received');

  message.innerHTML = `
  <h3 class='message__author'>Chat Bot</h3>
  <div class='message__content bot-message'>${author} has joined the conversation!</div>
  `;
  messagesList.appendChild(message);
}

function leftMessage(author) {
  const message = document.createElement('li');
  message.classList.add('message');
  message.classList.add('message--received');

  message.innerHTML = `
  <h3 class='message__author'>Chat Bot</h3>
  <div class='message__content left-message'>${author} has left the conversation... :(</div>
  `;
  messagesList.appendChild(message);
}

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
    const messageContent = messageContentInput.value;
    addMessage(userName, messageContent);
    messageContentInput.value = '';
    socket.emit('message', {
      author: userName,
      content: messageContent,
    });
  }
}

addMessageForm.addEventListener('submit', (e) => {
  sendMessage(e);
});
