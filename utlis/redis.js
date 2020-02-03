// var redis = require('redis')
// const redisClient = redis.createClient({
//     host: '127.0.0.1',
//     port: '6379'
// })

// redisClient.on('error', err => {
//     console.log('redis error!', err)
// })

// redis.set = function(key, value) {
//     return redisClient.hset(key,'socket', value, err=> {
//         console.log('redis input error', err)
//     })
// }

// redis.get = async (key) => {
//     var doc = await new Promise((resolve, reject) => {
//         redisClient.hget(key, 'socket', (err, res)=> {
//             if(err) {
//                 return reject(err)
//             }
//             return resolve(res)
//         })
//     })
//     return doc
// }

let cache = {}
let redis = {}

redis.get = (key) => {
    return cache[key] || null
}


redis.set = (key, value) => {
    cache[key] = value
}

module.exports = redis