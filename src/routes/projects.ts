// porjects.ts
import express from 'express';
import Project from '../models/Project';

const router = express.Router();

router.get('/', (req, res) => {
    res.render('projects/index', { name: 'project page', message: 'This is the route page' });
});

router.get('/list', async (req, res) => {
    try {
        const projects = await Project.getAllProjects();
        res.render('projects/list', { name: 'show all', projects: projects });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to retrieve projects' });
    }
});

router.get('/reset', async (req, res) => {
    try {
        const projects = await Project.createTable();
        res.redirect('/projects/list')
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to retrieve projects' });
    }
});


router.get('/create', async (req, res) => {

    const name = req.query.name as string;
    const description = req.query.description as string;

    if (!name || !description) {
        return res.status(400).json({ error: 'Missing name or description' });
    }


    try {
        const projects = await Project.createProject(name, description)
        res.redirect('/projects/list')
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to retrieve projects' });
    }
});

export default router;