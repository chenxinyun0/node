// 将战场从tcp层面转移到http层面

const fork = require('child_process').fork;


const p1 = fork('./child_test2.js')
const p2 = fork('./child_test2.js')

const server = require('net').createServer()

server.listen(1333,function(){
  p1.send('server',server)
  p2.send('server',server)
  // 将服务器发送给子进程之后，关闭服务器的监听，让子进程来处理请求。 使得主进程更加轻量
  server.close()
})