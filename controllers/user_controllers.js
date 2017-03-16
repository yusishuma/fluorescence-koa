/**
 * Created by matonghe on 15/03/2017.
 */
import User from "../models/user";

//获取用户
export const getUser = async (ctx, next) => {
    ctx.body = {
        username: '阿，希爸',
        age: 30
    }
};

//用户注册
export const registerUser = async (ctx, next) => {
    ctx.body = {message: 'success'}
    console.log('registerUser', ctx.request.body);
};

