const express = require('express')
const {ObjectId} = require("mongodb");
const User = require('./models/User')
const Task = require('./models/Task')
require('./db/mongoose')

const app = express()
const port = process.env.PORT || 3000
app.use(express.json())

app.post('/users', async (req, res) => {
  const user = new User(req.body)
  try {
    await user.save()
    res.status(201).send(user)
  } catch (e) {
    res.status(500).send({error: e})
  }
})

app.get('/users', async (req, res) => {
  try {
    const users = await User.find()
    if (users.length === 0) {
      res.status(404).send({error: 'Users not found'})
    } else {
      res.status(200).send(users)
    }
  } catch (e) {
    res.status(500).send({error: e})
  }
})

app.get('/users/:id', async (req, res) => {
    const _id = req.params.id
    try {
      const user = await User.findById(_id)
      if (user) {
        res.status(200).send(user)
      } else {
        res.status(404).send({error: 'User not found'})
      }
    } catch (e) {
        res.status(500).send({error: e})
    }
})

app.patch('/users/:id', async (req, res) => {
  const _id = req.params.id
  try {
    const user = await User.findByIdAndUpdate(_id, {
      name: 'Dimon'
    })
    if (user) {
      res.status(200).send(user)
    } else {
      res.status(404).send({error: 'User not found'})
    }
  } catch (e) {
    res.status(500).send({error: e})
  }
})

app.post('/tasks', async (req, res) => {
  const task = new Task(req.body)
  try {
    const created_task = await task.save()
    res.status(201).send(created_task)
  } catch (e) {
    res.status(400).send({error: e})
  }
})

app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find()
    if (tasks.length === 0) {
      res.status(404).send({error: 'No tasks found'})
    } else {
      res.status(200).send(tasks)
    }
  } catch (e) {
    res.status(500).send({error: e})
  }
})

app.get('/tasks/:id', async (req, res) => {
  const _id = req.params.id
  try {
    const task = await Task.findById(_id)
    if (task) {
      res.status(200).send(task)
    } else {
      res.status(404).send({error: 'No task found'})
    }
  } catch (e) {
    res.status(500).send({error: e})
  }
})

app.listen(port, () => {
  console.log(`Listening on port: ${port}`)
})