const User = require('../models/user');
const Group = require('../models/group');
const Task = require('../models/task');

const { toLetter } = require('../utilities/grade');

// Return tasks that are assigned to the student
exports.data = async (req, res, next) => {
  // Get student
  const student = await User.findOne({ _id: req.params.student_id });

  // Get group
  const group = await Group.findOne({ _id: req.params.group_id });

  // Define global routes
  const routes = {
    add: `/student/add_task/${req.params.group_id}/${req.params.student_id}/`,
    edit: `/student/edit_task/${req.params.group_id}/${req.params.student_id}/`,
    delete: `/student/remove_task/${req.params.group_id}/${req.params.student_id}/`
  }

  // Get all tasks
  const all_tasks_query = {
    $and: [
      { _id: { $in: group.task_list } },
      { _id: { $nin: student.task_list.map(a => a.task_id) } }
    ]
  };
  const all_tasks = await Task.find(all_tasks_query);

  // Initialize options array
  let options = [];

  // Add options
  for (const task of all_tasks) {
    let t = {
      id: task._id,
      name: task.name,
      routes: {
        add: routes.add + task._id
      }
    };

    options.push(t);
  }

  // Define next link
  const nxt = `/student/${req.params.group_id}/${req.params.student_id}`;

  const headers = [
    {
      id: 'name',
      name: 'Task',
      type: 'text',
      isEditable: false,
      required: false
    },
    {
      id: 'assign_date',
      name: 'Assign Date',
      type: 'date',
      isEditable: false,
      required: false
    },
    {
      id: 'due_date',
      name: 'Due Date',
      type: 'date',
      isEditable: false,
      required: false
    },
    {
      id: 'grade',
      name: 'Grade',
      type: 'number',
      isEditable: true,
      required: false
    },
    {
      id: 'percent_grade',
      name: 'Percent Grade',
      type: 'text',
      isEditable: false,
      required: false
    },
    {
      id: 'letter_grade',
      name: 'Letter Grade',
      type: 'text',
      isEditable: false,
      required: false
    }
  ];

  // Retrieve tasks
  const tasks = await Task.find({ _id: { $in: student.task_list.map(a => a.task_id) } });

  // Initialize table content array
  let contents = [];

  // Fill table content
  for (const task of tasks) {
    let grade = student.task_list.find(a => {
      return a.task_id.toString() === task._id.toString()
    }).grade;

    let percent;

    if (grade) {
      percent = (grade / task.max_grade * 100).toFixed(2);
    } else {
      grade = '-'
      percent = '-'
    }
    
    let t = {
      name: task.name,
      assign_date: task.assign_date,
      due_date: task.due_date,
      max_grade: task.max_grade,
      grade: grade,
      percent_grade: percent + '%',
      letter_grade: toLetter(percent),
      link: nxt,
      routes: {
        edit: routes.edit + task._id,
        delete: routes.delete + task._id
      }
    };

    contents.push(t);
  }

  // Create payload
  const payload = {
    title: 'Assignments',
    options: options,
    routes: routes,
    headers: headers,
    contents: contents
  }

  //console.log(payload)

  // Send student data
  res.send(payload);
}

// Add student to group
exports.add = async (req, res, next) => {
  // Query group
  const group_query = { _id: req.params.group_id };
  const group_push = { $push: { student_list: req.params.student_id } };

  // Update group's student list
  await Group.updateOne(group_query, group_push);

  // Query student
  const student_query = { _id: req.params.student_id };
  const student_push = { $push: { group_list: req.params.group_id } };

  // Update student's group list
  await User.updateOne(student_query, student_push);

  res.end();
}

// Edit student profile
exports.edit = async (req, res, next) => {
  res.end();
}

// Remove student from group
exports.remove = async (req, res, next) => {
  const group = await Group.findOne({ _id: req.params.group_id });
  const student = await User.findOne({ _id:  req.params.student_id });

  // Update group's student list
  const group_query = { _id: req.params.group_id };
  const group_pull = { $pull: { student_list: req.params.student_id } };

  await Group.updateOne(group_query, group_pull);

  // Update all tasks' student list
  const task_query = { 
    $and: [
      {
        _id: { 
          $in: student.task_list.map(a => a.task_id) 
        }
      },
      {
        _id: {
          $in: group.task_list
        }
      }
    ]
  };
  const task_pull = {
    $pull: { 
      student_list: { 
        student_id: req.params.student_id 
      } 
    } 
  };
  await Task.updateMany(task_query, task_pull);

  console.log(await Task.find(task_query));

  // Update student's group list
  const student_query = { _id: req.params.student_id };
  const student_pull = { $pull: { group_list: req.params.group_id } };
  await User.updateOne(student_query, student_pull);

  // Update student's task list
  const student_pull_2 = { 
    $pull: { 
      task_list: { 
        task_id: { $in: group.task_list } 
      } 
    } 
  };
  await User.updateOne(student_query, student_pull_2);

  res.end();
}

// Assign task to student
exports.add_task = async (req, res, next) => {
  // Update student's task list
  const student_push = { 
    $push: { 
      task_list: { 
        task_id: req.params.task_id,
        grade: null
      } 
    } 
  };
  await User.updateOne({ _id: req.params.student_id }, student_push);
  
  // Update task's student list
  const task_push = {
    $push: {
      student_list: {
        student_id: req.params.student_id,
        grade: null
      }
    }
  };
  await Task.updateOne({ _id: req.params.task_id }, task_push);

  res.end();
}

// Edit assigned task to student
exports.edit_task = async (req, res, next) => {
  // Update student list
  const student_query = {
    _id: req.params.student_id, 
    'task_list.task_id': req.params.task_id
  };
  const student_set = {
    $set: {
      'task_list.$.grade': parseInt(req.body.grade)
    }
  };
  await User.updateOne(student_query, student_set).then(res => console.log(res));

  // Update task list
  const task_query = { 
    _id: req.params.task_id, 
    'student_list.student_id': req.params.student_id
  };
  const task_set = {
    $set: {
      'student_list.$.grade': parseInt(req.body.grade)
    }
  };
  await Task.updateOne(task_query, task_set).then(res => console.log(res));

  res.end();
}

// Remove task from student
exports.remove_task = async (req, res, next) => {
  // Update student's task list
  const student_pull = { 
    $pull: { 
      task_list: { 
        task_id: req.params.task_id
      } 
    } 
  };
  await User.updateOne({ _id: req.params.student_id }, student_pull).then((res) => console.log(res));
  
  // Update task's student list
  const task_pull = {
    $pull: {
      student_list: {
        student_id: req.params.student_id
      }
    }
  };
  await Task.updateOne({ _id: req.params.task_id }, task_pull).then((res) => console.log(res));

  console.log(req.params)

  res.end();
}
