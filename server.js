const express = require('express');
const app = express();
const path = require('path');
const db = require('./db/db');
const socket = require('socket.io');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(express.static(path.join(__dirname, '/client')));

app.get('/api/messages', (req, res) => {
  res.json(db.messages);
});

app.get('/api/users', (req, res) => {
  res.json(db.users);
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/index.html'));
});

app.use((req, res) => {
  res.status(404).json({ message: 'Not found...' });
});

const server = app.listen(8000, () => {
  console.log('Server is running on port:', 8000);
});

const io = socket(server);

io.on('connection', (socket) => {
  console.log('New client! Its id – ' + socket.id);

  socket.on('loggedIn', (author) => {
    db.users.push({ name: author, id: socket.id });
    console.log(`I've added user: ${author} to array`);
    socket.broadcast.emit('join', author);
  });

  socket.on('message', (message) => {
    console.log("Oh, I've got something from " + socket.id);

    db.messages.push(message);
    socket.broadcast.emit('message', message);
  });

  socket.on('disconnect', () => {
    const userIndex = db.users.findIndex((user) => user.id === socket.id);

    if (userIndex !== -1) {
      const removedUser = db.users.splice(userIndex, 1);
      console.log(`Removed user: ${removedUser[0].name}`);

      console.log('Oh, socket ' + socket.id + ' has left');
      socket.broadcast.emit('left', removedUser[0].name);
    }
  });
  console.log("I've added a listener on message event \n");
});
