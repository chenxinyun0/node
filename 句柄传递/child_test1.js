/**
 * https://blog.csdn.net/weixin_42078672/article/details/127827614
 * 
 * 发送到IPC管道的实际上是句柄 文件描述符 （实际上是一个整数值），message 对象写入到IPC管道时也会通过 JSON.stringify() 进行序列化。
 * 
 * todo: 1，文件描述符
 * 文件描述符通常用于在进程和文件系统之间建立连接。
 * 在打开文件时，操作系统会为该文件分配一个文件描述符，并将该文件描述符返回给调用方。调用方可以使用该文件描述符来访问文件的内容或进行文件操作。
 * 文件描述符可以用于读取、写入、关闭和控制文件的其他属性。
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