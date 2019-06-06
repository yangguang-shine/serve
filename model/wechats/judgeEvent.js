const xml2js = require('xml2js');
const builder = new xml2js.Builder();
// const parser = new xml2js.Parser();
module.exports = (xmlObj, ctx) => {
    let json = {}
    let xml = ''
    switch (xmlObj.Event[0]) {
        case 'subscribe':
            json = {
                xml: {
                    ToUserName: xmlObj.FromUserName[0],
                    FromUserName: xmlObj.ToUserName[0],
                    CreateTime: Number(new Date) / 1000,
                    MsgType: 'text',
                    Content: '欢迎关注'
                }
            }
            xml = builder.buildObject(json)
            ctx.body = xml;
            // ctx.body = `<xml>
            //             <ToUserName><![CDATA[${xml.FromUserName[0]}]]></ToUserName>
            //             <FromUserName><![CDATA[${xml.ToUserName[0]}]]></FromUserName>
            //             <CreateTime>${Number(new Date)/1000}</CreateTime>
            //             <MsgType><![CDATA[text]]></MsgType>
            //             <Content><![CDATA[欢迎关注]]></Content>
            //         </xml>`
            break;
        case 'CLICK':
            switch(xmlObj.EventKey[0]) {
                case 'yangguang-get-info':
                    json = {
                        xml: {
                            ToUserName: xmlObj.FromUserName[0],
                            FromUserName: xmlObj.ToUserName[0],
                            CreateTime: Number(new Date) / 1000,
                            MsgType: 'text',
                            Content: '您想获取信息'
                        }
                    }
                    xml = builder.buildObject(json)
                    ctx.body = xml;
                    // ctx.body = `<xml>
                    //             <ToUserName><![CDATA[${xml.FromUserName[0]}]]></ToUserName>
                    //             <FromUserName><![CDATA[${xml.ToUserName[0]}]]></FromUserName>
                    //             <CreateTime>${Number(new Date)/1000}</CreateTime>
                    //             <MsgType><![CDATA[text]]></MsgType>
                    //             <Content><![CDATA[您想获取信息]]></Content>
                    //         </xml>`
                break;
                case 'yangguang-praise':
                    json = {
                        xml: {
                            ToUserName: xmlObj.FromUserName[0],
                            FromUserName: xmlObj.ToUserName[0],
                            CreateTime: Number(new Date) / 1000,
                            MsgType: 'text',
                            Content: '您想赞扬我们'
                        }
                    }
                    xml = builder.buildObject(json)
                    ctx.body = xml;
                    // ctx.body = `<xml>
                    //             <ToUserName><![CDATA[${xml.FromUserName[0]}]]></ToUserName>
                    //             <FromUserName><![CDATA[${xml.ToUserName[0]}]]></FromUserName>
                    //             <CreateTime>${Number(new Date)/1000}</CreateTime>
                    //             <MsgType><![CDATA[text]]></MsgType>
                    //             <Content><![CDATA[您想赞扬我们]]></Content>
                    //         </xml>`
                break;
                default:
                    json = {
                        xml: {
                            ToUserName: xmlObj.FromUserName[0],
                            FromUserName: xmlObj.ToUserName[0],
                            CreateTime: Number(new Date) / 1000,
                            MsgType: 'text',
                            Content: '请刷新公众号'
                        }
                    }
                    xml = builder.buildObject(json)
                    ctx.body = xml;
                    // ctx.body = `<xml>
                    //         <ToUserName><![CDATA[${xml.FromUserName[0]}]]></ToUserName>
                    //         <FromUserName><![CDATA[${xml.ToUserName[0]}]]></FromUserName>
                    //         <CreateTime>${Number(new Date)/1000}</CreateTime>
                    //         <MsgType><![CDATA[text]]></MsgType>
                    //         <Content><![CDATA[请刷新公众号]]]></Content>
                    //     </xml>`
                break;
            }
            break;
        case 'VIEW':
            json = {
                xml: {
                    ToUserName: xmlObj.FromUserName[0],
                    FromUserName: xmlObj.ToUserName[0],
                    CreateTime: Number(new Date) / 1000,
                    MsgType: 'text',
                    Content: '欢迎使用搜索引擎'
                }
            }
            xml = builder.buildObject(json)
            ctx.body = xml;
            // ctx.body = `<xml>
            //             <ToUserName><![CDATA[${xml.FromUserName[0]}]]></ToUserName>
            //             <FromUserName><![CDATA[${xml.ToUserName[0]}]]></FromUserName>
            //             <CreateTime>${Number(new Date)/1000}</CreateTime>
            //             <MsgType><![CDATA[text]]></MsgType>
            //             <Content><![CDATA[欢迎使用搜索引擎]]></Content>
            //         </xml>`
            break;
        case 'LOCATION':
            json = {
                xml: {
                    ToUserName: xmlObj.FromUserName[0],
                    FromUserName: xmlObj.ToUserName[0],
                    CreateTime: Number(new Date) / 1000,
                    MsgType: 'text',
                    Content: '收到您的地理位置信息'
                }
            }
            xml = builder.buildObject(json)
            ctx.body = xml;
            // ctx.body = `<xml>
            //             <ToUserName><![CDATA[${xml.FromUserName[0]}]]></ToUserName>
            //             <FromUserName><![CDATA[${xml.ToUserName[0]}]]></FromUserName>
            //             <CreateTime>${Number(new Date)/1000}</CreateTime>
            //             <MsgType><![CDATA[text]]></MsgType>
            //             <Content><![CDATA[收到您的地理位置信息]]></Content>
            //         </xml>`
            break;
        default:
            json = {
                xml: {
                    ToUserName: xmlObj.FromUserName[0],
                    FromUserName: xmlObj.ToUserName[0],
                    CreateTime: Number(new Date) / 1000,
                    MsgType: 'text',
                    Content: '不确定什么事件'
                }
            }
            xml = builder.buildObject(json)
            ctx.body = xml;
            // ctx.body = `<xml>
            //             <ToUserName><![CDATA[${xml.FromUserName[0]}]]></ToUserName>
            //             <FromUserName><![CDATA[${xml.ToUserName[0]}]]></FromUserName>
            //             <CreateTime>${Number(new Date)/1000}</CreateTime>
            //             <MsgType><![CDATA[text]]></MsgType>
            //             <Content><![CDATA[不确定什么事件]]></Content>
            //         </xml>`
        break;
    }
}