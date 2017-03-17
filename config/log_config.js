/**
 * Created by matonghe on 16/03/2017.
 */
import path from 'path';
import fs from 'fs';
//日志根目录
var baseLogPath = path.resolve(__dirname, '../logs');

//错误日志输出完整路径
const errorLogPath = path.resolve(__dirname, "../logs/error/error");

//响应日志输出完整路径
const responseLogPath = path.resolve(__dirname, "../logs/response/response");

export const log_config = {
    "appenders":
        [
            { type: 'console' },
            //错误日志
            {
                "category":"errorLogger",             //logger名称
                "type": "dateFile",                   //日志类型
                "filename": errorLogPath,             //日志输出位置
                "alwaysIncludePattern":true,          //是否总是有后缀名
                "pattern": "-yyyy-MM-dd.log"       //后缀，每天时创建一个新的日志文件
            },
            //响应日志
            {
                "category":"resLogger",
                "type": "dateFile",
                "filename": responseLogPath,
                "alwaysIncludePattern":true,
                "pattern": "-yyyy-MM-dd.log"
            }
        ],
    "levels":                                     //设置logger名称对应的的日志等级
        {
            "errorLogger":"ERROR",
            "resLogger":"ALL"
        },
    "baseLogPath": baseLogPath                  //logs根目录
};
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
export const initLogPath = function(){
    //创建log的根目录'logs'
    let logConfig = log_config;
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

