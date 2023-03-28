/**
 * Node.js Cluster 模块提供了多种负载均衡策略，包括：
 * round-robin：默认策略，将请求依次分配给每个工作进程。
 * random：随机分配请求给工作进程。
 *least-connection：将请求分配给连接数最少的工作进程。
 */

const cluster = require('cluster');
const net = require('net');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  console.log(`Master process is running with pid ${process.pid}`);

  // Create a TCP server.
  const server = net.createServer((socket) => {
    // Handle incoming connections here.
  });

  // Listen for connections.
  server.listen(8000, () => {
    console.log('Server listening on port 8000');
  });

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    const worker = cluster.fork();
    worker.send({ server });
  }

  // Use the random strategy.
  cluster.on('message', (worker, message) => {
    if (message.type === 'request') {
      const workers = Object.values(cluster.workers);
      const targetWorker = workers[Math.floor(Math.random() * workers.length)];
      targetWorker.send({ type: 'request', socket: message.socket });
    }
  });
} else {
  // Worker process.
  console.log(`Worker process with pid ${process.pid} started`);

  // Listen for the server object from the master process.
  process.on('message', (message) => {
    if (message.server) {
      // Start listening for connections on the server object.
      message.server.on('connection', (socket) => {
        console.log(`Worker process with pid ${process.pid} handled a connection`);
        // Handle incoming connections here.
        // 在TCP服务器接受到一个新的连接时，它将创建一个新的socket对象，并将其传递给HTTP服务器的connection事件。
        // HTTP服务器会处理这个事件，将socket对象转换成一个HTTP请求，并将其传递给对应的请求处理器。
        // 可以在这里面这样
        const httpServer = http.createServer((req, res) => {
          // 这里面可以处理
          res.writeHead(200, { 'Content-Type': 'text/plain' });
          res.end('Hello World\n');
        });

        httpServer.emit('connection', socket)
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
      });
      message.socket.on('end', () => {
        // Handle socket close event here.
      });
    }
  });
}
