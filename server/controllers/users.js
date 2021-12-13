const User = require('../models/user');
const Group = require('../models/group');
const Task = require('../models/task');

require('dotenv').config();

exports.profile = async (req, res, next) => {
  const user = await User.findOne({ _id: req.user.id });

  if (!user) {
    console.log('usernotfound')
    return res.status(400).send({ message: 'User not found' });
  }

  const payload = {
    name: user.first_name + ' ' + user.last_name,
    email: user.email,
    class_num: user.group_list.length
  };

  res.send(payload);
}

// Return user's group
exports.data = async (req, res, next) => {
  const user = await User.findOne({ _id: req.user.id });

  if (!user) {
    console.log('usernotfound')
    return res.status(400).send({ message: 'User not found' });
  }

  const nxt = '/group/'
  const headers = [
    {
      id: 'name',
      name: 'Class',
      type: 'text',
      isEditable: true,
      required: true
    },
    {
      id: 'block',
      name: 'Block',
      type: 'text',
      isEditable: true,
      required: true
    },
    {
      id: 'start_time',
      name: 'Start Time',
      type: 'time',
      isEditable: true,
      required: false
    },
    {
      id: 'end_time',
      name: 'End Time',
      type: 'time',
      isEditable: true,
      required: false
    },
    {
      id: 'student_num',
      name: 'Student #',
      type: 'number',
      isEditable: false,
      required: false
    },
    {
      id: 'task_num',
      name: 'Assignmnent #',
      type: 'number',
      isEditable: false,
      required: false
    }
  ];

  const routes = {
    create: '/group/create',
    edit: '/group/edit',
    delete: '/group/delete'
  };

  const groups = await Group.find({ _id: { $in: user.group_list } });

  let contents = [];

  for (group of groups) {
    let g = {
      name: group.name,
      block: group.block,
      start_time: group.start_time,
      end_time: group.end_time,
      student_num: group.student_list.length,
      task_num: group.task_list.length,
      link: nxt + group._id,
      routes: {
        edit: routes.edit + '/' + group._id,
        delete: routes.delete + '/' + group._id
      }
    };

    contents.push(g);
  }

  // Send user data
  const payload = {
    title: 'Classes',
    routes: routes,
    headers: headers,
    contents: contents
  };

  res.send(payload);
}

exports.dataStudent = async (req, res, next) => {
  const user = await User.findOne({ _id: req.user.id });

  if (!user) {
    console.log('usernotfound')
    return res.status(400).send({ message: 'User not found' });
  }

  const nxt = '/group/'
  const headers = [
    {
      id: 'name',
      name: 'Class',
      type: 'text',
      isEditable: true,
      required: true
    },
    {
      id: 'block',
      name: 'Block',
      type: 'text',
      isEditable: true,
      required: true
    },
    {
      id: 'start_time',
      name: 'Start Time',
      type: 'time',
      isEditable: true,
      required: false
    },
    {
      id: 'end_time',
      name: 'End Time',
      type: 'time',
      isEditable: true,
      required: false
    }
  ];

  const routes = {
    create: '/group/create',
    edit: '/group/edit',
    delete: '/group/delete'
  };

  const groups = await Group.find({ _id: { $in: user.group_list } });

  let contents = [];

  for (group of groups) {
    let g = {
      name: group.name,
      block: group.block,
      start_time: group.start_time,
      end_time: group.end_time,
      link: nxt + group._id
    };

    contents.push(g);
  }

  // Send user data
  const payload = {
    title: 'Classes',
    routes: routes,
    headers: headers,
    contents: contents
  };

  res.send(payload);
}
