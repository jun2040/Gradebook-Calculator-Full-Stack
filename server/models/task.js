const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  max_grade: {
    type: Number,
    required: true
  },
  assign_date: {
    type: String,
    required: false
  },
  due_date: {
    type: String,
    required: false
  },
  teacher_id: {
    type: mongoose.ObjectId,
    required: true
  },
  group_id: {
    type: mongoose.ObjectId,
    required: true
  },
  student_list: {
    type: [{
      student_id: mongoose.ObjectId,
      grade: Number
    }],
    required: false
  }  
},
{
  timestamps: true
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
