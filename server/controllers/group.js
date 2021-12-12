const User = require('../models/user');
const Group = require('../models/group');
const Task = require('../models/task');

const { toLetter } = require('../utilities/grade');

// Return students in the group
exports.dataStudents = async (req, res, next) => {
  // Get group
  const group = await Group.findOne({ _id: req.params.group_id });

  // Define global routes
  const routes = {
    add: 'student/add/' + req.params.group_id + '/',
    remove: 'student/remove/' + req.params.group_id + '/'
  };

  // Get all students
  const all_students_query = { 
    $and: [
      { role: 'student' }, 
      { _id: { 
        $nin: group.student_list 
      } }
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
      task_num: student.task_list.length,
      link: nxt + student._id,
      routes: {
        add: routes.add + student._id,
        remove: routes.remove + student._id
      }
    };

    let sum = 0, len = 0;

    for (const task of student.task_list) {
      const max_grade = await Task.findOne({ _id: task.task_id })

      if (task.grade) {
        sum += (task.grade / max_grade.max_grade * 100);
        len++;
      }
    }

    let avg = (sum / len).toFixed(2);

    if (isNaN(avg)) {
      avg = '-';
    }

    s.percent_avg = avg + '%';
    s.letter_avg = toLetter(avg);

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

  // Define next link
  const nxt = '/task/' + req.params.group_id + '/'

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

// Create group
exports.create = async (req, res, next) => {
  // Get group parameters
  const group = req.body;
  group.teacher_id = req.user.id;

  console.log(req.body)

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
