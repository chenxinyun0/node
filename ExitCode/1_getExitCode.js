/**
 * todo: exit code
 * exit code 代表一个进程的返回码，通过系统调用 exit_group 来触发。
 * 在 POSIX 中，0 代表正常的返回码，1-255 代表异常返回码.
 * 在业务实践中，一般主动抛出的错误码都是 1。
 * 在 Node 应用中调用 API process.exitCode = 1 来代表进程因期望外的异常而中断退出。
 * 
 * todo: 获取 exit code
 * 1，可以采用 echo $? 的方式，可查看终端上一进程的 exit code
 * 2，strace 查看 cat 的系统调用
 * 3，监听close事件
 */

const spawn = require('child_process').spawn;

const command = 'cat a || echo $?'

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
  // todo: 输出exit code
  console.log(`stdout: ${data}`);
});

c1.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

c1.on('close', (code) => {
  // todo: 输出 exit code
  console.log(`close , child process exited with code ${code}`);
});




/**
 * error事件：当前子进程无法被复制、无法被杀死、无法发送信息是会被创建
 * todo: exit事件：子进程退出时触发该事件，如果子进程正常退出，这个事件的第一个参数为退出码，否则为null；如果进程是通过kill()方法杀死的，会得到第二个参数，他表示杀死进程时的信号。
 * close 事件： 在子进程的标准输入输出流中止时触发该事件，参数与exit相同。
 * disconnect 事件 ： 在父进程或子进程中调用disconnect()方法时触发该事件，在调用该方法时关闭监听IPC通道。
 */