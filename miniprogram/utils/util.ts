export const formatTime = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return (
        [year, month, day].map(formatNumber).join('/') +
        ' ' +
        [hour, minute, second].map(formatNumber).join(':')
    )
}

const formatNumber = (n: number) => {
    const s = n.toString()
    return s[1] ? s : '0' + s
}

/**
 * 防抖函数
 * @param fn 执行函数
 * @param delay 防抖时间
 * @param immediate 是否第一次立即执行
 */
export function debounce(fn: Function, delay = 500, immediate = false) {
    // timer 是在闭包中
    let timer: number | null = null
    // TypeScript 提供了一种机制，可以在函数入参列表中第一个位置处，手动写入 this 标识其类型。但这个 this 入参只作为一个形式上的参数，供 TypeScript 做静态检查时使用，编译后是不会存在于真实代码中的。
    return function (this: any, ...args: any) {
        if (timer) {
            clearTimeout(timer)
        }
        if(immediate && !timer) {
            fn.apply(this, args)
            timer = setTimeout(() => {
                timer = null
            }, delay);
        } else {
            timer = setTimeout(() => {
                // 改变this指向
                fn.apply(this, args)
                timer = null
            }, delay);
        }
    }
} 