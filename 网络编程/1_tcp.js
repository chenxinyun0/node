/**
 * todo: node提供了 net、dgram、http、https这四个模块，分别用于表示TCP、UDP、HTTP、HTTPS，适用于服务端和客户端
 * 当tcp会话形成之后，客户端和服务端之间才能互相发送数据，创建回话的过程中，服务端和客户端会分别提供一个套接字，这两个套接字形成一个连接。客户端和服务端则通过套接字实现两者之间的连接。
 * 所谓套接字(Socket)，就是对网络中不同主机上的应用进程之间进行双向通信的端点的抽象。一个套接字就是网络上进程通信的一端，提供了应用层进程利用网络协议交换数据的机制。从所处的地位来讲，
 * todo:套接字上联应用进程，下联网络协议栈，是应用程序通过网络协议进行通信的接口，是应用程序与网络协议栈进行交互的接口
 * 
 * todo: socket 文章 https://www.zhihu.com/question/29637351/answer/1934423848
 */

var net = require('net');

/** 
 * todo : 服务端调用 accept 时，连接成功了会返回一个已完成连接的 socket，后续用来传输数据。
 * todo : 监听的 socket 和真正用来传送数据的 socket，是「两个」 socket，一个叫作监听 socket，一个叫作已完成连接 socket。
 */
var server = net.createServer(function(socket){
  socket.on('data',function(data){
    socket.write("你好")
  })
  
  socket.on('close',function(){
    console.log('close')
  })
  
  socket.writable("开始建立tcp连接")
})

server.on('connection',function(){
  console.log("创建新连接")
})

server.listen(8124,function(){
  console.log('server start')
})



/**
 * 基于 TCP 协议的客户端和服务器工作
 * todo 服务端和客户端初始化 socket，得到文件描述符；
 * 服务端调用 bind，将绑定在 IP 地址和端口;服务端调用 listen，进行监听；
 * 服务端调用 accept，等待客户端连接；
 * 客户端调用 connect，向服务器端的地址和端口发起连接请求；
 * 服务端 accept 返回用于传输的 socket 的文件描述符；
 * 客户端调用 write 写入数据；服务端调用 read 读取数据；
 * 客户端断开连接时，会调用 close，那么服务端 read 读取数据的时候，就会读取到了 EOF，待处理完数据后，服务端调用 close，表示连接关闭。
 */