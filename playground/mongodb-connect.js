//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

let obj = new ObjectID();

console.log(obj);


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to db: ' + err);
  }
  console.log('Connected to mongodb server');

  db.collection('Todos').insertOne({
    text: 'Something to do',
    isCompleted: false
  }, (err, result) => {
    if (err) {
      return console.log('Unable to insert todo ', err);
    }
    console.log(JSON.stringify(result.ops, undefined, 2));
  });


  db.collection('Users').insertOne({
    name: 'Nika',
    age: 24,
    location: 'Philly'
  }, (err, result) => {
    if (err) {
      return console.log('Unable to insert user', err);
    }
    console.log(JSON.stringify(result.ops[0]._id.getTimestamp(), undefined, 2));
  });

  db.close();
});

