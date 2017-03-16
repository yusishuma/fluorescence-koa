/**
 * Created by matonghe on 16/03/2017.
 */
/**
 * 自定义Api异常
 */
import ApiErrorNames from './ApiErrorNames';

class ApiError extends Error{

    //构造方法
    constructor(error_name, error_code,  error_message){
    super();
    
    const error_info = ApiErrorNames.getErrorInfo(error_name);

    this.name = error_name;
    this.code = error_code;
    this.message = error_message;
}
}

export default ApiError;