/**
 * https://blog.csdn.net/weixin_42078672/article/details/127827614
 * 
 * 发送到IPC管道的实际上是句柄 文件描述符 （实际上是一个整数值），message 对象写入到IPC管道时也会通过 JSON.stringify() 进行序列化。
 * 
 * todo: 1，文件描述符
 */

process.on('message', function (m, server) {
  if (m === 'server') {
    // console.log(server,'child')
    console.log(server.address,'child')
    server.on('connection', function (socket) {
      socket.end('handled by child\n');
    });
  }
});