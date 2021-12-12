const express = require('express');
const router = express.Router();
const users_ctrl = require('../controllers/users');
const { verifyToken } = require('../middlewares/authenticate');

// GET data
router.get('/get', verifyToken, users_ctrl.data);

module.exports = router;
