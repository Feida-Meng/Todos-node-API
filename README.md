# Todos-node-API
A todo list node API, my first node/express + MongoDB/Mongoose project.

-Create a user:          

POST    https://todo-list-nodeapi.herokuapp.com/users/new

request body: {"email": "user@gmail.com", "password": "23412412rd"}

-----------------------------------------------------------------------------------------------------

-Login:                  POST    https://todo-list-nodeapi.herokuapp.com/users/login

request body: {"email": "user@gmail.com", "password": "23412412rd"}

-----------------------------------------------------------------------------------------------------

-Logout:                 DELETE  https://todo-list-nodeapi.herokuapp.com/users/currentuser/logout

Create a new todo:      POST    https://todo-list-nodeapi.herokuapp.com/todos/new

request body: {"text": "Need to go to moon at 6pm"}

-----------------------------------------------------------------------------------------------------

Fetch all todo:         GET     https://todo-list-nodeapi.herokuapp.com/todos

-----------------------------------------------------------------------------------------------------

Fetch one todo by id:   GET     https://todo-list-nodeapi.herokuapp.com/todos/:id

-----------------------------------------------------------------------------------------------------

Update one todo by id:  PATCH   https://todo-list-nodeapi.herokuapp.com/todos/:id

request body: {"text": "Need to hunt aliens"}

-----------------------------------------------------------------------------------------------------

Delete one todo by id:  DELETE  https://todo-list-nodeapi.herokuapp.com/todos/:id


