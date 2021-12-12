const mongoose = require('mongoose');

module.exports = (app, url) => {
  mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => {
      console.log('Connected to db');
      app.emit('ready');
    })
    .catch((err) => {
      console.log(err)
    });
}