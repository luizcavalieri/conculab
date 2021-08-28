import express from 'express'
import next from 'next'
import bodyParser from 'body-parser'

const dev = process.env.NODE_ENV !== 'production'
const port = parseInt(process?.env?.API_WS_PORT || '3000', 10)

const app = express()
const server = dev ? require('http').Server(app) : require('https').Server(app)
const io = require('socket.io')(server)

const nextApp = next({ dev })
const handle = nextApp.getRequestHandler()

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

nextApp.prepare().then(() => {
  app.use(bodyParser.json())

  app.post('/api/ping', (req, res) => {
    res.status(200).json({ ping: true })
  })

  app.get('*', (req, res) => {
    return handle(req, res)
  })

  server.listen(port, () => {
    console.log(`> Read on http://localhost:${port}`)
  })
})
