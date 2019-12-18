/*
 * @Author: Andrea 
 * @Date: 2019-12-18 16:17:48 
 * @Last Modified by: Andrea
 * @Last Modified time: 2019-12-18 19:56:05
 * @desc 任务API
 */

var express = require('express');
var router = express.Router();
const formatDate = require('../utlis/time')

/**
 * API要求
 * 
 * (1)根据条件获取任务列表(分页，状态，标签，标题)
 * (2)新增任务，修改任务内容
 * (3)修改任务状态（任务ID，新状态发布，下架，删除）
 */

/**
 * 新增任务
 */
router.post('/edit', async(req, res, next) => {
    let {
        publisher,
        phone,
        title,
        content,
        status,
        address,
        money
    } = req.body
        /**
         * 这里要做一些逻辑处理
         */
        //更新时间
    let lastModify = formatDate(new Date().getTime())
    let task = await Task.create({
        publisher,
        phone,
        title,
        content,
        status,
        address,
        money,
        lastModify
    })
    if (!task) {
        return res.json({
            message: '新增任务失败',
            success: false
        })
    }

    let resMsg = 1 == status ? '任务发布成功' : '任务添加成功'
    res.json({
        message: resMsg,
        success: true
    })
})

/**
 * 修改任务内容
 */
router.put('/edit', async(req, res, next) => {

})

/**
 * 修改任务状态
 */
router.put('/status', async(req, res, next) => {

})


module.exports = router;