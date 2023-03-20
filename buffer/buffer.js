// ? node 中的Buffer，和上述的TypedArray、DataView实际是一种东西，都是用来操纵ArrayBuffer的一种工具。
// ! 1. Buffer 是一个用于操作 ArrayBuffer 的视图(view)    https://zhuanlan.zhihu.com/p/144381462
// ! buffer所占用的内存是堆外内存不是通过V8分配的。在node的C++层面实现申请的。

// ! 继承 Uint8Array
// ! Buffer.from(), Buffer.alloc() 都是创建一个buffer， Buffer.from()从字符串或者数组创建一个buffer, Buffer.alloc()是创建一个指定大小的buffer

// ! 为了高效的使用申请来的内存，node采用了slab分配机制，slab分配机制是一种动态内存管理机制

// ! 一个slab是 8kb 内存   buffer的parent属性指向slab    slab 存放在局部变量内存池 pool内，

// ? 存放在一块slab内的buffer的.bugger 属性是相同的指向 图解: ./slab.webp
// ? 一个小的Buffer对象的buffer属性是一个ArrayBuffer对象，若这个对象的大小小于内存池大小的一半且不为0，那么其buffer属性是整个内存池。

// ! 分配小buffer时候（小于8kb）
// ? 如果8kb的slab中存在剩余空间可以存放 这个buffer，则放在这个slab中，如果剩余空间不够存储则生成新的slab进行存储，（上一个不够内存的slab剩余内存仍不能释放会造成浪费，被现有的字节占用，会一直空着但被占用到最后被释放）

// ! 分配大buffer（超过8kb）
// ? 直接分配一个SlowBuffer

// ! 内存池(memory pool)是一段大小固定、预分配的连续内存块。
// ? 其目的是保持这些小内存块足够紧凑，以防止因存在大量单独管理的小内存块而产生的大量无法被利用的内存碎片。 
// ? 在 JavaScript 里，所谓的“内存池(memory pool)”就是默认大小(由 Buffer.poolSize 定义)为 8KiB(8192 Bytes) 的 ArrayBuffer。


// ? Blob File