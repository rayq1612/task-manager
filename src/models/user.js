const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const Task = require('../models/task')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("You must provide a valid email address")
      }
    }
  },
  age: {
    type: Number,
    default: 0,
    validate(value) {
      if (value < 1) {
        throw new Error('Age must be greater than 1')
      }
    }
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minLength: 8,
    validate(value) {
      if (validator.contains(value.toLowerCase(), "password")) {
        throw new Error('Password shouldn\'t contain password word')
      }
    }
  },
  tokens: [{
    token: {
      type: String,
      required: true,
    }
  }]
}, {
  timestamps: true
})

userSchema.virtual('tasks', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'owner',
})

//Generate auth token
userSchema.methods.generateAuthToken = async function () {
  const user = this
  const token = await jwt.sign({_id: user._id}, 'taskapp')
  user.tokens = user.tokens.concat({token})
  await user.save()
  return token
}

userSchema.methods.toJSON = function () {
  const user = this
  const userPublicObject = user.toObject()
  delete userPublicObject.password
  delete userPublicObject.tokens
  return userPublicObject
}

//Logging in
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({email})
  if (!user) {
    throw new Error('Unable to login')
  }
  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) {
    throw new Error('Unable to login')
  }
  return user
}

//Hash the plane text password
userSchema.pre('save', async function (next) {
  const user = this
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 10)
  }
  next()
})

userSchema.pre('deleteOne', { document: true }, async function (next){
  const user = this
  await Task.deleteMany({ owner: user._id })
  next()
})

const User = mongoose.model('User', userSchema)
module.exports = User