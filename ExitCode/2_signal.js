/*
 * @Author: 陈鑫宇 xinyu.chen@eeoa.com
 * @Date: 2022-12-21 15:34:53
 * @LastEditors: 陈鑫宇 xinyu.chen@eeoa.com
 * @LastEditTime: 2022-12-30 18:17:50
 * @FilePath: /node/ExitCode/2_signal.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/**
 * todo: kill
 * The kill utility sends a signal to the processes specified by the pid operands.
 * 如何杀死一个进程？答：kill $pid
 * 准确的来说，一个 kill 命令用以向一个进程发送 signal，而非杀死进程。大概是杀进程的人多了，就变成了 kill
 * 
 * todo: 父进程 可以通过 kill()方法发送一个SIGTERM系统信号给子进程，并不能真正的杀死子进程
 * 
 * child.kill([signal])
 * process.kill(pid,[signal])
 * 前者是发送给子进程，后者是发送给目标进程
 * 
 */

const spawn = require('child_process').spawn

// 列出全部的信号名称
const command = 'kill -l'
// 查看自己系统内的shell类型
// const command = 'cat /etc/shells'
let file, args;

if (process.platform === 'win32') {
  file = 'cmd.exe';
  args = ['/s', '/c', '"' + command + '"'];
  options = util._extend({}, options);
  options.windowsVerbatimArguments = true;
}
else {
  file = '/bin/sh';
  args = ['-c', command];
}

const c1 = spawn(file,args)

c1.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

c1.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

c1.on('close', (code) => {
  console.log(`close , child process exited with code ${code}`);
});