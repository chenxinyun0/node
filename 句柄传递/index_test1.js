
/**
 * @description 实现效果： curl --http0.9  "http://127.0.0.1:1337" 子进程和父进程都有可能相应请求
 */

var child = require('child_process').fork('./child_test1.js');
// Open up the server object and send the handle
// 创建tcp连接
var server = require('net').createServer();

// console.log(server,'parent')
console.log(server.address(),'parent')
console.log('----------------------------------------------------------------')

server.on('connection', function (socket) {
  socket.end('handled by parent\n');
});


server.listen(1338, function () {
  /**
   * 什么是句柄？
   * 句柄是一种可以用来标识资源的引用，他的内部包含了指向对象的的文件描述符，比如句柄可以用来标识一个服务器端的socket对象、一个客户端的socket对象、一个UDP套接字、一个管道等。 
   */
  // 第二个参数是 句柄,将句柄传递给子进程,将 tcp 服务器发送给了子进程
  child.send('server', server);
  
  process.on('SIGINT', () => {
    process.exit()
  })
});


