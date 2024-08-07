const mongoose = require('mongoose')
const validator = require('validator')

const User = mongoose.model('User', {
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
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
  }
})

module.exports = User