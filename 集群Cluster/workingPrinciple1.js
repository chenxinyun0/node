// ! 主进程监听端口，接受新连接并以循环方式将它们分发给工作进程

const cluster = require('cluster');
const net = require('net');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  console.log(`Master process is running with pid ${process.pid}`);

  // Create a TCP server.
  const server = net.createServer((socket) => {
    // Handle incoming connections here.
    console.log(`New connection from ${socket.remoteAddress}:${socket.remotePort}`);

    // Send the connection to a worker.
    const workers = Object.values(cluster.workers);
    const targetWorker = workers[socket.remoteAddress.split('.').pop() % workers.length];
    targetWorker.send({ type: 'connection', socket });
  });

  // Listen for connections.
  server.listen(8000, () => {
    console.log('Server listening on port 8000');
  });

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  // Round-robin connection distribution.
  let workerIndex = 0;
  cluster.on('message', (worker, message) => {
    if (message.type === 'request') {
      // Send the request to the next worker in line.
      const workers = Object.values(cluster.workers);
      const targetWorker = workers[workerIndex];
      workerIndex = (workerIndex + 1) % workers.length;
      targetWorker.send({ type: 'request', socket: message.socket });
    }
  });
} else {
  // Worker process.
  console.log(`Worker process with pid ${process.pid} started`);

  // Listen for connections from the master process.
  process.on('message', (message) => {
    if (message.type === 'connection') {
      // Handle incoming connections from the master process.
      message.socket.resume();
      message.socket.on('data', (chunk) => {
        // Handle incoming data from the socket here.
        console.log(`Received ${chunk.length} bytes of data from ${message.socket.remoteAddress}:${message.socket.remotePort}`);
      });
      message.socket.on('end', () => {
        // Handle socket close event here.
        console.log(`Connection from ${message.socket.remoteAddress}:${message.socket.remotePort} closed`);
      });
    }
  });

  // Listen for requests from the master process.
  process.on('message', (message) => {
    if (message.type === 'request') {
      // Handle incoming requests from the master process.
      message.socket.resume();
      message.socket.on('data', (chunk) => {
        // Handle incoming data from the socket here.
        console.log(`Received ${chunk.length} bytes of data from ${message.socket.remoteAddress}:${message.socket.remotePort}`);
      });
      message.socket.on('end', () => {
        // Handle socket close event here.
        console.log(`Connection from ${message.socket.remoteAddress}:${message.socket.remotePort} closed`);
      });
    }
  });
}
