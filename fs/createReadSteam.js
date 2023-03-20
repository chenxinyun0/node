const { createReadStream } = require('fs')

// ! 当使用createReadSteam不添加配置参数时，默认是非流动的形式
// const readStream = createReadStream('./aaa.js')
// ! 当为 createReadStream 添加 highWaterMark 参数，设置一次读多少个字节，默认是 64*1024
const readStream = createReadStream('./aaa.js',{
  highWaterMark:3,
  // start:0, // ? 读取文件开始位置
  // end:2, // ? 读取文件结束位置
  // encoding:'utf8' // ? 默认null
  // autoClose:false, // ? 默认读取完毕后自动关闭
  // flags:'r', // ? 默认 'r'    ???====????
})

readStream.on('open',()=>{
  // 打开文件
  console.log('open')
})

// readStream.on('data', (data) => {
//   console.log('buffer:',data)
// })

readStream.on('data', (data) => {
  console.log('buffer:',data)
  console.log('到目前为止已读取%d个字节', readStream.bytesRead)
    // ! 暂停读取
    readStream.pause()

    // ! 设置过2秒钟读取一次数据
    setTimeout(() => {
        // ! 恢复读取
        readStream.resume()
    }, 2000)
})

readStream.on('error', (err) => {
  // 在读收和写入过程中发生错误时触发。
  console.log('error', err)
})

readStream.on('end', () => {
  // 没有更多的数据可读时触发
  console.log('end')
})

readStream.on('close', () => {
  // 关闭文件,autoClose为false时就不触发了
  console.log('close')
})