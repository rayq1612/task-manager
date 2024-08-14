const express = require('express')
const {ObjectId} = require("mongodb");
const User = require('./models/User')
const Task = require('./models/Task')

//Connect to mongoDb
require('./db/mongoose')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

app.post('/users', (req, res) => {
  const user = new User(req.body)
  user.save().then(() => {
    res.status(201).send(user)
  }).catch((e) => {
    res.status(500).send({error: e})
  })
})

app.get('/users', (req, res) => {
  User.find({}).then((users) => {
    res.send(users)
  }).catch((e) => {
    res.status(400).send({error: e})
  })
})

app.get('/users/:id', (req, res) => {
    const _id = req.params.id
    User.findById(_id).then((user) => {
      if (user) {
        return res.status(200).send(user)
      } else {
        return res.status(404).send({error: 'User not found'})
      }
    }).catch((e) => {
      return res.status(500).send({
        description: "You must provide valid id of the user",
        error: e
      })
    })
})

app.post('/tasks', (req, res) => {
  const task = new Task(req.body)
  task.save().then(() => {
    res.status(201).send(task)
  }).catch((e) => {
    res.status(400).send({error: e})
  })
})

app.get('/tasks', (req, res) => {
  Task.find({}).then((tasks) => {
    res.send(tasks)
  }).catch((e) => {
    res.status(500).send({error: e})
  })
})

app.get('/tasks/:id', (req, res) => {
  const _id = req.params.id
  Task.findById(_id).then((task) => {
    if (task) {
      return res.status(200).send(task)
    }
    else {
      return res.status(404).send({error: 'Task not found'})
    }
  }).catch((e) => {
    return res.status(400).send({
      description: "You must provide valid id of the task",
      error: e
    })
  })
})

app.listen(port, () => {
  console.log(`Listening on port: ${port}`)
})