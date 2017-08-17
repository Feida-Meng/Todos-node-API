var { mongoose } = require('./db/mongoose');




var User = mongoose.model('User',{
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 5
  }
});

//tests should fail
// var yingzheng = new User({});

// var yingzheng = new User({
//   email: 'sf'
// });
//
// var yingzheng = new User({
//   email: false
// });

//tests should pass
// var yingzheng = new User({
//   email: 'yingzheng@qin.com'
// });
//
yingzheng.save().then((doc) => {
  console.log('User saved', doc);
},(err) => {
  console.log('Unable to save user, ', err);
});


// var studyMongodb = new Todo({
//   text: 'Study Mongodb'
// });
//
// studyMongodb.save().then((doc) => {
//   console.log('Saved todo',doc);
// },(err) => {
//   console.log('Unable to save todo');
// });

// var studyNode = new Todo({
//   text: 'Study Node',
//   completed: false,
//   completedAt: 1
//
// });
//
// studyNode.save().then((doc) => {
//   console.log('Todo saved, ', doc);
// },(err) => {
//   console.log('Unable to save todo');
// });

// var newTodo = new Todo({
//   text: ' Go to Mars  '
// });
//
// newTodo.save().then((doc) => {
//   console.log('Todo saved,', doc);
// },(err) => {
//   console.log('Unable to save todo', err.ValidationError);
// })
