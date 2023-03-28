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

  // Use the least-connection strategy.
  cluster.on('message', (worker, message) => {
    if (message.type === 'request') {
      const workers = Object.values(cluster.workers);
      let targetWorker = workers[0];

      for (let i = 1; i < workers.length; i++) {
        if (workers[i].connections < targetWorker.connections) {
          targetWorker = workers[i];
        }
      }

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
