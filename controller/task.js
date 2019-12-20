/*
 * @Author: Andrea 
 * @Date: 2019-12-18 20:10:14 
 * @Last Modified by: Andrea
 * @Last Modified time: 2019-12-20 16:34:53
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
 */
async function search(keys, page, limit) {

}

exports.createTask = createTask
exports.updateTask = updateTask
exports.deleteTask = deleteTask