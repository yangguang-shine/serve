const https = require('https');
const fs = require('fs');
const dataFormat = require('../../tool/dataFormat')
const buttonData = require('./button')

exports.getAccessToken = async () => {
    fs.readFile(__dirname + '/access_token.txt', (err, data) => {
        const access_token = data.toString()
        if (err) {
            throw new Error(err)
        }
        if(access_token) return
        console.log('获取token')
        https.get('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wxd3070d04299694f4&secret=62e5ae62775a3277d55571b53e212e12', async (res) => {
            const resData = await dataFormat(res)
            console.log(resData)
            console.log(typeof resData)
            fs.writeFile(__dirname + '/access_token.txt', resData, (err) => {
                if (err) {
                    console.log('error')
                } else {
                    console.log('成功')
                }
            })
        })
    })
}

exports.setMenu = () => {
    fs.readFile(__dirname + '/access_token.txt', (err, data) => {
        if (err) {
            throw new Error('hhh')
        }
        const access_token = JSON.parse(data.toString()).access_token
        console.log('接口调用凭证：')
        console.log(access_token);
        const options = {
                hostname: 'api.weixin.qq.com',
                port: 443,
                path: `/cgi-bin/menu/create?access_token=${access_token}`,
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain',
                    'Content-Length': Buffer.byteLength(JSON.stringify(buttonData))
                }
            };
            console.log(buttonData)
        const request = https.request(options, async (res) => {
            console.log(res.statusCode)
            console.log('设置成功')
            const resData = await dataFormat(res)
            console.log(resData)
        })
        request.on('error', (e) => {
            console.log(e)
        })
        request.write(JSON.stringify(buttonData))
        request.end();
    })
}