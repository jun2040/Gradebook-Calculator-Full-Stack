const express = require('express');
const router = express.Router();
const group_ctrl = require('../controllers/group');

const { verifyParams } = require('../middlewares/verify');

// GET profile
router.get('/profile/:group_id', verifyParams, group_ctrl.profile);

// GET student data
router.get('/get_students/:group_id', verifyParams, group_ctrl.dataStudents);

// GET task data
router.get('/get_tasks/:group_id', verifyParams, group_ctrl.dataTasks);

// GET student's group data
router.get('/profile_student/:group_id', verifyParams, group_ctrl.profileStudent)

// GET student's task data
router.get('/get_tasks_student/:group_id', verifyParams, group_ctrl.dataStudentsTasks);

// POST create
router.post('/create', group_ctrl.create);

// PUT edit
router.put('/edit/:group_id', verifyParams, group_ctrl.edit);

// DELETE delete
router.delete('/delete/:group_id', verifyParams, group_ctrl.delete);

module.exports = router;