/**
 * todo: ArrayBuffer对象代表原始的二进制数据，TypedArray视图用来读写简单类型的二进制数据，DataView视图用来读写复杂类型的二进制数据。
 * ! ArrayBuffer ArrayBuffer 对象用来表示通用的、固定长度的原始二进制数据缓冲区。它是一个字节数组，通常在其他语言中称为“byte array”。
 * ? 可用于在内存中分配特定数量的字节空间。
 * 你不能直接操作 ArrayBuffer 中的内容；而是要通过类型化数组对象或 DataView 对象来操作，它们会将缓冲区中的数据表示为特定的格式，并通过这些格式来读写缓冲区的内容。
 */

// ! 开辟16个字节的内存空间，但是我们不能直接操作ArrayBuffer对象
const arrayBuffer = new ArrayBuffer(16)

console.log(arrayBuffer,'arrayBuffer')

// ! ArrayBuffer一经创建就不能再调整大小。不过，可以使用slice()复制其全部或部分到一个新实例中：

const arrayBuffer2 = arrayBuffer.slice(4,16)
console.log(arrayBuffer2,'arrayBuffer2Buffer2')

// ! 转换成DataView对象  
// ? DataView 视图是一个可以从二进制 ArrayBuffer 对象中读写多种数值类型的底层接口，使用它时，不用考虑不同平台的字节序（endianness）问题。
//  todo :  DataView默认使用整个ArrayBuffer
let dataView = new DataView(arrayBuffer)

console.log(dataView,'dataView')
console.log('',dataView.byteOffset)
console.log('视图字节数',dataView.byteLength)
console.log('dataView.buffer === arrayBuffer:',dataView.buffer === arrayBuffer)

// ! 构造函数接收一个可选的字节偏移量 (byteOffset)和字节长度(byteLength)
// byteOffset=0 表示视图从缓冲起点开始
// byteLength=8 限制视图为前 8 个字节
const dataView2 = new DataView(arrayBuffer,0,8)
console.log('dataView2字节偏移量',dataView2.byteOffset)
console.log('dataView2字节剩余长度',dataView2.byteLength)

// ! 如果不指定，则DataView会使用剩余的缓冲
// ? byteOffset=8 表示视图从缓冲的第9 个字节开始
// ? byteLength未指定，默认为剩余缓冲
const dataView3 = new DataView(arrayBuffer,9)
console.log('dataView3字节偏移量',dataView3.byteOffset)
console.log('dataView3剩余字节长度',dataView3.byteLength)

