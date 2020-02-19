const express = require('express');

const server = express();
server.use(express.json());
const users = ['Gustavo', 'Jordan', 'Debs'];

// Query Params = ?users=1
// Route Params = /users/1
// Request Body = { "name": "Gustavo", "email": "gustavosouza@rocketseat" }

// Middleware Global
server.use((req, res, next) => {
  console.time('Request');
  console.log(`Método: ${req.method}; URL: ${req.url}`);
  
  next();

  console.timeEnd('Request');
});

// Middleware para checar se o "name" está sendo enviado
function checkUserExist(req, res, next){
  if(!req.body.name){
    return res.status(400).json({ error: 'Name is required!'});
  }
  return next();
}

//Middleware para checar se o usuário existe no Array de usuários
function checkUserInArray(req, res, next){
  const user = users[req.params.index];
  
  if(!user){
    return res.status(400).json({ error: 'User does not exists!' });
  }

  req.user = user;
  return next();
}

// Lista todos os usuários
server.get('/users', (req, res) => {
  return res.json(users);
});

// Lista um usuário
server.get('/users/:index', checkUserInArray, (req, res) => {
  return res.json(req.user);
});

// Cria um usuário
server.post('/users', checkUserExist, (req, res) => {
  const { name } = req.body;

  users.push(name);
  
  return res.json(users);
});

// Altera um usuário
server.put('/users/:index', checkUserExist, checkUserInArray, (req, res) => {
  const { index } = req.params;
  const { name } = req.body;

  users[index] = name;
  return res.json(users);
});

// Deleta um usuário
server.delete('/users/:index', checkUserInArray, (req, res) => {
  const { index } = req.params;

  users.splice(index, 1);
  return res.send();
});

//N° da porta que irá rodar a aplicação
server.listen(3333);