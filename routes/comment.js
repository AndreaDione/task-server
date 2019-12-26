/*
 * @Author: Andrea 
 * @Date: 2019-12-26 16:26:29 
 * @Last Modified by: Andrea
 * @Last Modified time: 2019-12-26 17:08:03
 */

const express = require('express')
const router = express.Router()
const formatDate = require('../utlis/time')
const Comment = require('../controller/comment')

/**
 * API要求
 * 
 * (1)添加/删除评论
 * (2)添加/删除追评
 */

/**
 * 添加评论
 */
router.post('/', async(req, res, next) => {
    let {
        score,
        content,
        commentatorID,
        masterID
    } = req.body

    score = score || 5
    content = content || '该用户很懒，没有具体评价'
    let commentDate = formatDate(new Date())
    let reply = '',
        replyDate = formatDate(new Date()) // 追评， 默认没有

    try {
        let comment = await Comment.createComment({
            score,
            content,
            commentDate,
            commentatorID,
            masterID,
            reply,
            replyDate
        })

        if (!comment) {
            return res.json({
                message: '添加评论失败',
                success: false
            })
        }

        res.json({
            message: '添加评论成功',
            success: true
        })
    } catch (error) {
        next(error)
    }
})

/**
 * 删除评论
 */
router.delete('/', async(req, res, next) => {
    let { id } = req.body
    try {
        let result = await Comment.deleteComment(id)

        if (!result) {
            return res.json({
                message: '删除评论失败',
                success: false
            })
        }

        res.json({
            message: '删除评论成功',
            success: true
        })
    } catch (error) {
        next(error)
    }
})

/**
 * 编辑追评
 */
router.put('/', async(req, res, next) => {
    let { id, reply } = req.body
    let replyDate = formatDate(new Date())
    try {
        let result = await Comment.editReply(id, reply, replyDate)
        if (!result) {
            return res.json({
                message: '编辑追评失败',
                success: false
            })
        }

        res.json({
            message: '编辑追评成功',
            success: true
        })
    } catch (error) {
        next(error)
    }
})

/**
 * 搜索评论
 */
router.post('/search', async(req, res, next) => {
    let { masterID, page, limit } = req.body

    page = page || 1
    limit = limit || 10

    try {
        let list = await Comment.searchComment(masterID, page, limit)
        if (!list) {
            return res.json({
                message: '评论查询失败',
                success: false
            })
        }

        res.json({
            message: '评论查询成功',
            success: true,
            list
        })
    } catch (error) {
        next(error)
    }
})

module.exports = router