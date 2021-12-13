const User = require('../models/user');
const Group = require('../models/group');
const Task = require('../models/task');

const { toLetter } = require('../utilities/grade');

// Return group profile
exports.profile = async (req, res, next) => {
  const group = await Group.findOne({ _id: req.params.group_id });

  if (!group) {
    res.status(404).send({ message: 'Group doesn\'t exist' });
    return;
  }

  const payload = {
    name: group.name,
    block: group.block,
    start_time: group.start_time,
    end_time: group.end_time,
    student_num: group.student_list.length,
    task_num: group.task_list.length
  };

  res.send(payload);
}

exports.profileStudent = async (req, res, next) => {
  const group = await Group.findOne({ _id: req.params.group_id });
  const student = await User.findOne({ _id: req.user.id });

  if (!group || !student) {
    res.status(404).send({ message: 'Group doesn\'t exist' });
    return;
  }

  const tasks_query = {
    $and: [
      { _id: { $in: group.task_list } },
      { _id: { $in: student.task_list.map(a => a.task_id) } }
    ]
  };
  const tasks = await Task.find(tasks_query);

  console.log(tasks)

  const payload = {
    name: group.name,
    block: group.block,
    start_time: group.start_time,
    end_time: group.end_time,
    task_num: tasks.length
  };

  res.send(payload);
}

// Return students in the group
exports.dataStudents = async (req, res, next) => {
  // Get group
  const group = await Group.findOne({ _id: req.params.group_id });

  if (!group) {
    res.status(404).send({ message: 'Group doesn\'t exist' });
    return;
  }

  // Define global routes
  const routes = {
    add: 'student/add/' + req.params.group_id + '/',
    remove: 'student/remove/' + req.params.group_id + '/'
  };

  // Get all students
  const all_students_query = { 
    $and: [
      { role: 'student' }, 
      { 
        _id: { $nin: group.student_list } 
      }
    ]
  }
  const all_students = await User.find(all_students_query, { password: 0 });

  // Initialize options array
  let options = [];

  // Add options
  for (const student of all_students) {
    let s = {
      id: student._id,
      name: `${student.first_name} ${student.last_name} (${student.email})`,
      routes: {
        add: routes.add + student._id
      }
    };

    options.push(s);
  }

  // Define next link
  const nxt = '/student/' + req.params.group_id + '/';

  // Define table header
  const headers = [
    {
      id: 'first_name',
      name: 'First Name',
      type: 'text',
      isEditable: false,
      required: false
    },
    {
      id: 'last_name',
      name: 'Last Name',
      type: 'text',
      isEditable: false,
      required: false
    },
    {
      id: 'email',
      name: 'Email',
      type: 'email',
      isEditable: false,
      required: false
    },
    {
      id: 'percent_avg',
      name: 'Average Percent',
      type: 'text',
      isEditable: false,
      required: false
    },
    {
      id: 'letter_avg',
      name: 'Average Letter',
      type: 'text',
      isEditable: false,
      required: false
    },
    {
      id: 'task_num',
      name: 'Assigned Task #',
      type: 'number',
      isEditable: false,
      required: false
    }
  ];

  // Retrieve students
  const students = await User.find({ _id: { $in: group.student_list } });

  // Initialize table content array
  let contents = [];

  // Fill table content
  for (const student of students) {
    let s = {
      first_name: student.first_name,
      last_name: student.last_name,
      email: student.email,
      link: nxt + student._id,
      routes: {
        add: routes.add + student._id,
        remove: routes.remove + student._id
      }
    };

    const task_query = {
      $and: [
        { _id: { $in: group.task_list } },
        { _id: { $in: student.task_list.map(a => a.task_id) } }
      ]
    };

    const tasks = await Task.find(task_query);

    let sum = 0, len = 0;

    for (const task of tasks) {
      const t = task.student_list.find(a => a.student_id.toString() === student._id.toString());

      if (t && t.grade) {
        sum += (t.grade / task.max_grade * 100);
        len++;
      }
    }
    
    let avg = (sum / len).toFixed(2);

    if (isNaN(avg)) {
      avg = '-';
    }

    s.percent_avg = avg + '%';
    s.letter_avg = toLetter(avg);
    s.task_num = len

    contents.push(s);
  }

  // Create payload
  const payload = {
    title: 'Students',
    options: options,
    routes: routes,
    headers: headers,
    contents: contents
  };

  // Send group data
  res.send(payload);
}

