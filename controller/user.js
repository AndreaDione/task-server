/*
 * @Author: Andrea 
 * @Date: 2019-12-15 19:49:42 
 * @Last Modified by: Andrea
 * @Last Modified time: 2019-12-18 20:17:37
 * 
 * @desc User类逻辑业务 
 */

const model = require('../database/models')

/**
 * 用户是否存在
 * @param {string} account 
 */
async function hasUser(account) {
    // console.log(account, '123213')
    let user = await model.User.findOne({
        where: {
            account
        }
    })

    // console.log(user, 'find')

    if (!user) {
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
        return user //创建成功
    }

    return false //创建失败
}

/**
 * 修改个人基本信息
 * @param {string} account 
 * @param {object} option 
 */
async function updateBaseMsg(account, option) {
    console.log(option, account)
    let { name, phone, email, avatar } = option
    name = name || ''
    phone = phone || ''
    email = email || ''
    avatar = avatar || ''
    let user = await model.User.update({
        name,
        phone,
        email,
        avatar
    }, {
        where: {
            account
        }
    })

    console.log(user, 'update')

    if (!user) {
        return false
    }

    return user
}

async function updatePassword(account, password) {
    let user = await model.User.update({
        password
    }, {
        where: {
            account
        }
    })

    // console.log(user, 'update password')

    if (!user) {
        return false
    }

    return user
}


exports.hasUser = hasUser
exports.createUser = createUser
exports.updateBaseMsg = updateBaseMsg
exports.updatePassword = updatePassword