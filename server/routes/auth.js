const express = require('express');
const router = express.Router();
const auth_ctrl = require('../controllers/auth');

const { verifyRegister } = require('../middlewares/verify');

// POST login
router.post('/login', auth_ctrl.login);

// POST register
router.post('/register', verifyRegister, auth_ctrl.register);

module.exports = router;