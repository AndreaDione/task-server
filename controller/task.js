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
const { getLabelNameById } = require('./label')
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

    for(let item of result.rows) {
        item.lastModify = formatDate(item.lastModify)

        if(item.labels) {
            const ids = item.labels.split('-').map(id => parseInt(id))
            item.labels = await getLabelNameById(ids)
        }

        if(item['rece.date']) {
            item['rece.date'] = formatDate(item['rece.date'])
        }
    }
    // result.rows.map(async item => {
    //     item.lastModify = formatDate(item.lastModify)
    //     // if (item.labels) {
    //     //     item.labels = item.labels.split("-")
    //     // } else {
    //     //     item.labels = []
    //     // }
    //     if(item.labels) {
    //         const ids = item.labels.split('-').map(id => parseInt(id))
    //         item.labels = await getLabelNameById(ids)
    //     }

    //     if(item['rece.date']) {
    //         item['rece.date'] = formatDate(item['rece.date'])
    //     }
    // })

    return result
}

/**
 * 获取任务详情
 * @param  {[type]} id     [description]
 * @param  {array} attr 获取的属性
 * @return {[type]}        [description]
 */
async function searchTaskDetails(id, attr = null) {
    let option = {
        where: {
            id
        },
        raw: true
    }
    if(attr !== null && attr instanceof Array) {
        //根据attr获取
        option.attributes = attr
    }

    let task = await model.Task.findOne(option)

    if (!task) {
        return false
    }

    if(task.lastModify) {
        task.lastModify = formatDate(task.lastModify)
        if(task.labels) {
            const ids = task.labels.split('-').map(id => parseInt(id))
            task.labels = await getLabelNameById(ids)
        }
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

/**
 * 判断任务是否满员--更新状态
 * @param  {[type]} taskID      [description]
 * @return {[type]}             [description]
 */
async function checkTasksReciversCount(taskID) {
    let count = await getTaskReciverCount(taskID)

    let {status, number} = await searchTaskDetails(taskID, ['number'])

    if(count == number) {
        //要修改task的状态
        await updateTask(taskID, {
            status: 3
        })
    }else if(count < number && status!==1) {
        await updateTask(taskID, {
            status: 1
        })
    }
}

/**
 * 获取接接收任务的人数
 * @param  {[type]} taskID [description]
 * @return {[type]}        [description]
 */
async function getTaskReciverCount(taskID) {
    let count = await model.MyReceiveTasks.count({
        where: {
            taskID
        }
    })

    return count
}

/**
 * 获取任务参与者的ID集合
 * @param  {[type]} taskID [description]
 * @return {[type]}        [description]
 */
async function getReciversID(taskID) {
    let arr = await model.MyReceiveTasks.findAll({
        attributes: ['receiverID'],
        where: {
            taskID
        },
        raw: true
    })

    if(!arr || arr.length == 0){
        return []
    }

    arr = arr.map(item => item.receiverID)

    return arr
}

exports.createTask = createTask
exports.updateTask = updateTask
exports.deleteTask = deleteTask
exports.searchTasks = searchTasks
exports.searchTaskDetails = searchTaskDetails
exports.joinTask = joinTask
exports.leaveTask = leaveTask
exports.isUserInTask = isUserInTask
exports.checkTasksReciversCount = checkTasksReciversCount
exports.getReciversID = getReciversID