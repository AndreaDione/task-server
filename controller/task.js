/*
 * @Author: Andrea 
 * @Date: 2019-12-18 20:10:14 
 * @Last Modified by: Andrea Dione
 * @Last Modified time: 2019-12-23 17:05:47
 * @desc task 业务逻辑
 */
const model = require('../database/models')

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
    let task = await model.Task.destroy({
        where: {
            id
        }
    })
    console.log(task, 'delete')

    if (!task) {
        return false
    }

    return true
}

/**
 * 查询任务
 * @param {Array} keys 关键字数组
 * @param {int} page 页码
 * @param {int} limit 条目
 * 
 * order :根据时间倒序排序
 * limit :返回的条目
 * offset:跳过n条（从第n+1条开始）
 */
async function searchTasks(keys, page, limit) {
    let list = await model.Task.findAll({
        where: {
            '$or': [
                {name: keys},
                {publisher: keys},
                {money: keys}
            ]
        },
        order: [
            'lastModify', 'DESC'
        ],
        limit: limit,
        offset: limit * (page - 1)
    })
}

/**
 * 查询我的任务列表 -- 连表查询
 * @param {Array} keys 
 * @param {int} page 
 * @param {int} limit 
 * @param {string} type publish(default) or receive 
 */
async function searchMyTasks(keys, page, limit, type='publish') {
    if('receive' === type) {
        //我接收的任务列表
    }else {
        //我发布的任务列表
    }
}

exports.createTask = createTask
exports.updateTask = updateTask
exports.deleteTask = deleteTask
exports.searchTasks = searchTasks