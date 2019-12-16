var express = require('express');
var router = express.Router();

const User = require('../controller/user');
const Bcrypt = require('../utlis/bcrypt');

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
                message: '该用户账号已存在'
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

        //这里将要生成token
        // let token = getToken(account)

        res.json({
            message: '登录成功',
            success: true
        })
    } catch (error) {
        next(error)
    }
    // let { account, password } = req.body
    // let user = null

    // try {
    //     user = await model.User.findOne({
    //         where: {
    //             account
    //         }
    //     })
    // } catch (error) {
    //     next(error)
    // }

    // // console.log(user)

    // if (!user) {
    //     res.json({
    //         message: '该用户不存在，请进行注册',
    //         success: false
    //     })

    //     return
    // }

    // //用户存在的情况下匹配密码
    // if (password === user.password) {
    //     //生成token，存入redis
    //     res.json({
    //         message: '登录成功',
    //         success: true,
    //         token: '12321'
    //     })
    // } else {
    //     res.json({
    //         message: '密码错误',
    //         success: false
    //     })
    // }

})

/**
 * 获取User列表
 */
router.get('/list', async(req, res, next) => {
    // let list = await model.User.findAll()
    // try {
    //     res.json({
    //         message: '列表返回',
    //         list
    //     })
    // } catch (error) {
    //     next(error)
    // }
})

module.exports = router;