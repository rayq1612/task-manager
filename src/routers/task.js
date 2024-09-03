const express = require('express')
const Task = require('../models/task')
const router = new express.Router()

router.post('/tasks', async (req, res) => {
    const task = new Task(req.body)
    try {
        const created_task = await task.save()
        res.status(201).send(created_task)
    } catch (e) {
        res.status(400).send({error: e})
    }
})

router.get('/tasks', async (req, res) => {
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

router.get('/tasks/:id', async (req, res) => {
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

router.patch('/tasks/:id', async (req, res) => {

    const updates = Object.keys(req.body)
    const allowed_updates = ['description', 'completed']
    const isValidUpdates = updates.every((update) => allowed_updates.includes(update))

    if (!isValidUpdates) {
        return res.status(400).send({error: 'Invalid updates!'})
    }

    const _id = req.params.id
    try {
        const task = await Task.findById(_id)
        updates.forEach((update) => task[update] = req.body[update])
        await task.save()
        if (task) {
            res.status(200).send(task)
        } else {
            res.status(404).send({error: 'No task found'})
        }
    } catch (e) {
        res.status(500).send({error: e})
    }
})

router.delete('/tasks/:id', async (req, res) => {
    const _id = req.params.id
    try {
        const task = await Task.findByIdAndDelete(_id)
        if (task) {
            req.status(200).send(task)
        } else {
            req.status(404).send({error: 'No task found'})
        }
    } catch (e) {
        res.status(500).send({error: e})
    }
})

module.exports = router