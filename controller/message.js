/*
 * @Author: Andrea 
 * @Date: 2020-01-15 14:41:49 
 * @Last Modified by: Andrea
 * @Last Modified time: 2020-01-15 15:23:30
 * @desc message
 */

const model = require('../database/models')
const Sequelize = require('sequelize')
const formatDate = require('../utlis/time')
const redis = require('../utlis/redis')
const { Op } = Sequelize

/**
 * 新增消息
 * @param {object} option message's attributes
 * 
 * @return {object}/{boolean} success return object, not return false(boolean)
 */
async function createMessage(option) {
    let message = await model.Message.create(option)

    if (!message) {
        return false
    }

    return message
}

/**
 * 删除消息
 * @param {Array} ids
 * 
 * @returns {boolean} success is true, fail is false 
 */
async function deleteMessage(ids) {
    //result表示受影响的行数，0表示不受影响
    let result = await model.Message.destroy({
        where: {
            id: {
                [Op.or]: ids
            }
        }
    })

    if (!result || result <= 0) {
        return false
    }

    return true
}

/**
 * 修改通知状态
 * @param {Array} ids  
 * @param {int} status 状态 
 */
async function eidtMessage(ids, status) {
    let result = await model.Message.update({
        status
    }, {
        where: {
            id: {
                [Op.or]: ids
            }
        }
    })

    if (!result || result <= 0) {
        return false
    }

    return true
}

/**
 * 标记为全部已读
 * @param  {[type]} masterID [description]
 * @return {[type]}          [description]
 */
async function allMessageRead(masterID) {
    let result = await model.Message.update({
        status: 1
    }, {
        where: {
            masterID,
            status: 0
        }
    })

    if (!result || result < 0) {
        return false
    }

    return true
}

/**
 * 查询通知
 * @param {string} masterID 
 * @param {int} page 
 * @param {int} limit 
 */
async function searchMessage(masterID, page, limit, keys = '') {
    let result = await model.Message.findAndCountAll({
        where: {
            masterID,
            [Op.or]: {
                content: {
                    [Op.like]: keys
                }
            }
        },
        order: [
            ['date', 'DESC']
        ],
        limit: limit,
        offset: limit * (page - 1),
        raw: true
    })

    if (!result) {
        return false
    }

    result.rows.map(item => {
        item.date = formatDate(item.date)
    })

    return result
}

/**
 * 搜索masterID的未读消息的数量
 * @param {string} masterID 
 */
async function findNotReadMessageCount(masterID) {
    let result = await model.Message.count({
        where: {
            masterID,
            status: 0 //0代表未读
        }
    })

    if (!result) {
        return false
    }

    return result
}

/**
 * 通知消息
 * @param  {[type]} account [description]
 * @return {[type]}         [description]
 */
async function messageTo(account) {
    let socket = redis.get(account)
    if(socket != null) {
        let count = await findNotReadMessageCount(account) || 0
        socket.emit('newMsg', {
            count
        })
    }
}

exports.createMessage = createMessage
exports.deleteMessage = deleteMessage
exports.eidtMessage = eidtMessage
exports.allMessageRead = allMessageRead
exports.searchMessage = searchMessage
exports.findNotReadMessageCount = findNotReadMessageCount
exports.messageTo = messageTo