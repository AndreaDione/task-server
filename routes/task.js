/*
 * @Author: Andrea 
 * @Date: 2019-12-18 16:17:48 
 * @Last Modified by: Andrea Dione
 * @Last Modified time: 2019-12-23 17:05:48
 * @desc 任务API
 */

var express = require('express');
var router = express.Router();
const formatDate = require('../utlis/time')
const Task = require('../controller/task')

/**
 * API要求
 * 
 * (1)根据条件获取任务列表(分页，状态，标签，标题)
 * (2)新增任务，修改任务内容
 * (3)修改任务状态（任务ID，新状态发布，下架，删除）
 */

/**
 * 查询任务
 */
router.post('/search', async(req, res, next) => {
    let {limit, page, keys} = req.body
    limit = limit || 10
    page = page || 1
    try {
        if(typeof keys !== 'string' || !(keys instanceof String)) {
            throw new Error('keys error!')
        }

        keys = keys.split(/\s+/,g)
        keys.map(item => {
            return `%${item}%`
        })
        console.log(keys, 'test')

        let list = await Task.search(keys, page, limit)

        if(!list) {
            return res.json({
                message: '任务查询失败',
                success: false
            })
        }

        res.json({
            message: '任务列表查询成功',
            success: true,
            list
        })
    } catch (error) {
        next(error)
    }

})


/**
 * 新增任务
 */
router.post('/edit', async(req, res, next) => {
    let { option } = req.body
        /**
         * 这里要做一些逻辑处理
         */
        //更新时间
    option.lastModify = formatDate(new Date().getTime())

    console.log(option)

    let task = await Task.createTask(option)
    if (!task) {
        return res.json({
            message: '新增任务失败',
            success: false
        })
    }

    let resMsg = 1 == option.status ? '任务发布成功' : '任务添加成功'
    res.json({
        message: resMsg,
        success: true
    })
})

/**
 * 更新任务
 * 
 * 这里面包括状态
 */
router.put('/edit', async(req, res, next) => {
    let { id, option } = req.body
    try {
        let task = await Task.updateTask(id, option)
            //更新修改时间
        option.lastModify = formatDate(new Date().getTime())
        if (!task) {
            return res.json({
                message: '更新任务失败',
                success: false
            })
        }

        res.json({
            message: '更新任务成功',
            success: true
        })
    } catch (error) {
        next(error)
    }
})

/**
 * 删除任务
 */
router.delete('/edit', async(req, res, next) => {
    let { id } = req.body
    try {
        let task = await Task.deleteTask(id)
        if (!task) {
            return res.json({
                message: '删除失败',
                success: false
            })
        }

        res.json({
            message: '删除成功',
            success: true
        })
    } catch (error) {
        next(error)
    }
})


module.exports = router;