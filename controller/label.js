/*
 * @Author: Andrea 
 * @Date: 2019-12-26 15:56:21 
 * @Last Modified by: Andrea
 * @Last Modified time: 2020-02-18 15:53:08
 * 标签
 * 
 * 这里有逻辑问题，先不实现
 */

const model = require('../database/models')
const Sequelize = require('sequelize')
const { Op } = Sequelize

/**
 * 获取标签列表
 */
async function getLabels() {
    const list = await model.Label.findAll()

    if (!list) {
        return false
    }

    return list
}

/**
 * 根据id获取标签名
 * @param  {Array} ids id集合
 * @return {Array}     name集合
 */
async function getLabelNameById(ids = []) {
    if (!(ids instanceof Array)) {
        return []
    }else if(ids.length === 0) {
        return []
    }else {
        const result = await model.Label.findAll({
            attributes: ['name'],
            where: {
                [Op.or]: {
                    id: ids
                }
            }
        })

        if(!result) {
            //查找失败
            return false
        }

        const list = result.map(item => item.name).join('-')

        return list
    }
}

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

exports.getLabels = getLabels
exports.createLabel = createLabel
exports.editLabel = editLabel
exports.deleteLabel = deleteLabel
exports.getLabelNameById = getLabelNameById