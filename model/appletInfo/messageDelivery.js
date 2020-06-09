const xml2js = require('xml2js');
// const postData = require('../wechat/tool').postData
const judgeEvent = require('./judgeEvent')
const builder = new xml2js.Builder();
const https = require('https');
const fs = require('fs');
const dataFormat = require('../../tool/dataFormat')

// const parser = new xml2js.Parser();
module.exports = async (ctx) => {
    // const reqData = await postData(req)
        const result = ctx.request.body
        let json = {}
        let xml = '123'
        console.log(result.xml)
        fs.readFile(__dirname + '/access_token.txt', (err, data) => {
            if (err) {
                throw new Error('hhh')
            }
            const access_token = JSON.parse(data.toString()).access_token
            console.log(result.xml.FromUserName[0])
            const infoData = {
                access_token,
                touser: result.xml.FromUserName[0],
            }
            console.log('result.xml.MsgType[0]')
            console.log(result.xml.MsgType[0])
            switch (result.xml.MsgType[0]) {
                case 'text':
                    infoData.msgtype = 'text';
                    infoData.text = {}
                    infoData.text.content = `${json.xml.Content},您输入了${result.xml.Content[0]},https://u2.jr.jd.com/downloadApp/index.html`
                    break;
                case 'image':
                    infoData.msgtype = 'link';
                    infoData.link = {}
                    infoData.link.title = '收到图片'
                    infoData.link.description = '跳转app'
                    infoData.link.url = 'https://u2.jr.jd.com/downloadApp/index.html'
                    infoData.link.thumb_url = result.xml.PicUrl[0]
                    break;
                case 'event':
                    infoData.msgtype = 'link';
                    infoData.link = {}
                    infoData.link.title = '欢迎使用客服'
                    infoData.link.description = '点击跳转app'
                    infoData.link.url = 'https://u2.jr.jd.com/downloadApp/index.html'
                    infoData.link.thumb_url = 'http://yangguang.natappvip.cc/appletImg/jingdong.png'
                    break;
                default:
                infoData.msgtype = 'text';
                infoData.text = {}
                infoData.text.content = `${json.xml.Content},目前仅支持文本和图片回复,https://u2.jr.jd.com/downloadApp/index.html`
                break;
            }
            console.log(infoData)
            const options = {
                    hostname: 'api.weixin.qq.com',
                    port: 443,
                    path: `/cgi-bin/message/custom/send?access_token=${access_token}`,
                    method: 'POST',
                    headers: {
                        'Content-Type': 'text/plain',
                        'Content-Length': Buffer.byteLength(JSON.stringify(infoData))
                    }
                };
            const request = https.request(options, async (res) => {
                console.log(res.statusCode)
                console.log('设置成功')
                const resData = await dataFormat(res)
                console.log(resData)
            })
            request.on('error', (e) => {
                console.log(e)
            })
            request.write(JSON.stringify(infoData))
            request.end();
        })
        switch (result.xml.MsgType[0]) {
            case 'text':
                json = {
                    xml: {
                        ToUserName: result.xml.FromUserName[0],
                        FromUserName: result.xml.ToUserName[0],
                        CreateTime: Number(new Date) / 1000,
                        MsgType: 'text',
                        Content: '收到文本消息'
                    }
                }
                xml = builder.buildObject(json)
                console.log(xml)
                ctx.body = xml;
                break;
            case 'image':
                json = {
                    xml: {
                        ToUserName: result.xml.FromUserName[0],
                        FromUserName: result.xml.ToUserName[0],
                        CreateTime: Number(new Date) / 1000,
                        MsgType: 'text',
                        Content: '收到图片消息'
                    }
                }
                xml = builder.buildObject(json)
                ctx.body = xml;
                break;
            case 'voice':
                json = {
                    xml: {
                        ToUserName: result.xml.FromUserName[0],
                        FromUserName: result.xml.ToUserName[0],
                        CreateTime: Number(new Date) / 1000,
                        MsgType: 'text',
                        Content: '收到语音消息'
                    }
                }
                xml = builder.buildObject(json)
                ctx.body = xml;
                break;
            case 'video':
                json = {
                    xml: {
                        ToUserName: result.xml.FromUserName[0],
                        FromUserName: result.xml.ToUserName[0],
                        CreateTime: Number(new Date) / 1000,
                        MsgType: 'text',
                        Content: '收到视频消息'
                    }
                }
                xml = builder.buildObject(json)
                ctx.body = xml;
                break;
            case 'shortvideo':
                json = {
                    xml: {
                        ToUserName: result.xml.FromUserName[0],
                        FromUserName: result.xml.ToUserName[0],
                        CreateTime: Number(new Date) / 1000,
                        MsgType: 'text',
                        Content: '收到小视频消息'
                    }
                }
                xml = builder.buildObject(json)
                ctx.body = xml;
                break;
            case 'location':
                json = {
                    xml: {
                        ToUserName: result.xml.FromUserName[0],
                        FromUserName: result.xml.ToUserName[0],
                        CreateTime: Number(new Date) / 1000,
                        MsgType: 'text',
                        Content: '收到地理位置消息'
                    }
                }
                xml = builder.buildObject(json)
                ctx.body = xml;
                break;
            case 'link':
                json = {
                    xml: {
                        ToUserName: result.xml.FromUserName[0],
                        FromUserName: result.xml.ToUserName[0],
                        CreateTime: Number(new Date) / 1000,
                        MsgType: 'text',
                        Content: '收到链接消息'
                    }
                }
                xml = builder.buildObject(json)
                ctx.body = xml;
                break;
            case 'event':
                judgeEvent(result.xml, ctx)
                break;
            default:
                json = {
                    xml: {
                        ToUserName: result.xml.FromUserName[0],
                        FromUserName: result.xml.ToUserName[0],
                        CreateTime: Number(new Date) / 1000,
                        MsgType: 'text',
                        Content: '不确定什么消息'
                    }
                }
                xml = builder.buildObject(json)
                ctx.body = xml;
                break;
        }
}