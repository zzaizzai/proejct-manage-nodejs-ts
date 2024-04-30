import express from 'express';
import Project from '../models/Project';
import { Task } from '../models/Task';
import { Result } from '../models/Result';
import { sleep }  from '../utils/func_times'

const router = express.Router();

router.get('/test', async (req, res) => {
    await sleep(2000);
    res.send({test: "test"})
})

router.get('/reset_all_tables', async (req, res) => {
    await sleep(2000);
    await Project.resetTable();
    await Task.resetTable();
    await Result.resetTable();
    res.status(200).send({message: 'Succeed Reset Tables'});
})



router.get('/get_all_tasks_with_parent_project_id', async (req, res) => {

    const parentProjectId = parseInt(req.query.parent_project_id as string);
    console.log(parentProjectId)

    const tasks = await Task.getTasksWithParentProjectId(parentProjectId)

    res.status(200).send({tasks: tasks})
})


router.get('/get_all_results_with_parent_task_id', async (req, res) => {

    const parentResultId = parseInt(req.query.parent_project_id as string);
    console.log(parentResultId)

    const tasks = await Result.getAllResultsWithParentTaskId(parentResultId)

    res.status(200).send({tasks: tasks})
})

export default router;