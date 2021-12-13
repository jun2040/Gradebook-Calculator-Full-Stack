const User = require('../models/user');
const Group = require('../models/group');
const Task = require('../models/task');

// Return students with this task assigned
exports.data = async (req, res, next) => {

  // Send task data
  res.send();
}

// Create task in a group
exports.create = async (req, res, next) => {
  // Get task parameters
  const task = req.body;

  // Get user
  task.teacher_id = req.user.id;

  // Get target group
  task.group_id = req.params.group_id;

  // Create new task document
  const newTask = await new Task(task).save();

  // Query group
  const group_query = { _id: req.params.group_id };
  const group_push = { $push: { task_list: newTask._id } };

  // Update group's task list
  await Group.findOneAndUpdate(group_query, group_push);

  res.end();
}

// Edit task
exports.edit = async (req, res, next) => {
  // Set max grade for task
  //await Task.updateOne({ _id: req.params.task_id }, req.body);
  // Get task
  const task = await Task.findOne({ _id: req.params.task_id });

  for (const student of task.student_list) {
    const student_query = { 
      _id: student.student_id, 
      'task_list.task_id': req.params.task_id,
      'task_list.grade': { $gt: req.body.max_grade }
    };
    const student_set = { 
      $set: { 
        'task_list.$.grade': req.body.max_grade 
      } 
    };
    await User.updateOne(student_query, student_set);

    const task_query = {
      _id: req.params.task_id, 
      'student_list.student_id': student.student_id,
      'student_list.grade': { $gt: req.body.max_grade }
    }
    const task_set = {
      $set: { 'student_list.$.grade': req.body.max_grade }
    }
    await Task.updateOne(task_query, task_set);
  }

  await Task.updateOne({ _id: req.params.task_id }, req.body);

  

  // Get all students with changing needed
  //const students = await User.find({ _id:  })

  // Update student's max grade
  /* const assigned_students_query = {
    'task_list.task_id': req.params.task_id,
    'task_list.grade': { $gt: req.body.max_grade }
  };

  const assigned_students_set = {
    $set: {
      'task_list.$.grade': req.body.max_grade
    }
  };
  await User.updateMany(assigned_students_query, assigned_students_set).then(res => console.log(res));

  const students = await User.find(assigned_students_query);

  for (const student of students) {
    const task_query = {
      _id: req.params.task_id,
      'student_list.student_id': student._id,
      'student_list.grade': { $gt: req.body.max_grade }
    }
  
    await Task.updateMany(task_query, { $set: { 'student_list.$.grade': req.body.max_grade } }).then(res => console.log(res));
  } */

  res.end();
}

// Delete task
exports.delete = async (req, res, next) => {
  // Update group
  await Group.updateOne({ _id: req.params.group_id }, { $pull: { task_list: req.params.task_id } });

  // Update students
  const task = await Task.findOne({ _id: req.params.task_id });

  if (task) {
    await User.updateMany({ _id: { $in: task.student_list.map(a => a.student_id) } }, { $pull: { task_list: { task_id: req.params.task_id } } })
  }
  
  // Delete task
  await Task.deleteOne({ _id: req.params.task_id });
  
  res.end();
}

// Add student to task
exports.add_student = async (req, res, next) => {
  res.end();
}

// Edit student grade
exports.edit_student = async (req, res, next) => {
  res.end();
}

// Remove student from task
exports.remove_student = async (req, res, next) => {
  res.end();
}
