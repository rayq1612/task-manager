const express = require('express')
const User = require('../models/user')
const router = new express.Router()
const bcrypt = require('bcrypt')

router.post('/users', async (req, res) => {
    const body = req.body
    body.password = await bcrypt.hash(req.body.password, 10)
    const user = new User(body)
    console.log(user)
    try {
        await user.save()
        res.status(201).send(user)
    } catch (e) {
        res.status(500).send({error: e})
    }
})

router.get('/users', async (req, res) => {
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

router.get('/users/:id', async (req, res) => {
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

router.patch('/users/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowed_updates = ['name', 'email', 'password', 'age']
    const isValidUpdate = updates.every((update) => allowed_updates.includes(update))

    if (!isValidUpdate) {
        return res.status(400).send({error: 'Invalid updates!'})
    }

    const _id = req.params.id
    try {
        const user = await User.findById(_id)
        updates.forEach((update) => user[update] = req.body[update])
        await user.save()
        if (user) {
            res.status(200).send(user)
        } else {
            res.status(404).send({error: 'User not found'})
        }
    } catch (e) {
        res.status(500).send({error: e})
    }
})

router.delete('/users/:id', async (req, res) => {
    const _id = req.params.id
    try {
        const deleted_user = await User.findByIdAndDelete(_id)
        if (deleted_user) {
            res.status(200).send(deleted_user)
        } else {
            res.status(404).send({error: 'User not found'})
        }
    } catch (e) {
        res.status(500).send({error: e})
    }
})

module.exports = router