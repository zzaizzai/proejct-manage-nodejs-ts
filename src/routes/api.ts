import express from 'express';
import Project from '../models/Project';
import { Task } from '../models/Task';
import { Result } from '../models/Result';
import { sleep }  from '../utils/func_times'

const router = express.Router();

router.post('/test', async (req, res) => {
    const mode = req.query.mode ?? "success"
    const timerStr = req.query.timer as string ?? "1000"
    const timerInt = parseInt(timerStr)

    await sleep(timerInt);

    if (mode == "success") {
        return res.status(200).send({result: "done"})
    } else {
        return res.status(500).send("fail")
    }
})

router.get('/test', async (req, res) => {
    await sleep(2000);
    return res.send({test: "test"})
})

router.get('/reset_all_tables', async (req, res) => {
    await sleep(2000);
    await Project.resetTable();
    await Task.resetTable();
    await Result.resetTable();
    return res.status(200).send({message: 'Succeed Reset Tables'});
})



router.post('/tasks/add', async (req, res) => {
    const name = req.body.name as string;
    const description = req.body.description as string;
    const projectId: number = req.body.project_id as number;

    console.log(projectId)

    if (!name || !description) {
        console.log('no name or description')
        return res.status(400).json({error: "no name or description"})
    }

    try {
        await Task.createTask({name: name, description: description, parentProjectId: projectId, author: 'testuser' })
        return res.status(200).send({result: "good"})
    } catch {

        return res.status(400).send("bed")
    }

})



router.get('/get_all_tasks_with_parent_project_id', async (req, res) => {

    const parentProjectId = parseInt(req.query.parent_project_id as string);
    const tasks = await Task.getTasksWithParentProjectId(parentProjectId)

    return res.status(200).send({tasks: tasks})
})


router.get('/get_all_results_with_parent_task_id', async (req, res) => {

    const parentTaskId = parseInt(req.query.parent_task_id as string);
    const tasks = await Result.getAllResultsWithParentTaskId(parentTaskId)

    return res.status(200).send({tasks: tasks})
})

router.post('/tasks/change_close_state', async (req, res) => {

    const taskId = parseInt(req.body.taskId as string)
    const stateClosed = Boolean(parseInt(req.body.stateClosed as string))

    if (stateClosed === undefined) {
        return res.status(500).send('Something went wrong!');
    }
    const task = await Task.getTaskWithId(taskId)

    await task.setIsClosed()

    return res.status(200).send({data: "good"})
})

export default router;