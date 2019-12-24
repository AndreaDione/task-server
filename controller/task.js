/*
 * @Author: Andrea 
 * @Date: 2019-12-18 20:10:14 
 * @Last Modified by: Andrea
 * @Last Modified time: 2019-12-24 21:12:01
 * @desc task 业务逻辑
 */
const model = require('../database/models')
const Sequelize = require('sequelize')
const { Op } = Sequelize

/**
 * 新增任务
 * @param {object} option task's attributes
 * 
 * @return {object}/{boolean} success return object, not return false(boolean)
 */
async function createTask(option) {
    let task = await model.Task.create(option)

    if (task) {
        return task
    }

    return false
}

/**
 * 更新任务
 * @param {int} id 
 * @param {object} option 
 * 
 * @return {object}/{boolean} success return object, not return false(boolean)
 */
async function updateTask(id, option) {
    let task = await model.Task.update(option, {
        where: {
            id
        }
    })

    if (!task) {
        return false
    }

    return task
}

/**
 * 删除任务
 * @param {int} id
 * 
 * @returns {boolean} success is true, fail is false 
 */
async function deleteTask(id) {
    //result表示受影响的行数，0表示不受影响
    let result = await model.Task.destroy({
        where: {
            id
        }
    })
    console.log(result, 'delete')

    if (!result || result <= 0) {
        return false
    }

    return true
}

/**
 * 查询任务
 * @param {string} keys 关键词
 * @param {int} page 页码
 * @param {int} limit 条目,找不到就返回[]
 * 
 * order :根据时间倒序排序
 * limit :返回的条目
 * offset:跳过n条（从第n+1条开始）
 */
async function searchTasks(keys, page, limit) {
    let list = await model.Task.findAll({
        where: {
            [Op.or]: {
                title: {
                    [Op.like]: keys
                },
                publisher: {
                    [Op.like]: keys
                },
                money: {
                    [Op.like]: keys
                }
            }
        },
        order: [
            ['lastModify', 'DESC']
        ],
        limit: limit,
        offset: limit * (page - 1)
    })

    return list
}

/**
 * 查询我的任务列表 -- 连表查询
 * @param {Array} keys 
 * @param {int} page 
 * @param {int} limit 
 * @param {string} type publish(default) or receive 
 */
async function searchMyTasks(keys, page, limit, type = 'publish') {
    if ('receive' === type) {
        //我接收的任务列表
    } else {
        //我发布的任务列表
    }
}


/**
 * 加入任务
 * @param {object} option join in task's option: taskID, receiverID and joining time
 */
async function joinTask(option) {
    let myTask = await model.MyReceiveTasks.create(option)
    if (!myTask) {
        return false
    }

    return myTask
}

/**
 * 退出任务
 * @param {int} taskID 
 * @param {string} receiverID 
 */
async function leaveTask(taskID, receiverID) {
    //result表示受影响的行数，0为不受影响
    let result = await model.MyReceiveTasks.destroy({
        where: {
            taskID,
            receiverID
        }
    })

    console.log(result, 'leave')
    if (!result || result <= 0) {
        return false
    }

    return true
}

exports.createTask = createTask
exports.updateTask = updateTask
exports.deleteTask = deleteTask
exports.searchTasks = searchTasks
exports.joinTask = joinTask
exports.leaveTask = leaveTask