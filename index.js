'use strict';

import 'babel-polyfill';
import Koa from 'koa';
import BodyParser from 'koa-bodyparser';
import { Exceptions, ExceptionHandler } from './exceptions';
import { mongodbConnect } from "./config/config";
const app = new Koa();
import onerror from 'koa-onerror';
import api from "./routers/api"
import staticServer from 'koa-static';
import fs from 'fs';
import path from 'path';
import logConfig from './config/log_config';
import logUtil from './utils/log_util';
onerror(app);
import Router from 'koa-router';
const router = Router();
// import response_formatter from './middlewares/response_formatter';

app
// Counting time
	.use(async (ctx, next) => {
		let start = Date.now();
		await next();
		console.log(`[${ctx.request.method}][${ctx.request.url}] ${Date.now() - start} ms.`);
	})
	.use(async (ctx, next) => {
		try {
			await next();
			if (!ctx.body)
				throw new Exceptions.NotFound(`Endpoint [${ctx.request.url}] not found.`);
			ctx.body = {
				ok: true,
                message: 'success',
                data: ctx.body
			};
		} catch (e) {
			ctx.body = ExceptionHandler(e);
		}
	})
	// Body parser
	.use(BodyParser())
	.use(async (ctx, next) => {
		ctx.state = {};
		ctx.state.query = ctx.request.query;
		ctx.state.body = ctx.request.body;
		await next();
	})
    /**
     * TODO VERSION QUESTIONS RESOLVED
     */
    // .use(response_formatter('^/api'))
    .use(router.routes())
    // Allowed methods
    .use(router.allowedMethods());
/**
 *  Routers
 */
router.use('/api', api.routes(), api.allowedMethods());

/**
 *  create mongodb connect
 */
mongodbConnect();

/**
 * 静态文件
 */
app.use(staticServer(path.join(__dirname,'public')));

// logger
app.use(async (ctx, next) => {
    //响应开始时间
    const start = new Date();
    //响应间隔时间
    let ms;
    try {
        //开始进入到下一个中间件
        await next();

        ms = new Date() - start;
        //记录响应日志
        logUtil.logResponse(ctx, ms);

    } catch (error) {

        ms = new Date() - start;
        //记录异常日志
        logUtil.logError(ctx, error, ms);
    }
});
/**
 * 确定目录是否存在，如果不存在则创建目录
 */
const confirmPath = function(pathStr) {

    if(!fs.existsSync(pathStr)){
        fs.mkdirSync(pathStr);
        console.log('createPath: ' + pathStr);
    }
};

/**
 * 初始化log相关目录
 */
const initLogPath = function(){
    //创建log的根目录'logs'
    if(logConfig.baseLogPath){
        confirmPath(logConfig.baseLogPath)
        //根据不同的logType创建不同的文件目录
        for(let i = 0, len = logConfig.appenders.length; i < len; i++){
            if(logConfig.appenders[i].path){
                confirmPath(logConfig.baseLogPath + logConfig.appenders[i].path);
            }
        }
    }
}

initLogPath();

app.on('error', function(err,ctx){
    console.log(err);
});


/**
 launch
 */
app.listen(3210, () => {
	console.log('Listening on port 3210');
});
