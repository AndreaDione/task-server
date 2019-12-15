/*
 * @Author: Andrea 
 * @Date: 2019-12-15 23:02:27 
 * @Last Modified by: Andrea
 * @Last Modified time: 2019-12-15 23:16:31
 * @desc 加密处理
 */


const bcrypt = require('bcrypt')
const saltRounds = 10

/**
 * 生成加密密码
 * @param {string} pass
 */
function getHashPass(pass) {
    return new Promise((resolve, reject) => {
        bcrypt.hash(pass, saltRounds, (err, res) => {
            if (err) {
                //抛出异常
                reject(err)
            } else {
                //返回这个加密的密码
                resolve(res)
            }
        })
    })
}

/**
 * 密码比对
 * @param {string} password 用户输入的密码
 * @param {string} hashPass 加密的密码 
 */
function compare(password, hashPass) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, hashPass, (err, res) => {
            if (err) {
                //抛出异常
                reject(err)
            } else {
                //返回比对结果
                //匹配--true
                //不匹配--false
                resolve(res)
            }
        })
    })
}

exports.getHashPass = getHashPass
exports.compare = compare