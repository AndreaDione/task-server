/*
 * @Author: Andrea 
 * @Date: 2019-12-18 16:17:48 
 * @Last Modified by: Andrea
 * @Last Modified time: 2020-01-02 20:00:40
 * @desc 任务API
 */

var express = require('express');
var router = express.Router();
const formatDate = require('../utlis/time')
const Task = require('../controller/task')
const User = require('../controller/user')
const Token = require('../utlis/token')

/**
 * API要求
 * 
 * (1)根据条件获取任务列表(分页，状态，标签，标题)
 * (2)新增任务，修改任务内容
 * (3)修改任务状态（任务ID，新状态发布--1，下架--0，删除）
 */

/**
 * 查询任务
 */
router.post('/search', async(req, res, next) => {
    let { limit, page, keys } = req.body
        // let { limit, page, keys, account } = req.body
    let others = {}
    limit = limit || 8
    page = page || 1
    if (req.body.type) {
        //判断查询类型
        let token = req.headers.authorization
        let { account } = await Token.decodeToken(token)
        others.type = req.body.type
        others.account = account
    }
    if (req.body.status) {
        others.status = req.body.status
    }
    try {
        // console.log(typeof keys)
        if (typeof keys !== 'string' && !(keys instanceof String)) {
            throw new Error('keys error!')
        }

        //处理关键词，这里以后需要修改
        keys = `%${keys.trim()}%`

        let result = await Task.searchTasks(keys, page, limit, others)

        if (!result) {
            return res.json({
                message: '任务查询失败',
                success: false
            })
        }

        // res.io.emit('new', {
        //     count: result.count,
        //     desc: '通过websocket的测试'
        // })

        res.json({
            message: '任务列表查询成功',
            success: true,
            list: result.rows,
            count: result.count
        })
    } catch (error) {
        next(error)
    }

})

/**
 * 获取任务明细
 * @param  {[type]} '/details' [description]
 * @param  {[type]} async      (req,         res, next [description]
 * @return {[type]}            [description]
 */
router.get('/details', async(req, res, next) => {
    // let token = req.headers.authorization
    try {
        // let {account} = await Token.decodeToken(token)
        const { id } = req.query

        let task = await Task.searchTaskDetails(id)

        if (!task) {
            return res.json({
                message: '获取任务明细失败',
                success: false
            })
        }

        res.json({
            message: '获取任务明细成功',
            success: true,
            task
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
        //解析token
    let token = req.headers.authorization
    let { account } = await Token.decodeToken(token)
    option.publisherID = account
        //更新时间
    option.lastModify = formatDate(new Date().getTime())
    option.labels = option.labels.join('-')
        // console.log(option)

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
        //检查是否为本人操作
        let token = req.headers.authorization
        let { account } = await Token.decodeToken(token)
        option.lastModify = formatDate(new Date().getTime())
        let task = await Task.updateTask(id, option)
        if (!task || task <= 0) {
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
        let token = req.headers.authorization
        let { account } = await Token.decodeToken(token)
        let task = await Task.deleteTask(id, account)
        if (!task || task <= 0) {
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

/**
 * 加入任务
 */
router.post('/receive', async(req, res, next) => {
    let { taskID } = req.body
    let date = formatDate(new Date())

    try {
        let token = req.headers.authorization
        let { account } = await Token.decodeToken(token)

        let result = await Task.joinTask({
            taskID,
            receiverID: account,
            date
        })

        if (!result) {
            return res.json({
                message: '接收任务失败',
                success: false
            })
        }

        //检查任务人数是否上限
        await Task.checkTasksReciversCount(taskID)

        res.json({
            message: '接收任务成功',
            success: true
        })
    } catch (error) {
        next(error)
    }
})

/**
 * 判断用户是否在该任务中
 * 
 * @return {Boolean}        true/false
 */
router.get('/receive', async(req, res, next) => {
    let { taskID } = req.query
    try {
        let token = req.headers.authorization
        let { account } = await Token.decodeToken(token)
        let result = await Task.isUserInTask(taskID, account)
        res.json({
            result
        })
    } catch (error) {
        next(error)
    }
})

/**
 * 退出任务
 */
router.delete('/receive', async(req, res, next) => {
    let { taskID } = req.body
    try {
        let token = req.headers.authorization
        let { account } = await Token.decodeToken(token)
        let result = null //结果
        if(req.body.receiverID) {
            //如果有这个参数，那就是踢出任务
            let receiverID = req.body.receiverID
            result = await Task.leaveTask(taskID, receiverID)
        }else {
            result = await Task.leaveTask(taskID, account)
        }

        if (!result) {
            return res.json({
                message: '退出任务失败',
                success: false
            })
        }

        //检查任务人数是否上限
        await Task.checkTasksReciversCount(taskID)

        res.json({
            message: '退出任务成功',
            success: true
        })
    } catch (error) {
        next(error)
    }
})

/**
 * 获取任务参与人员列表
 * @param  {[type]} '/recivers' [description]
 * @param  {[type]} async(req,  res,          next [description]
 * @return {[type]}             [description]
 */
router.get('/recivers', async(req, res, next) => {
    try {
        let {taskID} = req.query
        let arr = await Task.getReciversID(taskID)
        console.log(arr, '测试用')
        if(!(arr instanceof Array)) {
            return res.json({
                message: '获取任务参与人员ID集合失败',
                success: false
            })
        }else if(arr instanceof Array && arr.length === 0) {
            return res.json({
                message: '无参与人员',
                success: true,
                list: [],
                count: 0
            })
        }
        //确保拿到的是数组
        let result = await User.getUserList(arr)
        if(!result) {
            return res.json({
                message: '获取参与人员列表失败',
                success: false
            })
        }

        res.json({
            message: '获取参与人员列表成功',
            success: true,
            list: result.rows,
            count: result.count
        })
    }catch(err) {
        next(err)
    }
})

//这个是测试用的
router.get('/count', async(req, res, next) => {
    try{
        let {taskID} = req.query
        let result = await Task.checkTasksReciversCount(taskID)
        res.json({
            result
        })
    }catch(err) {
        next(err)
    }
})

/**
 * 踢出任务
 */
router.delete('/getout', async(req, res, next) => {

})


module.exports = router;