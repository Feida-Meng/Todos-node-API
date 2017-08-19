const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const todos = [{
  _id: new ObjectID(),
  text: 'be the boss'
},{
  _id: new ObjectID(),
  text: 'be the superboss',
  completed: true,
  completedAt: 333
},{
  _id: new ObjectID(),
  text: 'be the biggest boss'
}];

beforeEach((done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);
  }).then(() => done());
});

describe('GET /todos',() => {
  it('should return all todos', (done) => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(3);
      })
      .end(done);
  });
});

describe('POST /todos/new', () => {
  it('should create a new todo', (done) => {
    var text = 'Test todo text';
    request(app)
    .post('/todos/new')
    .send({text})
    .expect(200)
    .expect((res) => {
      expect(res.body.text).toBe(text);
    })
    .end((err,res) => {
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

  it('should not create a new todo with invalid request body', (done) => {
    request(app)
    .post('/todos/new')
    .send({})
    .expect(400)
    .end((err,res) => {
      if (err) {
        return done(err);
      }
      Todo.find().then((todos) => {
        expect(todos.length).toBe(3);
        done();
      }).catch((e) => done(e));
    });
  });
});

describe('GET /todos/:id',() => {
  it('should get the todo with the id privided', (done) => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect((resp) => {
        // console.log(resp.body);
        expect(resp.body.todo.text).toBe(todos[0].text);
      })
      .end(done)
  });

  it('should return 404 if todo not found', (done) => {
    request(app)
      .get(`/todos/699864a6c07b420344925092`)
      .expect(404)
      .end(done);
  });

  it('should return 404 for invalid id',(done) => {
    request(app)
      .get(`/todos/599864a6c07b420344925092bb`)
      .expect(404)
      .end(done);
  });
});

describe('Delete /todos/:id', ()=> {
  it('should remove a todo',(done) => {
    var idStr = todos[0]._id.toHexString();
    request(app).
      delete(`/todos/${idStr}`)
      .expect(200)
      .expect((result) => {
        expect(result.body.todo._id).toBe(idStr);
      })
      .end((err,resp) => {
        if (err) {
          return done(err);
        }
        Todo.findById(idStr).then((todo) => {
          expect(todo).toNotExist();
          done();
        }).catch((e) => done(e));
      });
  });

  it('should return 404 if id is invalid', (done) => {
    request(app)
      .delete(`/todos/123`)
      .expect(404)
      .end(done);
  });

  it('should return 404 if id is not found', (done) => {
    request(app)
      .delete(`/todos/${new ObjectID()}`)
      .expect(404)
      .end(done)
  })

});

describe('Patch /todos/:id', () => {
  var id = todos[1]._id.toHexString();
  var text = 'New test';
  it('should update the todo', (done) => {
    request(app)
      .patch(`/todos/${id}`)
      .send({
        completed: true,
        text
      })
      .expect(200)
      .expect((resp) => {
        expect(resp.body.todo.text).toBe(text);
        expect(resp.body.todo.completed).toBe(true);
        expect(resp.body.todo.completedAt).toBeA('number');
      })
      .end(done);
  });

  it('should clear completedAt when todo is not completed',(done) => {
    var id = todos[1]._id.toHexString();
    var text = 'new text 2';

    request(app)
      .patch(`/todos/${id}`)
      .send({
        completed: false,
        text
      })
      .expect(200)
      .expect((resp) => {
        expect(resp.body.todo.text).toBe(text);
        expect(resp.body.todo.completed).toBe(false);
        expect(resp.body.todo.completedAt).toNotExist();
      })
      .end(done);
  });

});
