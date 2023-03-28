/**
 * 当客户端发送一个 HTTP 请求到服务器的 IP 地址和端口号时，该请求首先会被操作系统内核接收并路由到某个工作进程，
 * 而不是直接发送到 Node.js 应用程序。在多个工作进程之间，操作系统内核会使用一些负载均衡算法（例如轮询或随机）来均衡分配连接，
 * 从而确保每个工作进程都能够处理大约相同数量的请求。
 */

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

  console.log('18行')

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
  // listen方法内部进行了特殊处理，当是集群的工作方式的时候会有一个变量进行判断
  server.listen(8000);

  console.log(`Worker ${process.pid} started`);
}

/**
 * 在 Node.js 集群中，每个 Worker 进程都可以监听相同的端口。
 * 这是因为 Master 进程会将所有的进来的连接都转发给一个空闲的 Worker 进程处理，而不是让多个 Worker 进程同时监听同一个端口。
 * 这种方式可以有效地减少了端口占用问题，并提高了应用程序的性能和可伸缩性。
 * 在上述示例代码中，Master 进程会监听 8000 端口，但实际上，只有一个 Worker 进程会被分配来处理该端口的连接。
 * 当该 Worker 进程退出时，Master 进程会自动将该端口的连接转发给其他的空闲 Worker 进程，以保证应用程序的高可用性。
 * 如果多个 Worker 进程同时监听同一个端口，将会导致端口冲突问题，从而导致应用程序崩溃。因此，在使用 Node.js 集群时，需要确保只有一个进程监听相同的端口。
 * 可以通过在 Master 进程中使用 Round Robin 算法或其他负载均衡算法，将连接分配给不同的 Worker 进程来避免这种情况。
 */

/** 
 * ? 工作原理 here
 * cluster模块是child_process模块和net模块的组合应用，cluster启动时会在内部创建一个tcp服务，在cluster.fork()子进程时将这个tcp服务端的套接字socket的文件描述符发送到工作进程，
 * 如果进程时通过cluster.fork()复制出来的，那么他的环境变量就会存在NODE_UNIQUE_ID,
 * 如果工作进程中存在listen() 侦听网络端口的调用，他会拿到该文件的文件描述符，通过SO_REUSEADDR端口重用（在./句柄传递/child_test2.js有介绍,句柄文件夹内实现了灵活的实现方式），
 * 从而设实现多个子程序共享端口。
 * 对于普通方式启动的进程，则不存在文件描述符共享等事情。
 * 在cluster内部隐式创建tcp服务器的方式对使用者来说十分透明，但是正是这种方法使得他无法如直接使用child_process那样灵活，一个主进程只能管理一组工作进程。
 * 
 *  ! https://www.cnblogs.com/novak12/p/9304617.html
*/


/**
 * !  http模块的listen是如何以来net模块的
 * http 模块的 listen 方法实际上是通过调用 net 模块的 Server 类的 listen 方法来实现的。在 http 模块内部，Server 类被继承并用于创建 HTTP 服务器对象。
 * 具体来说，以下是 http 模块中的 listen 方法是如何实现的：
 * http.createServer 方法被调用创建一个 HTTP 服务器对象，该对象实际上是一个继承自 net.Server 类的对象。
 * 在 HTTP 服务器对象上调用 listen 方法，并传递要监听的端口号和可选的主机名参数。 
 * listen 方法内部会通过 net 模块的 Server 类的 listen 方法来实现。该方法会创建一个 TCP 服务器，并监听指定的端口和主机名。
 * 当有新的连接请求到达时，net 模块会触发 connection 事件，然后将该连接的数据流传递给 http 模块的 connectionListener 函数。
 * 在 connectionListener 函数中，http 模块会创建一个 IncomingMessage 对象，用于表示客户端请求的信息，并使用 ServerResponse 对象来发送响应数据。
 * 总之，http 模块的 listen 方法实际上是通过调用 net 模块的 Server 类的 listen 方法来实现的，用于创建 TCP 服务器并监听指定的端口和主机名。当有新的连接请求到达时，net 模块会触发 connection 事件，然后将该连接的数据流传递给 http 模块的 connectionListener 函数来处理请求和响应。
 * 
 * http模块http.server继承了net模块的net.server
 */

/**
 * .listen函数在实现时对主进程和子进程进行了区分，在不同的进程中会执行不同操作
 */

/**
 * 由于 server.listen() 将大部分工作交给了主进程，因此普通的 Node.js 进程和集群工作进程之间的行为在三种情况下会有所不同：
 * server.listen({fd: 7}) 因为消息传给主进程，所以父进程中的文件描述符 7 将被监听，并将句柄传给工作进程，而不是监听文件描述符 7 引用的工作进程。
 * server.listen(handle) 显式地监听句柄，将使工作进程使用提供的句柄，而不是与主进程对话。
 * server.listen(0) 通常，这会使服务器监听随机端口。 但是，在集群中，每个工作进程每次执行 listen(0) 时都会接收到相同的"随机"端口。 实质上，端口第一次是随机的，但之后是可预测的。 要监听唯一的端口，则根据集群工作进程 ID 生成端口号。
 * ? 子进程的http.createServer().listen() 继承了 net.createServer().listen方法，当子进程的listen方法传入不同的情况时会将listen的参数传入主进程，主进程会创建一个net.createServer()来进行listen的监听，并将socket send出去
 */