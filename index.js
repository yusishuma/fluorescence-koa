'use strict';

import 'babel-polyfill';
import Koa from 'koa';
import logger from 'koa-logger';
import BodyParser from 'koa-bodyparser';
import { Exceptions, ExceptionHandler } from './exceptions';
import { mongodbConnect } from "./config/config";
const app = new Koa();
import onerror from 'koa-onerror';
import api from "./routers/api"
import staticServer from 'koa-static';
import path from 'path';
import { initLogPath } from './config/log_config';
import logUtil from './utils/log_util';
onerror(app);
import Router from 'koa-router';
const router = Router();
import './middlewares/passport/auth';
import passport from "koa-passport";
app.use(passport.initialize());
app.use(passport.session());

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
			if (!ctx.body){
                ctx.status = 404;
                throw new Exceptions.NotFound(`Endpoint [${ctx.request.url}] not found.`);
            }else
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
	.use(logger())
	.use(async (ctx, next) => {
		ctx.state = {};
		ctx.state.query = ctx.request.query;
		ctx.state.body = ctx.request.body;
		await next();
	})

    /**
     * TODO VERSION QUESTIONS RESOLVED
     */
    .use(router.routes())
    // Allowed methods
    .use(router.allowedMethods());
/**
 *  Routers
 */
router.use('/api', api.routes(), api.allowedMethods());
router.post('/custom', function(ctx, next) {
    return passport.authenticate('local', function(err, user, info, status) {
        if (user === false) {
            ctx.status = 401;
            throw new Exceptions.Unauthenticated(`Endpoint [${ctx.request.url}] Unauthenticated.`);
        } else {
            ctx.body = { success: true };
            return ctx.login(user)
        }
    })(ctx, next)
})

/**
 *  create mongodb connect
 */
mongodbConnect();

/**
 * 静态文件
 */
app.use(staticServer(path.join(__dirname,'public')));

// logger
initLogPath();//初始化日志文件

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

// Require authentication for now
app.use(function(ctx, next) {
    if (ctx.isAuthenticated()) {
        return next()
    } else {
        this.status = 401;
    }
});


/**
 launch
 */
app.listen(3210, () => {
    logUtil.Logger.info('Listening on port 3210');
});
