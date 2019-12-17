/*
 * @Author: Andrea 
 * @Date: 2019-12-16 16:52:43 
 * @Last Modified by: Andrea
 * @Last Modified time: 2019-12-17 16:33:23
 * @desc token 
 */
const jwt = require('jsonwebtoken')
const salt = 'andrea' //盐值

/**
 * 生成token
 * @param {String}} account 
 */
function encodeToken(account) {
    const token = jwt.sign({
        account
    }, salt, {
        expiresIn: 60 * 60
    })

    return token
}

/**
 * token解析
 * @param {String} token 
 */
function decodeToken(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, salt, (err, res) => {
            if (err) {
                err.message = 'token 无效'
                reject(err)
            } else {
                //返回解析出的对象
                resolve(res)
            }
        })
    })
}

exports.encodeToken = encodeToken
exports.decodeToken = decodeToken