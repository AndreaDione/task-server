/*
 * @Author: Andrea 
 * @Date: 2019-12-18 19:37:26 
 * @Last Modified by: Andrea
 * @Last Modified time: 2019-12-18 19:50:35
 * @desc 时间格式化
 */

function formatDate(time, format = 'YY-MM-DD hh:mm:ss') {
    //从安全的角度出发，这里要重新根据time新建一个date对象
    //new Date的参数可以是date，或者是时间戳
    let date = new Date(time)
    let year = date.getFullYear(),
        month = date.getMonth() + 1,
        day = date.getDate(),
        hour = date.getHours(),
        min = date.getMinutes(),
        sec = date.getSeconds()

    //生成一个0-9的数组
    let preArr = Array.apply(null, Array(10)).map((elem, index) => {
        return '0' + index
    })

    let formatedDate = format.replace(/YY/g, year)
        .replace(/MM/g, preArr[month] || month)
        .replace(/DD/g, preArr[day] || day)
        .replace(/hh/g, preArr[hour] || hour)
        .replace(/mm/g, preArr[min] || min)
        .replace(/ss/g, preArr[sec] || sec)
    return formatedDate
}

module.exports = formatDate