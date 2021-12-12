const mongoose = require('mongoose');

const User = require('../models/user');
const Group = require('../models/group');
const Task = require('../models/task');

exports.verifyParams = (req, res, next) => {
  let isParamValid = true;

  for (param in req.params) {
    if (!mongoose.Types.ObjectId.isValid(req.params[param])) {
      isParamValid = false;
      break;
    }
  }

  if (isParamValid) {
    next();
  } else {
    res.status(400).send();
  }
}


exports.verifyRegister = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email })
    .catch((err) => {
      console.log(err);
    })
  
  console.log('a')

  if (user) {
    res.status(500).send({ message: 'Email already in use' });
    return;
  }

  next();
}
