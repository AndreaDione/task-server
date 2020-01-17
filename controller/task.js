/*
 * @Author: Andrea 
 * @Date: 2019-12-18 20:10:14 
 * @Last Modified by: Andrea
 * @Last Modified time: 2020-01-02 19:58:49
 * @desc task 业务逻辑
 */
const model = require('../database/index.js')
const Sequelize = require('sequelize')
const formatDate = require('../utlis/time')
const { Op } = Sequelize

/**
 * 定义关系模型
 */
// model.Task.hasMany(model.MyReceiveTasks, { as: 'rece', foreignKey: 'taskID' })

/**
 * 新增任务
 * @param {object} option task's attributes
 * 
 * @return {object}/{boolean} success return object, not return false(boolean)
 */
async function createTask(option) {
    let task = await model.Task.create(option)

    if (!task) {
        return false
    }

    return task
}

/**
 * 更新任务
 * @param {int} id 
 * @param {object} option 
 * 
 * @return {object}/{boolean} success return object, not return false(boolean)
 */
async function updateTask(id, publisherID, option) {
    let task = await model.Task.update(option, {
        where: {
            id,
            publisherID
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
async function deleteTask(id, publisherID) {
    //result表示受影响的行数，0表示不受影响
    let result = await model.Task.destroy({
            where: {
                id,
                publisherID
            }
        })
        // console.log(result, 'delete')

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
 * @param {Object} others 其他搜索条件
 * 
 * order :根据时间倒序排序
 * limit :返回的条目
 * offset:跳过n条（从第n+1条开始）
 */
async function searchTasks(keys, page, limit, others = null) {
    let option = {
            attributes: {
                exclude: ['content']
            },
            where: {
                [Op.or]: {
                    title: {
                        [Op.like]: keys
                    },
                    publisherName: {
                        [Op.like]: keys
                    },
                    money: {
                        [Op.like]: keys
                    },
                    address: {
                        [Op.like]: keys
                    }
                }
            },
            order: [
                ['lastModify', 'DESC']
            ],
            limit: limit,
            offset: limit * (page - 1)
        }
        //添加任务状态
    if (others.status) {
        option.where.status = others.status
    }
    //判断查询方式
    let account = '',
        type = '',
        result = null
    if (others.type) {
        type = others.type
        account = others.account
    }

    if (type == 'receive') {
        //搜索我接受的任务
        option.include = { // include关键字表示关联查询
            model: model.MyReceiveTasks, // 指定关联的model
            as: 'rece',
            where: {
                receiverID: account
            }
        }
        option.raw = true
    } else if (type == 'publish') {
        //搜索我发布的任务
        //建立表关联关系  当前表（User）的字段： user_name  关联表（userRoom）的字段user_id
        // model.Task.hasMany(model.MyReceiveTasks, {foreignKey:'id',targetKey:'taskID'})
        option.where.publisherID = account
        option.raw = true
    }

    result = await model.Task.findAndCountAll(option)

    if (!result) {
        return false
    }
    result.rows.map(item => {
        item.lastModify = formatDate(item.lastModify)
        if (item.labels) {
            item.labels = item.labels.split("-")
        } else {
            item.labels = []
        }

        if(item['rece.date']) {
            item['rece.date'] = formatDate(item['rece.date'])
        }
    })

    return result
}

/**
 * 搜索详细任务
 * @param  {int} id 任务id
 * @return {Object}    [description]
 */
async function searchTaskDetails(id, publisherID) {
    let task = await model.Task.findOne({
        where: {
            id
        }
    })

    if (!task) {
        return false
    }

    task.lastModify = formatDate(task.lastModify)
    if (task.labels === null) {
        task.labels = []
    } else {
        task.labels = task.labels.split("-")
    }

    return task
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

/**
 * 查询用户是否在任务中
 * @param  {int}  taskID     [description]
 * @param  {string}  receiverID [description]
 * @return {Boolean}            [description]
 */
async function isUserInTask(taskID, receiverID) {
    let result = await model.MyReceiveTasks.findOne({
        where: {
            taskID,
            receiverID
        }
    })
    if (!result) {
        return false
    }

    return true
}

exports.createTask = createTask
exports.updateTask = updateTask
exports.deleteTask = deleteTask
exports.searchTasks = searchTasks
exports.searchTaskDetails = searchTaskDetails
exports.joinTask = joinTask
exports.leaveTask = leaveTask
exports.isUserInTask = isUserInTask