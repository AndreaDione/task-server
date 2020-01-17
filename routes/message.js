/*
 * @Author: Andrea 
 * @Date: 2020-01-15 14:40:05 
 * @Last Modified by: Andrea
 * @Last Modified time: 2020-01-15 15:32:17
 */

var express = require('express')
var router = express.Router()
const formatDate = require('../utlis/time')
const Message = require('../controller/message')
const Token = require('../utlis/token')

/**
 * API 要求
 * 
 * （1）通知删改
 * （2）分页查询
 */

/**
 * 查询
 */
router.get('/search', async(req, res, next) => {
    let { page, limit, keys } = req.query
    page = Number(page) || 1
    limit = Number(limit) || 10

    try {
        let token = req.headers.authorization
        let { account } = await Token.decodeToken(token)
        if (typeof keys !== 'string' && !(keys instanceof String)) {
            throw new Error('keys error!')
        }

        //处理关键词，这里以后需要修改
        keys = `%${keys.trim()}%`

        let message = await Message.searchMessage(account, page, limit, keys)

        if (!message) {
            return res.json({
                message: '消息查询失败',
                success: false
            })
        }

        res.json({
            message: '消息查询成功',
            success: true,
            list: message.rows,
            count: message.count
        })
    } catch (error) {
        next(error)
    }
})

/**
 * 新增消息
 */
router.post('/', async(req, res, next) => {
    let { option } = req.body
    let token = req.headers.authorization
    let { account } = await Token.decodeToken(token)
    option.emitter = account //消息发布者
    option.date = formatDate(new Date().getTime())

    let message = await Message.createMessage(option)

    if (!message) {
        return res.json({
            message: '新增消息失败',
            success: false
        })
    }

    res.json({
        message: '新增消息成功',
        success: true
    })
})

/**
 * 修改
 */
router.put('/', async(req, res, next) => {
    let { ids, status } = req.body
    try {
        let token = req.headers.authorization
            //这里要等待token是否正确
        let {account} = await Token.decodeToken(token)
        console.log(account)

        let result = await Message.eidtMessage(ids, status)

        if (!result) {
            return res.json({
                message: '修改消息状态失败',
                success: false
            })
        }

        res.json({
            message: '修改消息专状态成功',
            success: true
        })
    } catch (error) {
        next(error)
    }
})

/**
 * 标记为全部已读
 * @param  {[type]} '/allRead' [description]
 * @param  {[type]} async(req, res,          next [description]
 * @return {[type]}            [description]
 */
router.put('/allRead', async(req, res, next) => {
    try {
        let token = req.headers.authorization
            //这里要等待token是否正确
        let {account} = await Token.decodeToken(token)

        let result = await Message.allMessageRead(account)

        if (!result) {
            return res.json({
                message: '修改消息状态失败',
                success: false
            })
        }

        res.json({
            message: '修改消息状态成功',
            success: true
        })
    } catch (error) {
        next(error)
    }
})

/**
 * 删除
 */
router.delete('/', async(req, res, next) => {
    let { ids } = req.body
    try {
        let token = req.headers.authorization
            //这里要等待token是否正确
        await Token.decodeToken(token)

        let result = await Message.deleteMessage(ids)

        if (!result) {
            return res.json({
                message: '删除消息失败',
                success: false
            })
        }

        res.json({
            message: '删除消息成功',
            success: true
        })
    } catch (error) {
        next(error)
    }
})

router.get('/notRead', async(req, res, next) => {
    let token = req.headers.authorization
    let { account } = await Token.decodeToken(token)

    try {
        let result = await Message.findNotReadMessageCount(account)

        if (!result || typeof result !== 'number') {
            return res.json({
                message: '获取未读消息数量失败',
                success: false
            })
        }

        res.json({
            message: '获取未读消息数量成功',
            success: true,
            result
        })
    } catch (error) {
        next(error)
    }
})

module.exports = router