var express = require('express');
var bodyParser = require('body-parser');

var { ObjectID } = require('mongodb');
var { mongoose } = require('./db/mongoose');
var { Todo } = require('./models/todo');
var { User } = require('./models/user');

var app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

//get all todos
app.get('/todos',(req,res) => {
  Todo.find().then((todos) => {
    res.send({todos});
  },(err) => {
    res.status(400).send();
  });
});

//create new todo(s)
app.post('/todos/new',(req, res) => {
  var todo = new Todo({
    text: req.body.text
  });

  todo.save().then((doc) => {
    res.send(doc);
  }, (err) => {
    res.status(400).send();
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

app.listen(port, () => {
  console.log(`Started on port ${port}`);
});

module.exports = { app };
