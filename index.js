'use strict';

import 'babel-polyfill';

import Koa from 'koa';
import Router from 'koa-router';
import BodyParser from 'koa-bodyparser';
import { Exceptions, ExceptionHandler } from './exceptions';
import mongoose from 'mongoose';
// import strategySchema from './models/strategy'
import dotenv from 'dotenv';
import variableExpansion from 'dotenv-expand';
const myEnv = dotenv.config();
variableExpansion(myEnv);
/**
 *
 */
mongoose.connect(myEnv.DB_URI, {
    mongos: false

}, function (err) {
    if (err) {
        // logger.warn('与mongodb断开连接 %ssec 后重试', process.env.RECONNECT_TIME / 1000);
        setTimeout(connectMongo, process.env.RECONNECT_TIME);

    }
    else {
        console.log('已连接到mongodb');
    }
});
mongoose.Promise = require('q').Promise;
const app = new Koa();
const router = Router();
// const Strategy = mongoose.model('Strategy', strategySchema);
import fetch from 'node-fetch';

/**
 Middlewares
 **/

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
				content: ctx.body
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
	// routes
	.use(router.routes())
	// Allowed methods
	.use(router.allowedMethods());

/**
 Routes
 **/

router.get('/', (ctx, next) => {

	ctx.body = { hello: "world" };

});


/**
 launch
 */
app.listen(3210, () => {
	console.log('Listening on port 3210');
});
