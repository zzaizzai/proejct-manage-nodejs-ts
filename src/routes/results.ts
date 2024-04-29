// porjects.ts
import express from 'express';
import Result from '../models/Result';
import Task from '../models/Task'
import Project from '../models/Project'

const router = express.Router();

router.get('/list', async (req, res) => {

    const results = await Result.getAllResults()

    res.render('results/list', { name: 'project page', message: 'This is the route page', items: results });
});

router.get('/reset', async (req, res) => {
    try {
        await Result.resetTable();
        res.redirect('/results/list')
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to retrieve projects' });
    }
});

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
        await Result.createResult({name: name, description: description, parentProjectId: parentProjectIdNumber})
        return res.redirect('/results/list')
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to retrieve projects' });
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

        const result = await Result.getResultWithId(idNumber);
        
        const project = await Project.getProjectWithId(idNumber)

        res.render('results/detail', { projectInformation: {id: project.id } , item: result, parentItem: project });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to retrieve projects' });
    }
});



export default router;