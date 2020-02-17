/*
 * @Author: Andrea 
 * @Date: 2019-12-15 19:49:42 
 * @Last Modified by: Andrea
 * @Last Modified time: 2019-12-28 12:36:54
 * 
 * @desc User类逻辑业务 
 */

const model = require('../database/models')
const Sequelize = require('sequelize')
const { Op } = Sequelize

/**
 * 用户是否存在
 * @param {string} account 
 */
async function hasUser(account) {
    let user = await model.User.findOne({
        where: {
            account
        }
    })

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
async function updatePersonMsg(account, option) {
        // let { name, phone, email, avatar } = option
        // name = name || ''
        // phone = phone || ''
        // email = email || ''
        // avatar = avatar || ''
    let user = await model.User.update(option, {
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

/**
 * 获取用户列表(根据用户id数组获取)
 * @param  {Array} arr 用户ID数组
 * @return {[type]}     [description]
 */
async function getUserListByIds(arr = []) {
    let result = await model.User.findAndCountAll({
        attributes: {
            exclude: ['password', 'labels']
        },
        where: {
            account: {
                [Op.or]: arr
            }
        },
        raw: true
    })

    if(!result) {
        return false
    }

    return result
}

/**
 * 获取用户列表(根据输入的条件获取)
 * @param  {object} condition 关键字（包含keyword, page, limit）
 */
async function getUserListByKeywords(condition) {
    const {keyword, page, limit} = condition
    console.log(typeof limit, limit)
    let result = await model.User.findAndCountAll({
        attributes: {
            exclude: ['password', 'labels']
        },
        where: {
            [Op.or]: {
                account: {
                    [Op.like]: keyword
                },
                name: {
                    [Op.like]: keyword
                },
                phone: {
                    [Op.like]: keyword
                },
                email: {
                    [Op.like]: keyword
                }
            }
        },
        raw: true,
        limit: limit,
        offset: limit * (page - 1)
    })

    if(!result) {
        return false
    }

    return result
}

/**
 * 删除用户
 * @param  {[type]} id [description]
 * @return {[type]}    [description]
 */
async function deleteUser(account) {
    const result = await model.User.destroy({
        where: {
            account
        }
    })

    if (!result || result <= 0) {
        return false
    }

    return true
}

/**
 * 判断是否为管理员
 * @param  {[type]}  account [description]
 * @return {Boolean}         [description]
 */
function isAdmin(account) {
    return account === 'admin'
}


exports.hasUser = hasUser
exports.createUser = createUser
exports.updatePersonMsg = updatePersonMsg
exports.getUserListByIds = getUserListByIds
exports.getUserListByKeywords = getUserListByKeywords
exports.deleteUser = deleteUser
exports.isAdmin = isAdmin
    // exports.updatePassword = updatePassword