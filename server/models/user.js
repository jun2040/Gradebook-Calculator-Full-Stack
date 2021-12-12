const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  group_list: {
    type: [mongoose.ObjectId],
    required: false
  },
  task_list: {
    type: [{
      task_id: mongoose.ObjectId,
      grade: Number
    }],
    required: false
  }
},
{
  timestamps: true
});

const User = mongoose.model('User', userSchema);

module.exports = User;
