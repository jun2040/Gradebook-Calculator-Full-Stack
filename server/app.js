// Initialize modules
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const logger = require('morgan');
const flash = require('connect-flash');

const { verifyParams } = require('./middlewares/verify');
const { verifyToken } = require('./middlewares/authenticate');

require('dotenv').config();

const corsOptions = {
  credentials: true,
  origin: ['http://localhost:8080']
}

// Initialize server routes
const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');
const groupRouter = require('./routes/group');
const taskRouter = require('./routes/task');
const studentRouter = require('./routes/student');

// Define express app
const app = express();

require('./config/database')(app, process.env.DB_URL);

// Define middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());

app.use(cors(corsOptions));

// Define router middlewares
app.use('/api/users', usersRouter);
app.use('/api/auth', authRouter);
app.use('/api/group', verifyToken, groupRouter);
app.use('/api/task', verifyToken, taskRouter);
app.use('/api/student', verifyToken, studentRouter);

// Export express app
module.exports = app;
