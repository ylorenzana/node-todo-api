const { ObjectID } = require('mongodb');

const { mongoose } = require('./../server/db/mongoose');
const { Todo } = require('./../server/models/todo');
const { User } = require('./../server/models/user');

// Todo.remove({}).then((result) => {
//   console.log(result);
// });

Todo.findOneAndRemove({_id: '5967d443989e12c203d8971d'}).then((todo) => {
  console.log(todo);
});

Todo.findByIdAndRemove('5967d443989e12c203d8971d').then((todo) => {
  console.log(todo);
});