/*
 * @Author: Andrea 
 * @Date: 2019-12-26 16:17:23 
 * @Last Modified by: Andrea
 * @Last Modified time: 2019-12-26 17:09:47
 * @desc comment
 */

const model = require('../database/models')
const Sequelize = require('sequelize')
const { Op } = Sequelize

/**
 * 新增评论
 * @param {object} option task's attributes
 * 
 * @return {object}/{boolean} success return object, not return false(boolean)
 */
async function createComment(option) {
    let comment = await model.Comment.create(option)

    if (!comment) {
        return false
    }

    return comment
}


/**
 * 删除评论
 * @param {int} id
 * 
 * @returns {boolean} success is true, fail is false 
 */
async function deleteComment(id) {
    //result表示受影响的行数，0表示不受影响
    let result = await model.Comment.destroy({
        where: {
            id
        }
    })

    if (!result || result <= 0) {
        return false
    }

    return true
}

/**
 * 添加/删除追评
 * @param {int}} id 
 * @param {string} reply 追评 
 */
async function editReply(id, reply, replyDate) {
    let comment = await model.Comment.update({
        reply,
        replyDate
    }, {
        where: {
            id
        }
    })

    if (!comment) {
        return false
    }

    return comment
}

/**
 * 查询评论
 * @param {string} masterID 
 * @param {int} page 
 * @param {int} limit 
 */
async function searchComment(masterID, page, limit) {
    let list = await model.Comment.findAll({
        where: {
            masterID
        },
        order: [
            ['commentDate', 'DESC']
        ],
        limit: limit,
        offset: limit * (page - 1)
    })

    if (!list) {
        return false
    }

    return list
}


exports.createComment = createComment
exports.deleteComment = deleteComment
exports.editReply = editReply
exports.searchComment = searchComment