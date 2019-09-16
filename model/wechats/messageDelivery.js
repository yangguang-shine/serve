const xml2js = require('xml2js');
// const postData = require('../wechat/tool').postData
const judgeEvent = require('./judgeEvent')
const builder = new xml2js.Builder();
// const parser = new xml2js.Parser();
module.exports = async (ctx) => {
    // const reqData = await postData(req)
        const result = ctx.request.body
        let json = {}
        let xml = ''
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