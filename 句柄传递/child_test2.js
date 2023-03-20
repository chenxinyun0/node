
const http = require('http');

const server = http.createServer(function(req, res) {
  res.writeHead(200,{'content-type': 'text/plain'})
  res.end('child handled,pid is' + process.pid + '\n')
})

process.on('message', function(message,socket){
  console.log(socket)// socket的原理在下面
  socket.on('connection', function(s){
    server.emit('connection',s)
  })
})


/**
 * todo：句柄传递的原理：
 * IPC管道中实际上是我们发送了句柄文件描述符，文件描述符实际是一个整数，（send可以发送消息和句柄，但是并不意味着他能发送任意对象）
 * todo：支持句柄类型
 * net.Socket。TCP套接字。
 * net.Server。TCP服务，任意建立在TCP服务上的应用层服务都可以享受它带来的好处。
 * net.Native。C++层面的TCP套接字。
 * dgram.Socket。UDP套接字
 * dgram.Native。C++层面的UDP套接字
 * send()方法将发送的信息进行序列话JSON.stringify()，IPC管道的子进程读取到父进程发送的消息，将字符串通过JSON.parse()尽心解析还原，才触发message事件将消息体传递给应用层使用，
 * 子进程根据message.type创建对应的TCP服务对象，然后监听到文件描述符上，
 * function(message, handle, emit) { 
 *   var self = this; 
 *   var server = new net.Server(); 
 *   //Start a server listening for connections on a given handle that has already been bound to a port, a Unix domain socket, or a Windows named pipe.
 *   server.listen(handle, function() { 
 *   emit(server); 
 *  }); 
 * }
 */