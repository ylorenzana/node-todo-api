const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to db: ' + err);
  }
  console.log('Connected to MongoDB server');

  // db.collection('Todos').deleteMany({text: 'Something to do'}).then((result) => {
  //   console.log(result);
  // });

  //  db.collection('Todos').deleteOne({text: 'Yolo'}).then((result) => {
  //    console.log(result);
  //  });

  // db.collection('Todos').findOneAndDelete({isCompleted: true}).then((result) => {
  //   console.log(result);
  // });

  // db.collection('Users').findOneAndDelete({_id: new ObjectID('596282ebe703620f34132a48')}).then((result) => {
  //   console.log(result);
  // });

  db.collection('Users').deleteMany({name: 'Nika'}).then((results) => {
    console.log(results);
  });
  
 });
