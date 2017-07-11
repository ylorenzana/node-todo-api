const { ObjectID } = require('mongodb');

const { mongoose } = require('./../server/db/mongoose');
const { Todo } = require('./../server/models/todo');
const { User } = require('./../server/models/user');

let id = '5964483cd5dc45293046da9b';
let id2 = '5963e55feb80382df88fc6c2';

if (ObjectID.isValid(id)) {
  Todo.find({
    _id: id
  }).then((todos) => {
    console.log('Todos', todos);
  });

  Todo.findOne({
    _id: id
  }).then((todo) => {
    console.log('Todo', todo);
  });

  Todo.findById(id).then((todo) => {
    if (!todo) {
      return console.log('Id not found');
    }
    console.log('By id', todo);
  }).catch((e) => console.log(e));
}

Todo.findById(id2).then((user) => {
  if(!user) {
    return console.log('User not found');
  }

  console.log('User: ', user);
}).catch((e) => console.log(e));