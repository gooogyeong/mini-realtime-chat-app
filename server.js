const express = require('express')
const http = require('http')
const socketIO = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = socketIO(server) // establishes /socket.io endpoint

// triggered when client is connected to socket
// parameter socket represents client that is connected to the server.
// we pass it as a parameter in order to handle send message events emitted from client-side
io.on('connection', (socket) => {
  console.log('user connected')
  // the event type 'message' is completely ARBITRARY. ex) message, chat message, chatmsg ...
  // it works as long as client- and server-side event type matches.
  io.emit('message', 'hello!') // sends message to anyone who connected to the server

  socket.on('private message', (message) => {
    // send back the message to only that client who sent the message
    socket.emit('message', message)
  })

  socket.on('global message', (message) => {
    // send back message to anyone connected to the server, including the sender
    io.emit('message', message)
  })

  socket.on('broadcast message', (message) => {
    // by adding .broadcast flag,
    // server sends back message to anyone connected to the server, including the sender
    socket.broadcast.emit('message', message)
  })
})

app.get('/', (req, res) => {
  // res.sendStatus(200) // You'll see 'OK' upon entering localhost:5000
  // However, we instead want to send index.html file upon entering localhost:5000
  res.sendFile(__dirname + '/index.html') // Now you see 'Basic Socket.io Chat App...' upon entering localhost:5000
})

// Just like our server-side app is exposing an endpoint('/'),
// saying that it will answer you once you send a request to certain endpoint,
// socket.io too is exposing ANOTHER ENDPOINT ('/socket.io'),
// which client can likewise use to talk or connect to server.

server.listen(5000, () => {
  console.log('server is up and running on port 5000')
})

// since our app is server entirely from node.js server,
// we can actually grab client library from /socket.io endpoint,
// (cf. localhost:5000/socket.io/socket.io.js)
// which you can use this in index.html
