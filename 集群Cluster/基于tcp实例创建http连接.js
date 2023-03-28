const net = require('net');
const http = require('http');

const server = net.createServer(socket => {
  //在TCP服务器接受到一个新的连接时，它将创建一个新的socket对象，并将其传递给HTTP服务器的connection事件。HTTP服务器会处理这个事件，将socket对象转换成一个HTTP请求，并将其传递给对应的请求处理器。
  // 创建一个HTTP服务器
  const httpServer = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello World\n');
  });

  // 将socket连接传递给HTTP服务器
  httpServer.emit('connection', socket);
});

server.listen(8080, () => {
  console.log('Server is running on port 8080');
});
