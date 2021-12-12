const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const groupSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  block: {
    type: String,
    required: true
  },
  start_time: {
    type: String,
    required: false
  },
  end_time: {
    type: String,
    required: false
  },
  teacher_id: {
    type: mongoose.ObjectId,
    required: true
  },
  student_list: {
    type: [mongoose.ObjectId],
    required: false
  },
  task_list: {
    type: [mongoose.ObjectId],
    required: false
  }
},
{
  timestamps: true
});

const Group = mongoose.model('Group', groupSchema);

module.exports = Group;
