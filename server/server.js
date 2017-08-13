require('./config/config');
const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');
const _ = require('lodash');

const { mongoose } = require('./db/mongoose');
const { Todo } = require('./models/todo');
const { User } = require('./models/user');
const { authenticate } = require('./middleware/authenticate');
const todosRoute = require('./routes/todos');
const usersRoute = require('./routes/users');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use('/todos', todosRoute);
app.use('/users', usersRoute);

app.listen(port, () => {
  console.log('Server running on port: ' + port);
});

module.exports = { app };