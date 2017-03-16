/**
 * Created by matonghe on 16/03/2017.
 */
import path from 'path';
//日志根目录
var baseLogPath = path.resolve(__dirname, '../logs');

//错误日志输出完整路径
const errorLogPath = path.resolve(__dirname, "../logs/error/error");

//响应日志输出完整路径
const responseLogPath = path.resolve(__dirname, "../logs/response/response");

const log_config = {
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
export default log_config;