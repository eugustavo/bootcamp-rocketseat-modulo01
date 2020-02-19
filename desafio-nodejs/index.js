const express = require('express');

const server = express();
server.use(express.json());

let count=0;
const projects = [{id: "1", title: "Novo Projeto", tasks:[]}, {id: "2", title: "Em busca do FullStack", tasks:[]} ];



server.use((req, res, next) => {
  count=count+1;
  console.log(`Requests made so far: ${count}`);
  next();
});

function projectIdExist(req, res, next){
  const { id } = req.params;
  
  const aux = projects.find(project => project.id === id);
  if(!aux){
    return res.status(400).json({ error: 'Project not found' });
  }

  req.project = aux;
  return next();
}



server.get('/projects', (req, res) => {
  return res.json(projects);
});



server.post('/projects', (req, res) => {
  const { id, title } = req.body;
  projects.push({id, title, tasks:[title]});

  return res.json(projects);
});



server.post('/projects/:id/tasks', projectIdExist, (req, res) => {
  const { title } = req.body;

  req.project.tasks.push(title);

  return res.json(projects);
});



server.put('/projects/:id', projectIdExist, (req, res) => {
  const { title } = req.body;

  req.project.title = title;

  return res.json(req.project);
});



server.delete('/projects/:id', projectIdExist, (req, res) => {
  const { id } = req.params;
  
  const aux = projects.findIndex(project => project.id === id);
  projects.splice(aux, 1);

  return res.json(projects);
});


server.listen(3333);