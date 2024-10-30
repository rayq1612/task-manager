const express = require('express')
const User = require('../models/user')
const router = new express.Router()
const bcrypt = require('bcrypt')
const auth = require('../middleware/auth')

router.post('/users', async (req, res) => {
  const user = new User(req.body)
  try {
    await user.save()
    const token = await user.generateAuthToken()
    res.status(201).send()
  } catch (e) {
    res.status(500).send({error: e})
  }
})

router.post('/users/login', async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password)
    const token = await user.generateAuthToken()
    res.send({ user, token })
  } catch (e) {
    res.status(400).send({"error": e.message})
  }
})

router.post('/users/logout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token
    })
    await req.user.save()
    res.send()
  } catch (e) {
    res.status(500).send()
  }
})

router.post('/users/logoutAll', auth, async (req, res) => {
  try {
    req.user.tokens = []
    await req.user.save()
    res.send()
  } catch (e) {
    res.status(500).send()
  }
})

router.get('/users/me', auth, async (req, res) => {
  res.send(req.user)
})

router.patch('/users/me', auth, async (req, res) => {
  const updates = Object.keys(req.body)
  const allowed_updates = ['name', 'email', 'password', 'age']
  const isValidUpdate = updates.every((update) => allowed_updates.includes(update))

  if (!isValidUpdate) {
    return res.status(400).send({error: 'Invalid updates!'})
  }

  try {
    updates.forEach((update) => req.user[update] = req.body[update])
    await req.user.save()
    res.send()
  } catch (e) {
    res.status(500).send({error: e})
  }
})

router.delete('/users/me', auth, async (req, res) => {
    await req.user.deleteOne()
    res.send(req.user)
})

module.exports = router