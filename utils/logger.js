
const path = require('path');

const log4js = require('koa-log4');
const { access } = require('fs');


const LOG_PATH = path.join(__dirname, '../log');



log4js.configure({

    // 日志的输出

    appenders: {

        access: {

            type: 'dateFile',

            pattern: '-yyyy-MM-dd.log', // 生成文件的规则

            alwaysIncludePattern: true, // 文件名始终以日期区分

            encoding: 'utf-8',

            filename: path.join(LOG_PATH, 'access', 'access.log') // 生成文件名

        },

        application: {

            type: 'dateFile',

            pattern: '-yyyy-MM-dd.log',

            alwaysIncludePattern: true,

            encoding: 'utf-8',

            filename: path.join(LOG_PATH, 'application', 'application.log')

        },

        out: {

            type: 'console'

        }

    },

    categories: {

        default: { appenders: ['out'], level: 'info' },
        access: { appenders: ['access'], level: 'info' },
        application: { appenders: ['application'], level: 'all' }
    }

});



// getLogger 传参指定的是类型

exports.accessLogger = async (ctx, next) => {
    const log = log4js.getLogger('access');
    log.info(ctx.path)
    await next()
};
// 记录所有访问级别的日志
exports.logger = log4js.getLogger('application');