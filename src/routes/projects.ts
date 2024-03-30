// porjects.ts
import express from 'express';
import Project from '../models/Project';

const router = express.Router();

router.get('/', (req, res) => {
    res.render('projects/index', { name: 'project page', message: 'This is the route page' });
  });

  router.get('/show', (req, res) => {
    const project = new Project({ name: 'test', description: 'good' });
    res.json(project)
  })


export default router;