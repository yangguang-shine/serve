const encryption = (password) => {
    const length = password.length
    if (length % 2) {
        const font = password.slice(0, parseInt(length / 2))
        const medium = password[parseInt(length / 2)]
        const back = password.slice(parseInt(length / 2) + 1)
        return `${back}${medium}${font}`
    } else {
        const font = password.slice(0, parseInt(length / 2))
        const back = password.slice(parseInt(length / 2))
        return `${back}${font}`
    }
}
// 订单号 orderKey 0 6
module.exports = encryption

//  var encryption = (password) => {
//     const length = password.length
//     if (length % 2) {
//         const font = password.slice(0, parseInt(length / 2))
//         const medium = password[parseInt(length / 2)]
//         const back = password.slice(parseInt(length / 2) + 1)
//         let str = `${back}${medium}${font}`
//         const first = str[0]
//         const end = str[str.length - 1];
//         str[0] = end;
//         str[str.length - 1] = first
//         return str.replace(/(^.)(.$)/, '$2')
//     }
// }
// encryption('12345')