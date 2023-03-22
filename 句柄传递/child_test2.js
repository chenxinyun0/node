
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

/**
 * ? 多个进程监听同一端口不会抛出错误的原因
 * 句柄传递背后的原理：当通过句柄传递后，多个进程可以监听到相同的端口而不会引起EADDRINUSE异常，是因为当我们独立启动进程中，TCP服务器的套接字的文件描述符并不相同，
 * 导致监听相同的端口出现抛出异常的情况，node底层对每个接口监听都设置了SO_REUSEADDR选项，这个选项的含义就是不同进程可以就相同的网卡和端口进行监听，这个服务器套接字
 * 可以被不同的进程复用，
 * setsockopt(tcp->io_watcher.fd, SOL_SOCKET, SO_REUSEADDR, &on, sizeof(on))
 * 由于独立的进程相互之间不知道文件描述符，所以监听相同端口就会失败，但是对于send() 发送的句柄还原出来的服务而言，他们的文件描述符是相同的，所以监听端口不会出现异常
 * 多个应用监听端口时，文件描述符   <同一时间只能被某个进程  所用>，换而言之，就是网络请求向服务器发送时，只有一个幸运的进程能够抢到链接，也就是说只有他能够为这个请求进行服务。这些进程的服务时抢占式的。
 */

/**
 * ? 套接字
 * 套接字（Socket）是一种计算机网络通信机制，它提供了一种在不同进程或计算机之间进行通信的方式。套接字是一组抽象接口，可用于不同的网络通信协议，如TCP、UDP等。
 * 套接字是一个通信链路的端点，它由一个IP地址和一个端口号组成。在客户端与服务器之间进行通信时，客户端会将请求发送到服务器的IP地址和端口号上的套接字，服务器会监听该套接字，并在接收到请求后，创建一个新的套接字与客户端进行通信。
 * 在使用套接字时，需要指定协议类型（如TCP、UDP等）、地址族（如IPv4、IPv6等）、传输协议（如流传输、报文传输等）等参数，以创建一个套接字实例。可以使用套接字进行数据传输、接收和处理，以实现网络通信的功能。
 * 套接字在网络编程中被广泛使用，例如在Web开发中使用套接字进行HTTP通信，或者在游戏开发中使用套接字进行实时网络游戏通信等。
 */

/**
 * ? 套接字文件描述符
 * 在UNIX和类UNIX系统中，套接字（Socket）也是一种文件描述符（File Descriptor），它可以使用与文件描述符类似的系统调用来进行读写操作。
 * 当使用系统调用创建套接字时，内核会为其分配一个文件描述符，这个文件描述符在套接字所在的进程中唯一标识该套接字。因此，套接字可以使用类似于文件描述符的方式进行读写操作。
 */

/**
 * ? 集群的两种方式
 */