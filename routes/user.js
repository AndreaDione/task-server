var express = require('express');
var router = express.Router();

const User = require('../controller/user');
const Bcrypt = require('../utlis/bcrypt');
const Token = require('../utlis/token');

/**
 * 注册用户
 * 
 * 先查询数据库是否存在该用户号，若存在则返回提示信息
 * 
 * 不存在则进行注册操作
 */
router.post('/register', async(req, res, next) => {
    let { account } = req.body

    try {
        //先判断该用户是否存在
        //hasUser是一个异步函数，它会返回一个promise，因此需要使用then或者await获取你想要的结果
        //hasUser方法结果：如果用户存在，则返回这个用户的对象，如果不存在则返回false（注意，结果是被promise包裹着的）
        let user = await User.hasUser(account)

        if (user) {

            return res.json({
                message: '该用户账号已存在',
                success: false
            })
        }

        let { password, name, phone, email } = req.body

        password = await Bcrypt.getHashPass(password) // 加密处理
        console.log(password, '查看password是否被加密')

        user = User.createUser({
            account,
            password,
            name,
            phone,
            email
        })

        if (user) {
            return res.json({
                message: '用户创建成功',
                success: true
            })
        } else {
            res.json({
                message: '用户创建失败，可能是数据库出现了错误',
                success: false
            })
        }
    } catch (error) {
        error.message = '注册期间遇到了错误'
        next(error)
    }

})

/**
 * 用户登录
 * 
 * 用户通过账号密码验证，登录成功则返回该用户的token
 */
router.post('/login', async(req, res, next) => {
    let { account, password } = req.body
    try {
        let user = await User.hasUser(account)
        if (!user) {
            return res.json({
                message: '用户不存在,请前往注册',
                success: false
            })
        }

        //进行密码配对
        //Bcript.compare会返回一个promise，因此需要使用then或者await获取结果
        //匹配正确则返回true
        //匹配错误则返回false
        let flag = await Bcrypt.compare(password, user.password)
        if (!flag) {
            return res.json({
                message: '账号或者密码错误',
                success: false
            })
        }

        // 这里将要生成token
        let token = Token.encodeToken(account)

        res.json({
            message: '登录成功',
            success: true,
            token,
            user: {
                phone: user.phone,
                email: user.email,
                avatar: user.avatar,
                labels: user.labels,
                account: user.account,
                name: user.name
            }
        })
    } catch (error) {
        error.message = '登录期间遇到了错误'
        next(error)
    }

})

/**
 * 获取user用户信息
 * 
 */
router.post('/personal', async(req, res, next) => {
    let token = req.headers.authorization
    try {
        let { account } = await Token.decodeToken(token)
        let user = await User.hasUser(account)
        if (!user) {
            return res.json({
                message: '该用户不存在',
                success: false
            })
        }
        res.json({
            message: '获取用户成功',
            user
        })
    } catch (error) {
        next(error)
    }
})

/**
 * 修改用户信息
 */
router.put('/personal', async(req, res, next) => {
    let token = req.headers.authorization
    // console.log(token)
    try {
        let { account } = await Token.decodeToken(token)
        let { option } = req.body
        let user = await User.updatePersonMsg(account, option)
            // console.log(user, account, '修改信息')
        if (!user) {
            return res.json({
                message: '修改失败',
                success: false
            })
        }

        res.json({
            message: '修改信息成功',
            success: true
        })
    } catch (error) {
        next(error)
    }
})

/**
 * 修改密码
 */
router.put('/rePassword', async(req, res, next) => {
    let token = req.headers.authorization
    try {
        let { account } = await Token.decodeToken(token)

        //先根据account获取该用户的信息
        let user = await User.hasUser(account)
        if (!user) {
            return res.json({
                message: '用户不存在',
                success: false
            })
        }

        let { password, newPass } = req.body

        //进行密码校验
        let flag = await Bcrypt.compare(password, user.password)
        if (!flag) {
            return res.json({
                message: '密码错误',
                success: false
            })
        }

        //新密码要进行加密处理
        newPass = await Bcrypt.getHashPass(newPass)
        user = await User.updatePersonMsg(account, {
            password: newPass
        })
        if (!user) {
            return res.json({
                message: '修改密码失败',
                success: false
            })
        }

        res.json({
            message: '修改密码成功',
            success: true
        })
    } catch (error) {
        next(error)
    }

})

module.exports = router;