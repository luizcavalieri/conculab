import express from 'express'
import * as http from 'http'
import next from 'next'
import bodyParser from 'body-parser'

const server = express()
const httpServer: http.Server = http.createServer(server)
const io = require('socket.io')(httpServer, {
  perMessageDeflate: {
    threshold: 32768
  },
  transports: ['websocket']
})

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

io.on('connection', (socket: any) => {
  console.log('connection')
  socket.emit('status', 'Hello from Conculab 👋')

  // this handles the JOIN message
  socket.on('join', (data: any) => {
    if (dev) console.log({ data })
    socket.join(data.email)
  })

  // this handle the MOUSE OVER message
  socket.on('mouseover', (data: any) => {
    const connectedUser = io.sockets.in(data.email)
    if (connectedUser != null) {
      if (dev) console.log({ data })
      socket.broadcast.emit('newhighlight', data)
    }
  })

  socket.on('disconnect', () => {
    console.log('client disconnected');
  })
})


app.prepare().then(() => {

  server.use(bodyParser.json())

  server.post('/api/ping', (req, res) => {
    res.status(200).json({ ping: true })
  })

  server.get('*', (req, res) => {
    return handle(req, res)
  })

  httpServer.listen(process.env.API_WS_PORT)

  server.listen(3000, () => {
    console.log('> Read on http://localhost:3000')
  })
})
