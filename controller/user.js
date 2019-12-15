/*
 * @Author: Andrea 
 * @Date: 2019-12-15 19:49:42 
 * @Last Modified by: Andrea
 * @Last Modified time: 2019-12-15 20:45:10
 * 
 * @desc User类逻辑业务 
 */

const model = require('../database/models')

/**
 * 用户是否存在
 * @param {string} account 
 */
async function hasUser(account) {
    console.log(account, '123213')
    let user = await model.User.findOne({
        where: {
            account
        }
    })

    console.log(user, 'find')

    if (!user) {
        console.log('return false')
        return false
    }

    return user

}

/**
 * 创建用户
 * @param {Object} option 
 */
async function createUser(option) {
    let user = await model.User.create(option)
    if (user) {
        console.log(user, '船舰成功')
        return user //创建成功
    }

    return false //创建失败
}


exports.hasUser = hasUser
exports.createUser = createUser