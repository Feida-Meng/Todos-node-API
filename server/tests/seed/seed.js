const jwt = require('jsonwebtoken');
const { ObjectID } = require('mongodb');

const { Todo } = require('./../../models/todo');
const { User } = require('./../../models/user');

const user1Id = new ObjectID();
const user2Id = new ObjectID();
const users = [{
  _id: user1Id,
  email: 'user1@testing.com',
  password: 'asfdasf',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: user1Id, access:'auth'}, 'asdfaf').toString()
  }]
}, {
  _id: user2Id,
  email: 'user2@testing.com',
  password: 'efdrewsrrdg',
}];

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

const populateTodos = (done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);
  }).then(() => done());
};

const populateUsers = (done) => {
  User.remove({}).then(() => {
    var user1 = new User(users[0]).save();
    var user2 = new User(users[1]).save();

    return Promise.all([user1, user2]);
  }).then(() => done());
};


module.exports = { todos, populateTodos, users, populateUsers };
