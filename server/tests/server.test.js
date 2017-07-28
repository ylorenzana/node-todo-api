const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('./../server');
const { Todo } = require('./../models/todo');
const { User } = require('./../models/user');
const { todos, populateTodos, users, populateUsers } = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
  it('Should create a new todo', (done) => {
    let text = 'Test todo';
    
    request(app)
      .post('/todos')
      .send({text})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find({text}).then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((e) => done(e));
      });
  });

  it('Should not create a new todo', (done) => {
    request(app)
      .post('/todos')
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find().then((todos) => {
          expect(todos.length).toBe(2);
          done();
        }).catch((e) => done(e));
      });
  });
});

describe('GET /todos', () => {
  it('Should get todos', (done) => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(2);
      })
      .end(done);
  });
});

describe('GET /todos/:id', () => {
  it('Should return todo doc', (done) => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
  });

  it('Should return a 404 if todo not found', (done) => {
    let id = new ObjectID().toHexString();
    request(app)
      .get('/todos/' + id)
      .expect(404)
      .end(done)
  });

  it('Should return a 404 for non-object ids', (done) => {
    request(app)
      .get('/todos/123')
      .expect(404)
      .end(done)
  });
});

describe('DELETE /todos/:id', () => {
  it('Should remove a todo', (done) => {
    let id = todos[1]._id.toHexString();
    request(app)
      .delete('/todos/' + id)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo._id).toBe(id);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.findById(id).then((todo) => {
          expect(todo).toNotExist();
          done();
        }).catch((e) => done(e));
      });
  });

  it('Should return a 404 if todo not found', (done) => {
    request(app)
      .delete('/todos/' + new ObjectID())
      .expect(404)
      .end(done);
  });

  it('Should return a 404 if object id is invalid', (done) => {
    request(app)
      .delete('/todos/123a')
      .expect(404)
      .end(done);
  });

});

describe('PATCH /todos/:id', () => {

  it('Should update the todo', (done) => {
    let id = todos[0]._id.toHexString();
    let todo = {
      text: 'Updated todo',
      isCompleted: true
    }

    request(app)
      .patch('/todos/' + id)
      .send({text: todo.text, isCompleted: todo.isCompleted})
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todo.text);
        expect(res.body.todo.isCompleted).toBe(true);
        expect(res.body.todo.completedAt).toBeA('number');
      })
      .end(done);
  });

  it('Should clear completedAt when todo is not completed', (done) => {
    let id = todos[1]._id.toHexString();
    let todo = {
      text: 'Also updated todo',
      isCompleted: false
    }

    request(app)
      .patch('/todos/' + id)
      .send({text: todo.text, isCompleted: todo.isCompleted})
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todo.text);
        expect(res.body.todo.isCompleted).toBe(false);
        expect(res.body.todo.completedAt).toNotExist();
      })
      .end(done);
  })

});

describe('GET /users/me', () => {
  it('Should return user if authenticated', (done) => {
    request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      })
      .end(done);
  });

  it('Should return a 401 if not authenticated', (done) => {
    request(app)
      .get('/users/me')
      .expect(401)
      .expect((res) => {
        expect(res.body).toEqual({})
      })
      .end(done)
  });
});

describe('POST /users', () => {
  it('Should create a user', (done) => {
    let email = 'yonik@gmail.com';
    let password = 'testlul';

    request(app)
      .post('/users')
      .send({email, password})
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toExist();
        expect(res.body._id).toExist();
        expect(res.body.email).toBe(email);
      })
      .end((err) => {
        if (err) {
          return done(err)          
        }

        User.findOne({email}).then((user) => {
          expect(user).toExist();
          expect(user.password).toNotBe(password);
          done();
        });
      });
  });

  it('Should return validation errors if request is invalid', (done) => {
    request(app)
      .post('/users')
      .send({email: 'yo.com', password: 'lul'})
      .expect(400)
      .end(done);
  });

  it('Should not create user if email is already registered', (done) => {
    request(app)
      .post('/users')
      .send({email: 'yoyo@gmail.com', password: 'testlul'})
      .expect(400)
      .end(done);
  });
});