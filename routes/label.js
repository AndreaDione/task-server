/*
 * @Author: Andrea 
 * @Date: 2020-02-18 15:42:45 
 * @Last Modified by: Andrea
 * @Last Modified time: 2020-02-18 16:03:04
 */

const express = require('express')
const router = express.Router()
const Label = require('../controller/label')
const Token = require('../utlis/token')
const { isAdmin } = require('../controller/user')

/**
 * 获取标签
 */
router.get('/', async(req, res, next) => {
    try {
        const list = await Label.getLabels()
        if (!list) {
            res.json({
                message: '获取标签列表失败',
                success: false
            })
        }

        res.json({
            message: '获取标签列表成功',
            success: true,
            list
        })
    } catch (err) {
        next(err)
    }

})

/**
 * 添加标签
 */
router.post('/', async(req, res, next) => {
    const token = req.headers.authorization
    try {
        const { account } = await Token.decodeToken(token)
        if (!isAdmin(account)) {
            res.json({
                message: '权限错误',
                success: false
            })
        }
        const { name } = req.body
        const result = await Label.createLabel(name)
        if (!result) {
            res.json({
                message: '新增标签失败',
                success: false
            })
        }

        res.json({
            message: '新增标签成功',
            success: true,
            result
        })
    } catch (err) {
        next(err)
    }
})

/**
 * 修改标签
 */
router.put('/', async(req, res, next) => {
    const token = req.headers.authorization
    try {
        const { account } = await Token.decodeToken(token)
        if (!isAdmin(account)) {
            res.json({
                message: '权限错误',
                success: false
            })
        }
        const { name, id } = req.body
        const result = await Label.editLabel(id, name)
        if (!result) {
            res.json({
                message: '修改标签失败',
                success: false
            })
        }

        res.json({
            message: '修改标签成功',
            success: true
        })
    } catch (err) {
        next(err)
    }
})

/**
 * 删除标签
 */
router.delete('/', async(req, res, next) => {
    const token = req.headers.authorization
    try {
        const { account } = await Token.decodeToken(token)
        if (!isAdmin(account)) {
            res.json({
                message: '权限错误',
                success: false
            })
        }
        const { id } = req.body
        const result = await Label.deleteLabel(id)
        if (!result) {
            res.json({
                message: '删除标签失败',
                success: false
            })
        }

        res.json({
            message: '删除标签成功',
            success: true
        })
    } catch (err) {
        next(err)
    }
})

module.exports = router