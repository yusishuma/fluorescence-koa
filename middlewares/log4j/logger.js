/**
 * Created by matonghe on 15/03/2017.
 */
import log4js from "log4js";
import mongodbAppender from "log4js-node-mongodb";
import PROCESS_ENV from "dotenv";
PROCESS_ENV.config();
log4js.addAppender(mongodbAppender.appender({
    connectionString: 'localhost:27017/test'

}), 'fluorescence');

log4js.configure({
    appenders: [
        { type: 'console' },
        {
            'type': 'dateFile',
            'filename': './logs/access.log',
            'pattern': '-yyyy-MM-dd',
            'category': 'http'
        },
        {
            'type': 'file',
            'filename': './logs/app.log',
            'maxLogSize': 10485760,
            'numBackups': 3
        },
        {
            'type': 'logLevelFilter',
            'level': 'ERROR',
            'appender': {
                'type': 'file',
                'filename': './logs/errors.log'
            }
        }
    ]
});
const logger = log4js.getLogger('http');
//logger.setLevel('INFO');

export default logger;
