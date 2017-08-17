var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp', {
  useMongoClient: true
});

var Todo = mongoose.model('Todo', {
  text: {
    type: String
  },
  completed: {
    type: Boolean
  },
  completedAt: {
    type: Number
  }
});

var studyMongodb = new Todo({
  text: 'Study Mongodb'
});

studyMongodb.save().then((doc) => {
  console.log('Saved todo',doc);
},(err) => {
  console.log('Unable to save todo');
});

var studyNode = new Todo({
  text: 'Study Node',
  completed: false,
  completedAt: 1

});

studyNode.save().then((doc) => {
  console.log('Todo saved, ', doc);
},(err) => {
  console.log('Unable to save todo');
});
