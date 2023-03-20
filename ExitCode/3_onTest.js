/**
 * todo： Node 中 Promise.reject 时 exit code 为 0？？？？如何处理reject的问题？ 需要补充下
 * 在 Node12+ 中可以通过 node --unhandled-rejections=strict error.js 执行脚本，视 Promise.reject 的 exit code 为 1，在 Node15 中修复了这一个问题
 * Node 中可以通过 process.exitCode = 1 显式设置 exit code
 * 当进程结束的 exit code 为非 0 时，系统会认为该进程执行失败
 * 
 * todo: 不同状态码退出效果是否相同，为什么有些http服务退出后端口依旧被占用
 */

const spawn = require('child_process').spawn

console.log('start')
/**
 * SIGINT	  2	  可捕获	  Ctrl+C 中断进程
 * SIGQUIT	3	  可捕获	  Ctrl+D 中断进程
 * SIGKILL	9	  不可捕获	强制中断进程（无法阻塞）
 * SIGTERM	15	可捕获	  优雅终止进程（默认信号）   软件终止信号
 * SIGSTOP	19	不可捕获  优雅终止进程中
 * 
 * kill number pid 在下方捕获
 * 
 */
const command = `kill -0 ${process.pid}` 
// const command = `cat aaaa` 
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

process.on('SIGINT',  () => {
    console.log('Received: SIGINT')
    setTimeout(()=>{
      // process.exit( code ) Code:它可以是0或1。0表示没有任何类型的故障结束进程，而1表示由于某种故障而结束进程。
      process.exit(1)
    },1000)
  }
)
process.on('SIGQUIT', () => console.log('Received: SIGQUIT'))
process.on('SIGTERM', () => console.log('Received: SIGTERM'))
// process.on('SIGHUP', () => console.log('Received: SIGHUP'))
 
setTimeout(() => {}, 1000000)


/**
 * # 列出所有的 signal
 * $ kill -l 
 *  1) SIGHUP       2) SIGINT       3) SIGQUIT      4) SIGILL       5) SIGTRAP
 *  6) SIGABRT      7) SIGBUS       8) SIGFPE       9) SIGKILL     10) SIGUSR1
 * 11) SIGSEGV     12) SIGUSR2     13) SIGPIPE     14) SIGALRM     15) SIGTERM
 * 16) SIGSTKFLT   17) SIGCHLD     18) SIGCONT     19) SIGSTOP     20) SIGTSTP
 * 21) SIGTTIN     22) SIGTTOU     23) SIGURG      24) SIGXCPU     25) SIGXFSZ
 * 26) SIGVTALRM   27) SIGPROF     28) SIGWINCH    29) SIGIO       30) SIGPWR
 * 31) SIGSYS      34) SIGRTMIN    35) SIGRTMIN+1  36) SIGRTMIN+2  37) SIGRTMIN+3
 * 38) SIGRTMIN+4  39) SIGRTMIN+5  40) SIGRTMIN+6  41) SIGRTMIN+7  42) SIGRTMIN+8
 * 43) SIGRTMIN+9  44) SIGRTMIN+10 45) SIGRTMIN+11 46) SIGRTMIN+12 47) SIGRTMIN+13
 * 48) SIGRTMIN+14 49) SIGRTMIN+15 50) SIGRTMAX-14 51) SIGRTMAX-13 52) SIGRTMAX-12
 * 53) SIGRTMAX-11 54) SIGRTMAX-10 55) SIGRTMAX-9  56) SIGRTMAX-8  57) SIGRTMAX-7
 * 58) SIGRTMAX-6  59) SIGRTMAX-5  60) SIGRTMAX-4  61) SIGRTMAX-3  62) SIGRTMAX-2
 * 63) SIGRTMAX-1  64) SIGRTMAX
 */



/**
 * 1 未捕获的致命异常：存在未捕获的异常，并且其没有被域或 'uncaughtException' 事件句柄处理。
 * 2: 未使用（由 Bash 保留用于内置误用）
 * 3 内部 JavaScript 解析错误：NodeJS 引导过程中的内部 JavaScript 源代码导致解析错误。 这是极其罕见的，通常只能在 NodeJS 本身的开发过程中发生。
 * 4 内部 JavaScript 评估失败：NodeJS 引导过程中的内部 JavaScript 源代码在评估时未能返回函数值。 这是极其罕见的，通常只能在 NodeJS 本身的开发过程中发生。
 * 5 致命错误：V8 中存在不可恢复的致命错误。 通常将打印带有前缀 FATAL ERROR 的消息到标准错误。
 * 6 非函数的内部异常句柄：存在未捕获的异常，但内部致命异常句柄不知何故设置为非函数，无法调用。
 * 7 内部异常句柄运行时失败：存在未捕获的异常，并且内部致命异常句柄函数本身在尝试处理时抛出错误。 例如，如果 'uncaughtException' 或 domain.on('error') 句柄抛出错误，就会发生这种情况。
 * 8: 未使用。 在以前版本的 NodeJS 中，退出码 8 有时表示未捕获的异常。
 * 9 无效参数：指定了未知选项，或者提供了需要值的选项而没有值。
 * 10 内部 JavaScript 运行时失败：NodeJS 引导过程中的内部 JavaScript 源代码在调用引导函数时抛出错误。 这是极其罕见的，通常只能在 NodeJS 本身的开发过程中发生。
 * 12 无效的调试参数：设置了 --inspect 和/或 --inspect-brk 选项，但选择的端口号无效或不可用。
 * 13 未完成的顶层等待：在顶层代码中的函数外使用了 await，但传入的 Promise 从未解决。
 * >128 信号退出：如果 NodeJS 收到致命的信号，例如 SIGKILL 或 SIGHUP，则其退出码将是 128 加上信号代码的值。 这是标准的 POSIX 实践，因为退出码被定义为 7 位整数，并且信号退出设置高位，然后包含信号代码的值。 例如，信号 SIGABRT 的值是 6，因此预期的退出码将是 128 + 6 或 134。
 */