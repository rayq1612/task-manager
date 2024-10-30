const express = require('express')
const Task = require('../models/task')
const router = new express.Router()
const auth = require('../middleware/auth')
const mongoose = require("mongoose");

router.post('/tasks', auth, async (req, res) => {
  const task = new Task({
    ...req.body,
    owner: req.user._id
  })
  try {
    const created_task = await task.save()
    res.status(201).send(created_task)
  } catch (e) {
    res.status(400).send({error: e})
  }
})

router.get('/tasks', auth, async (req, res) => {
  req.query.completed
  try {
    const tasks = await Task.find({
      owner: req.user._id,
      completed: true
    })

    if (tasks.length === 0) {
      return res.status(404).send()
    }
    res.send(tasks)

  } catch (e) {
    res.status(500).send({error: e})
  }
})

router.get('/tasks/:id', auth, async (req, res) => {
  const _id = req.params.id
  try {
    const task = await Task.findOne({ _id, owner: req.user._id })

    if (!task) {
      res.status(404).send()
    }

    res.send(task)
  } catch (e) {
    res.status(500).send()
  }
})

router.patch('/tasks/:id', auth, async (req, res) => {

  const updates = Object.keys(req.body)
  const allowed_updates = ['description', 'completed']
  const isValidUpdates = updates.every((update) => allowed_updates.includes(update))

  if (!isValidUpdates) {
    return res.status(400).send({error: 'Invalid updates!'})
  }

  const _id = req.params.id
  try {
    const task = await Task.findOne({ _id, owner: req.user._id })

    if (!task) {
      return res.status(404).send()
    }

    updates.forEach((update) => task[update] = req.body[update])
    await task.save()
    res.send(task)
  } catch (e) {
    res.status(500).send({error: e})
  }
})

router.delete('/tasks/:id', auth, async (req, res) => {
  const _id = req.params.id
  try {
    const task = await Task.findOneAndDelete({ _id, owner: req.user._id })

    if (!task) {
      return res.status(404).send()
    }

    res.send(task)
  } catch (e) {
    res.status(500).send({error: e})
  }
})

module.exports = router