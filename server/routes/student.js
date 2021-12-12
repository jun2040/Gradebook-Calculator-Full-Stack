const express = require('express');
const router = express.Router();
const student_ctrl = require('../controllers/student');

const { verifyParams } = require('../middlewares/verify');

// GET data
router.get('/get/:group_id/:student_id', verifyParams, student_ctrl.data);

// PUT add
router.put('/add/:group_id/:student_id', verifyParams, student_ctrl.add);

// PUT remove
router.put('/remove/:group_id/:student_id', verifyParams, student_ctrl.remove);

// PUT add task
router.put('/add_task/:group_id/:student_id/:task_id', verifyParams, student_ctrl.add_task);

// PUT edit task
router.put('/edit_task/:group_id/:student_id/:task_id', verifyParams, student_ctrl.edit_task);

// DELETE remove task
router.delete('/remove_task/:group_id/:student_id/:task_id', verifyParams, student_ctrl.remove_task);

module.exports = router;