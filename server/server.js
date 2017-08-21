require("./config/config");

const _ = require('lodash');
var express = require('express');
var bodyParser = require('body-parser');
var { ObjectID } = require('mongodb');

var { mongoose } = require('./db/mongoose');
var { Todo } = require('./models/todo');
var { User } = require('./models/user');
var { authenticate } = require('./middleware/authenticate');

var app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

app.get('/users/currentuser',authenticate,(req, resp) => {
  resp.send(req.user);
});

//get all todos
app.get('/todos',(req,resp) => {
  Todo.find().then((todos) => {
    resp.send({todos});
  },(err) => {
    resp.status(400).send();
  });
});

//create new todo(s)
app.post('/todos/new',(req, resp) => {
  var todo = new Todo({
    text: req.body.text
  });

  todo.save().then((doc) => {
    resp.send(doc);
  }, (err) => {
    resp.status(400).send();
  });

});

//get a single todo by id
app.get('/todos/:id',(req,resp) => {
  var id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return resp.status(404).send('Invalid ID!');
  }

  Todo.findById(id).then((todo) => {
    if (!todo) {
      return resp.status(404).send('Unable to find todo id');
    }
    resp.send({todo});
  }).catch((err) => {
    resp.status(400).send();
  });

});

//Update a todo
app.patch('/todos/:id',(req,resp) => {
  var id = req.params.id;
  var body = _.pick(req.body, ['text','completed']); //security

  if (!ObjectID.isValid(id)) {
    return resp.status(404).send();
  }

  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findByIdAndUpdate(id, {$set: body}, {new:true}).then((todo) =>{
    if (!todo) {
      console.log('hah');
      return resp.status(404).send();
    }

    resp.status(200).send({todo});
  }).catch((err) => {
    resp.status(400).send();
  });

});

//remove a single todos
app.delete('/todos/:id',(req, resp) => {
  var id = req.params.id
  if (!ObjectID.isValid(id)) {
    return resp.status(404).send("In valid ID");
  }

  Todo.findByIdAndRemove(id).then((todo) => {
    if (!todo) {
      return resp.status(404).send('Todo not found');
    }
    return resp.status(200).send({todo});
  }).catch((err) => {
    resp.status(400).send();
  });

});

//-------------Todo--/\-----User-\/-------------------

//New user
app.post('/users/new', (req,resp) => {
  var body = _.pick(req.body, ['email','password']);
  var user = new User(body);
  console.log('user1: ', user);
  user.save().then((user) => {
    console.log('user2: ', user);
    return user.generateAuthToken();
  }).then(( token) => {
    console.log('user3: ', user);
    resp.status(200).header('x-auth',token).send(user);
  }).catch((err) => {
    resp.status(400).send(err);
  });
});


//--------------------User-/\----------------------------


app.listen(port, () => {
  console.log(`Started on port ${port}`);
});

module.exports = { app };
