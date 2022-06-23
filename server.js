require('dotenv').config()

const express = require("express");
const app = express();
const jwt = require('jsonwebtoken')

app.use(express.json())

const post = [
  {
    username: "Tom",
    title: "Post 1",
  }, {
    username: "Jerry",
    title: "Post 2",
  },
]

app.get('/posts', authToken, (req, res) => {
    res.json(post.filter(post => post.username === req.user.name))
})

app.post('/login', (req, res) => {
    const username = req.body.username
    const user = { name: username }
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
    res.json({ accessToken: accessToken })
})

function authToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if(token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if(err) return res.sendStatus(401)
        req.user = user
        next()
    })
}

const port = process.env.PORT
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`)
})
