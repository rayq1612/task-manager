const express = require('express')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')
require('./db/mongoose')

const app = express()
const port = process.env.PORT || 3000
app.use(express.json(), userRouter, taskRouter)

app.listen(port, () => {
  console.log(`Listening on port: ${port}`)
})

