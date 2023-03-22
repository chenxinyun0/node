const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length
const process = require('process');
// ? cluster采用 Master-Worker 模式， 实现主进程和任务进程的调度
// ? 这样可以根据不同的进程类型来执行不同的代码逻辑，从而实现更灵活的多进程编程。
if (cluster.isMaster) {
  // debugger
  // 主进程
  console.log(`Primary ${process.pid} is running`);

  // Fork workers. 创建多个工作进程
  // ? 每次fork都执行一遍此文件，工作进程直接进入 else 判断语句，创建 http 服务
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  console.log('创建了一个工作进程')
  debugger
  // 工作进程
  // Workers can share any TCP connection
  // In this case it is an HTTP server
  const server = http.createServer((req, res) => {   // todo: 为什么监听端口也可以同时开启多个监听同端口的服务
    res.writeHead(200);
    res.end('hello world\n');
  })
  console.log(server, 'server')
  server.listen(8000);

  console.log(`Worker ${process.pid} started`);
}

/**
 * 在 Node.js 集群中，每个 Worker 进程都可以监听相同的端口。
 * 这是因为 Master 进程会将所有的进来的连接都转发给一个空闲的 Worker 进程处理，而不是让多个 Worker 进程同时监听同一个端口。
 * 这种方式可以有效地减少了端口占用问题，并提高了应用程序的性能和可伸缩性。
 * 在上述示例代码中，Master 进程会监听 8000 端口，但实际上，只有一个 Worker 进程会被分配来处理该端口的连接。
 * 当该 Worker 进程退出时，Master 进程会自动将该端口的连接转发给其他的空闲 Worker 进程，以保证应用程序的高可用性。
 * 如果多个 Worker 进程同时监听同一个端口，将会导致端口冲突问题，从而导致应用程序崩溃。因此，在使用 Node.js 集群时，需要确保只有一个进程监听相同的端口。可以通过在 Master 进程中使用 Round Robin 算法或其他负载均衡算法，将连接分配给不同的 Worker 进程来避免这种情况。
 */

/** 
 * ? 工作原理
 * cluster模块是child_process模块和net模块的组合应用，cluster启动时会在内部创建一个tcp服务，在cluster.fork()子进程时将这个tcp服务端的套接字socket的文件描述符发送到工作进程，
 * 如果进程时通过cluster.fork()复制出来的，那么他的环境变量就会存在NODE_UNIQUE_ID,
 * 如果工作进程中存在listen() 侦听网络端口的调用，他会拿到该文件的文件描述符，通过SO_REUSEADDR端口重用（在./句柄传递/child_test2.js有介绍,句柄文件夹内实现了灵活的实现方式），
 * 从而设实现多个子程序共享端口。
 * 对于普通方式启动的进程，则不存在文件描述符共享等事情。
 * 在cluster内部隐式创建tcp服务器的方式对使用者来说十分透明，但是正是这种方法使得他无法如直接使用child_process那样灵活，一个主进程只能管理一组工作进程。
 * 
 *  ! https://www.cnblogs.com/novak12/p/9304617.html
*/