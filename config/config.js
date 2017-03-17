/**
 * Created by matonghe on 15/03/2017.
 */
import dot_env from 'dotenv';
import variableExpansion from 'dotenv-expand';
const  PROCESS_ENV = dot_env.config();
variableExpansion(PROCESS_ENV);
import mongoose from 'mongoose';
mongoose.Promise = require('q').Promise;
import logUtil from '../utils/log_util';

/**
 * create mongodb connect
 */
export const mongodbConnect = function () {
    mongoose.connect(PROCESS_ENV.DB_URI, {
        mongos: false

    }, function (err) {
        if (err) {
            logUtil.Logger.warn('与mongodb断开连接 %ssec 后重试', PROCESS_ENV.RECONNECT_TIME / 1000);
            setTimeout(mongodbConnect, PROCESS_ENV.RECONNECT_TIME);

        }
        else {
            logUtil.Logger.info('已连接到mongodb');
        }
    });
};

mongoose.Promise = require('q').Promise;
