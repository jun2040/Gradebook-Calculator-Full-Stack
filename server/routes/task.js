const express = require('express');
const router = express.Router();
const task_ctrl = require('../controllers/task');

const { verifyParams } = require('../middlewares/verify');

// GET data
router.get('/get/:group_id/:task_id', verifyParams, task_ctrl.data);

// POST create
router.post('/create/:group_id', verifyParams, task_ctrl.create);

// PUT edit
router.put('/edit/:group_id/:task_id', verifyParams, task_ctrl.edit);

// DELETE delete
router.delete('/delete/:group_id/:task_id', verifyParams, task_ctrl.delete);

// PUT add student
router.put('/add_student/:group_id/:task_id/:student_id', verifyParams, task_ctrl.add_student);

// PUT edit student
router.put('/edit_student/:group_id/:task_id/:student_id', verifyParams, task_ctrl.edit_student);

// PUT remove student
router.put('/remove_student/:group_id/:task_id/:student_id', verifyParams, task_ctrl.remove_student);

module.exports = router;
