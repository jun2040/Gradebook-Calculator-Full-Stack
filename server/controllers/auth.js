const User = require('../models/user');
const Group = require('../models/group');
const Task = require('../models/task');

require('dotenv').config();

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.login = async (req, res, next) => {
  // Find user
  const user = await User.findOne({ email: req.body.email })
    .catch((err) => {
      console.log(err);
    });

  // Check if user exists
  if (!user) {
    return res.status(404).send({ message: 'User not found' });
  }

  // Check password
  if (!bcrypt.compareSync(req.body.password, user.password)) {
    return res.status(401).send({
      accessToken: null,
      message: 'Invalid password'
    })
  }

  // Generate JWT
  let token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, {
    expiresIn: 60 * 60 * 12
  });

  // Send user
  res.status(200).send({
    _id: user._id,
    email: user.email,
    accessToken: token
  });
}

exports.register = async (req, res, next) => {
  const user_info = req.body;
  user_info.password = bcrypt.hashSync(req.body.password, 8)

  const user = await new User(user_info);

  user.save((err, user) => {
    if(err) {
      res.status(500).send({ message: err });
      return;
    }
  });

  res.send({ message: 'User was successfully registered' });
}
