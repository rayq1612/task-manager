const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/task-manager-api').then(() => {
  console.log("Connected to mongoDb successfully")
}).catch((err) => {
  console.log("Unable to connect to mongoDb" + err)
})

