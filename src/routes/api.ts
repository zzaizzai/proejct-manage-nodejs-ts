import express from 'express';
import Project from '../models/Project';
import { Task } from '../models/Task';
import { Result } from '../models/Result';

const router = express.Router();

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

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

export default router;