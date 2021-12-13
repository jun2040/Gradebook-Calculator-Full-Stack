const express = require('express');
const router = express.Router();
const users_ctrl = require('../controllers/users');
const { verifyToken } = require('../middlewares/authenticate');

// GET profile
router.get('/profile', verifyToken, users_ctrl.profile);

// GET profile student
router.get('/get_student', verifyToken, users_ctrl.dataStudent)

// GET data
router.get('/get', verifyToken, users_ctrl.data);

module.exports = router;
