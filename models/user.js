/**
 * Created by matonghe on 15/03/2017.
 */

import mongoose from "mongoose";
import moment from "moment";
import CONSTANTS from "../utils/constants";
const Schema = mongoose.Schema;
// const ObjectId = Schema.Types.ObjectId;

const UserSchema = new Schema({

        /**
         * 昵称
         */
        nickname: {
            type: String,
            trim: true,
            default: "荧光粉"
        },

        /**
         * 性别
         * {UNKNOWN: 0, MALE: 1, FEMALE: 2}
         */
        gender: {
            type: Number,
            default: CONSTANTS.GENDER.UNKNOWN,
            enum: [
                0,
                1,
                2
            ]

        },

        /**
         * 头像
         */
        avatar: {
            type: String
        },

        /**
         * 用户账号信息
         */
        account: {
            username: {
                type: String,
                trim: true
            },
            phone: {
                type: String,
                trim: true,
                index: true
            },
            password: {
                type: String,
                trim: true
            }
        },
        createdAt: {
            type: Date,
            required: true,
            default: Date.now,
            get: function (date) {
                return moment(date).format('YYYY-MM-DD HH:mm:ss');
            }
        },
        updatedAt: {
            type: Date,
            required: true,
            default: Date.now,
            get: function (date) {
                return moment(date).format('YYYY-MM-DD HH:mm:ss');
            }
        }
    },
    {
        id: false,

        toJSON: {
            getters: true
        }
    });
UserSchema.methods.validPassword = function( pwd ) {
    // EXAMPLE CODE!
    return ( this.account.password === pwd );
};
UserSchema.options.toJSON.transform = function (doc, ret) {
    ret.userId = ret._id.toString();
    delete ret.__v;
    delete ret._id;
};
export default UserSchema;