/*
 * @Author: Andrea 
 * @Date: 2019-12-26 15:56:21 
 * @Last Modified by: Andrea
 * @Last Modified time: 2019-12-26 16:14:17
 * 标签
 * 
 * 这里有逻辑问题，先不实现
 */

const model = require('../database/models')
const Sequelize = require('sequelize')
const { Op } = Sequelize

/**
 * 添加标签
 * @param {string} name 
 */
async function createLabel(name) {
    let label = await model.Label.create({
        name
    })

    if (!label) {
        return false
    }

    return label
}

/**
 * 修改标签
 * @param {int} id 
 * @param {string} name 
 */
async function editLabel(id, name) {
    let label = await model.Label.update({
        name
    }, {
        where: {
            id
        }
    })

    if (!label) {
        return false
    }

    return label
}

/**
 * 删除标签
 * @param {int} id 
 */
async function deleteLabel(id) {
    let result = await model.Label.destroy({
        where: {
            id
        }
    })

    if (!result || result <= 0) {
        return false
    }

    return true
}

exports.createLabel = createLabel
exports.editLabel = editLabel
exports.deleteLabel = deleteLabel