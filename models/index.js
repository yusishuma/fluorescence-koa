/**
 * Created by matonghe on 14/03/2017.
 */
import mongoose from "mongoose";
import CONSTANTS from "../utils/constants";
import Q from "q";
import UserSchema from "./user";

/**
 * 分页
 * @param options
 * @returns {*}
 */
mongoose.Model.findAllAndCount = function(options) {
    let searchOption = options.searchOption || {};
    let sortOption = options.sortOption || {};
    let limit = options.limit || CONSTANTS.PAGE.NUM;
    let field = options.field || {};
    let page = options.page || 1;
    let skipNum = (page * limit) - limit;
    let populateOpt = [];
    return Q.all([
        this.find(searchOption, field).deepPopulate(populateOpt).skip(skipNum).limit(limit).sort(sortOption),
        this.count(searchOption)
    ]);
};

/**
 * 数组属性分页
 * @param id
 * @param property
 * @param options
 * @param callback
 */
mongoose.Model.paginateForPro = function (id, property, options, callback) {
    let searchOption = options.searchOption || {};
    searchOption._id = id;
    let limit = options.limit || CONSTANTS.PAGE.NUM;
    let totalCount = options.totalCount;
    let page = options.page || 1;
    let populateOpt = [];
    const field = options.field || {};
    if (totalCount - page * limit < 0) {
        field[property] = {
            '$slice': totalCount - (page - 1) * limit

        };
    }
    else {
        field[property] = {
            '$slice': [
                totalCount - page * limit,
                limit
            ]

        };
    }

    this.findOne(searchOption, field).deepPopulate(populateOpt).exec(callback);
};
const User = mongoose.model("user", UserSchema);

export default { User } ;