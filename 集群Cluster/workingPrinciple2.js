// ! 主进程创建监听套接字并将其发送给感兴趣的工作进程
const cluster = require('cluster');
const net = require('net');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  console.log(`Master process is running with pid ${process.pid}`);

  // Create a TCP server.
  const server = net.createServer((socket) => {
    // Handle incoming connections here.
  });


  server.listen(8000, () => {
    console.log('Server listening on port 8000');
  });

  // Send the server object to the interested worker process.
  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    const worker = cluster.fork();
    worker.send('', server);
  }

} else {
  // Worker process.
  console.log(`Worker process with pid ${process.pid} started`);

  process.on('message', (_, server) => {
    if (server) {
      // Start listening for connections on the server object.
      server.on('connection', (socket) => {
        console.log(`Worker process with pid ${process.pid} handled a connection`);
        // Handle incoming connections here.
      });
    }
  });
}


/**
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