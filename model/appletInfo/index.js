const https = require('https');
const fs = require('fs');
const dataFormat = require('../../tools/dataFormat')

exports.getAppletAccessToken = async () => {
    fs.readFile(__dirname + '/access_token.txt', (err, data) => {
        const access_token = data.toString()
        if (err) {
            throw new Error(err)
        }
        if(access_token) return
        console.log('获取token')
        https.get('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wx5e8fc6bbef84c4c3&secret=cb8a2e22a1ad97b618881d618a177c00', async (res) => {
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

