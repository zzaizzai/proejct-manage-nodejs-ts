// porjects.ts
import express from 'express';
import { Task } from '../models/Task';

const router = express.Router();

router.get('/', (req, res) => {
    res.render('tasks/index', { name: 'task page', message: 'This is the route page' });
});

router.get('/list', async (req, res) => {
    const tasks = await Task.getAllTasks();

    res.render('tasks/list', { name: 'task page', tasks: tasks });
});

router.get('/reset', async (req, res) => {
    try {
        await Task.resetTable();
        res.redirect('/tasks/list')
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to retrieve projects' });
    }
});

router.post('/add', async (req, res) => {
    const name = req.body.name as string;
    const description = req.body.description as string;
    const projectId: number | undefined = req.body.project_id;
    console.log(name, description, projectId)


    if (!name || !description) {
        console.log('no name or description')
        return res.redirect(`/projects/detail?id=${projectId}`)
    }

    await Task.createTask({name: name, description: description, parentProjectId: projectId, author: 'testuser' })
    return res.redirect(`/projects/detail?id=${projectId}`)

})

router.get('/create', async (req, res) => {

    const name = req.query.name as string;
    const description = req.query.description as string;
    const parentProjectIdStr = req.query.parentProjectId as string;
    const parentProjectIdNumber = parseInt(parentProjectIdStr, 10);

    if (isNaN(parentProjectIdNumber)) {
        console.error('Failed to parse id:', parentProjectIdNumber);
        return res.status(500).json({ error: 'Bed Method' });
    }


    if (!name || !description) {
        return res.status(400).json({ error: 'Missing name or description' });
    }


    try {
        await Task.createTask({name: name, description: description, parentProjectId: parentProjectIdNumber})
        return res.redirect('/tasks/list')
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to retrieve projects' });
    }
});

export default router;