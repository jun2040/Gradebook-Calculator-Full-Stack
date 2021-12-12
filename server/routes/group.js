const express = require('express');
const router = express.Router();
const group_ctrl = require('../controllers/group');

const { verifyParams } = require('../middlewares/verify');

// GET student data
router.get('/get_students/:group_id', verifyParams, group_ctrl.dataStudents);

// GET task data
router.get('/get_tasks/:group_id', verifyParams, group_ctrl.dataTasks);

// POST create
router.post('/create', group_ctrl.create);

// PUT edit
router.put('/edit/:group_id', verifyParams, group_ctrl.edit);

// DELETE delete
router.delete('/delete/:group_id', verifyParams, group_ctrl.delete);

module.exports = router;