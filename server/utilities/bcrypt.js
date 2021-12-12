const bcrypt = require('bcrypt');

exports.validPassword = function(user, password) {
  return bcrypt.compareSync(password, user.password);
}

exports.generateHash = function(x) {
  return bcrypt.hashSync(x, bcrypt.genSaltSync(8), null);
}
