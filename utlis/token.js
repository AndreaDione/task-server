/*
 * @Author: Andrea 
 * @Date: 2019-12-16 16:52:43 
 * @Last Modified by: Andrea
 * @Last Modified time: 2019-12-16 22:26:19
 * @desc token 
 */
const jwt = require('jsonwebtoken')
const salt = 10 //盐值

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