// Return tasks in the group
exports.dataTasks = async (req, res, next) => {
  const group = await Group.findOne({ _id: req.params.group_id });

  if (!group) {
    res.status(404).send({ message: 'Group doesn\'t exist' });
    return;
  }

  // Define table header
  const headers = [
    {
      id: 'name',
      name: 'Assignment',
      type: 'text',
      isEditable: true,
      required: true
    },
    {
      id: 'type',
      name: 'Type',
      type: 'text',
      isEditable: true,
      required: true
    },
    {
      id: 'max_grade',
      name: 'Max Grade',
      type: 'number',
      isEditable: true,
      required: true
    },
    {
      id: 'assign_date',
      name: 'Assign Date',
      type: 'date',
      isEditable: true,
      required: false
    },
    {
      id: 'due_date',
      name: 'Due Date',
      type: 'date',
      isEditable: true,
      required: false
    },
    {
      id: 'student_num',
      name: 'Assigned #',
      type: 'number',
      isEditable: false,
      required: false
    }
  ];

  // Define request routes for each action
  const routes = {
    create: '/task/create/' + req.params.group_id,
    edit: '/task/edit/' + req.params.group_id,
    delete: '/task/delete/' + req.params.group_id
  }

  // Retrieve tasks
  const tasks = await Task.find({ _id: { $in: group.task_list } });

  // Initialize table content array
  let contents = [];

  // Define table contents
  for (const task of tasks) {
    let t = {
      name: task.name,
      type: task.type,
      max_grade: task.max_grade,
      assign_date: task.assign_date,
      due_date: task.due_date,
      student_num: task.student_list.length,
      link: '/group/' + req.params.group_id,
      routes: {
        edit: routes.edit + '/' + task._id,
        delete: routes.delete + '/' + task._id
      }
    };

    contents.push(t);
  }

  // Create payload
  const payload = {
    title: 'Assignments',
    routes: routes,
    headers: headers,
    contents: contents
  }

  // Send payload
  res.send(payload);
}

exports.dataStudentsTasks = async (req, res, next) => {
  const group = await Group.findOne({ _id: req.params.group_id });
  const student = await User.findOne({ _id: req.user.id });

  if (!group || !student) {
    res.status(404).send({ message: 'Group doesn\'t exist' });
    return;
  }

  // Define table header
  const headers = [
    {
      id: 'name',
      name: 'Assignment',
      type: 'text',
      isEditable: false,
      required: false
    },
    {
      id: 'type',
      name: 'Type',
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
      isEditable: false,
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
  const tasks_query = {
    $and: [
      { _id: { $in: group.task_list } },
      { _id: { $in: student.task_list.map(a => a.task_id) } }
    ]
  };
  const tasks = await Task.find(tasks_query);

  console.log(tasks)

  let contents = [];

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
      type: task.type,
      assign_date: task.assign_date,
      due_date: task.due_date,
      max_grade: task.max_grade,
      grade: grade,
      percent_grade: percent + '%',
      letter_grade: toLetter(percent),
      link: '/group/' + req.params.group_id
    };

    contents.push(t);
  }

  // Create payload
  const payload = {
    title: 'Assignments',
    headers: headers,
    contents: contents
  }

  // Send payload
  res.send(payload);
}

// Create group
exports.create = async (req, res, next) => {
  // Get group parameters
  const group = req.body;
  group.teacher_id = req.user.id;

  // Create new group document
  const newGroup = await new Group(group).save();

  // Query user
  const user_query = { _id: req.user.id };
  const user_push = { $push: { group_list: newGroup._id} };

  // Add group to user's group list
  await User.findOneAndUpdate(user_query, user_push);

  res.end();
}

// Edit group
exports.edit = async (req, res, next) => {
  // Update group with parameters
  await Group.updateOne({ _id: req.params.group_id }, req.body);

  res.end();
}

// Delete group
exports.delete = async (req, res, next) => {
  // Find target group
  const target = await Group.findOne({ _id: req.params.group_id });

  // If target exists
  if (target) {
    await Promise.all([
      // Delete all reference to group in user
      User.updateMany({ }, { $pull: { group_list: target.id } }),
      // Delete all reference to group's task in user
      User.updateMany({ }, { $pull: { task_list: { task_id: { $in: target.task_list } } } }),
      // Delete all group's task
      Task.deleteMany({ $in: target.task_list }),
      // Delete group
      Group.deleteOne({ _id: req.params.group_id })
    ]);
  } else {
    // Remove group from user's group list
    User.updateMany({ }, { $pull: { group_list: req.params.group_id } });
  }
  
  res.end();
}
