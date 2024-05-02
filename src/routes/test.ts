import express from 'express';

const router = express.Router();


router.get('/modal', async (req, res) => {

    res.render('test/modal', {});
});


export default router;