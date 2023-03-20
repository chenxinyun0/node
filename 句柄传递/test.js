const net = require('net');

const server = net.createServer()

server.on('connection', (socket) => {
  socket.end('first connection')
})

server.on('connection', (socket) => {
  socket.end('second connection')
})

server.listen(8000)