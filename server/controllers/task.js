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
  await Task.updateOne({ _id: req.params.task_id }, req.body)

  res.end();
}

// Delete task
exports.delete = async (req, res, next) => {
  // Update group
  await Group.updateOne({ _id: req.params.group_id }, { $pull: { task_list: req.params.task_id } });

  // Update students
  const task = await Task.findOne({ _id: req.params.task_id });
  await User.updateMany({ _id: { $in: task.student_list.map(a => a.student_id) } }, { $pull: { task_list: { task_id: req.params.task_id } } })
  
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
