// porjects.ts
import express from 'express';
import Project from '../models/Project';
import { Task } from '../models/Task';

const router = express.Router();


router.get('/flashtest', (req, res) => {
    req.flash('waring', 'waring')
    req.flash('success', 'success')
    res.redirect('/projects')
})


router.get('/', (req, res) => {
    res.render('projects/index',
        {
            name: 'project page',
            flash_waring_msgs: req.flash('waring'),
            flash_success_msgs: req.flash('success')
        }
    );
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
        await Project.resetTable();
        res.redirect('/projects/list')
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to retrieve projects' });
    }
});

router.get('/detail', async (req, res) => {

    const idString = req.query.id as string;
    const idNumber = parseInt(idString, 10);

    if (isNaN(idNumber)) {
        console.error('Failed to parse id:', idString);
        return res.status(500).json({ error: 'Bed Method' });
    }


    try {

        const projects = await Project.getProjectsWithId(idNumber);
        const tasks = await Task.getTasksWithParentProjectId(idNumber)

        if (!projects.length) {
            return res.redirect('/projects/list')
        }

        res.render('projects/detail', { projectInformation: { id: projects[0].id }, items: projects, childItems: tasks });
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