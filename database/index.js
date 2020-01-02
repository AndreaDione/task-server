/*
 * @Author: Andrea 
 * @Date: 2020-01-02 19:59:43 
 * @Last Modified by:   Andrea 
 * @Last Modified time: 2020-01-02 19:59:43 
 */
/**
 * 关系模型
 */
const model = require('./models')
const { Task, MyReceiveTasks } = model


Task.hasMany(MyReceiveTasks, { as: 'rece', foreignKey: 'taskID', target: 'id' })

module.exports = model