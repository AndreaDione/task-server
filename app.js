/*
 * @Author: Andrea 
 * @Date: 2019-12-15 20:29:00 
 * @Last Modified by: Andrea
 * @Last Modified time: 2019-12-28 12:54:05
 */


var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var usersRouter = require('./routes/user');
var tasksRouter = require('./routes/task');
var commentRouter = require('./routes/comment');

var app = express();

// view engine setup

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// 跨域设置
app.use((req, res, next) => {
    // 在不同的域名下发出的请求也可以携带cookie
    res.header('Access-Control-Allow-Credentials', true)

    // 域名跨域
    res.header('Access-Control-Allow-Origin', '*')

    // 方法跨域
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS')

    // 允许前台获得的除 Cache-Control、Content-Language、Content-Type、Expires、Last-Modified、Pragma 这几张基本响应头之外的响应头
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With')
    if (req.method == 'OPTIONS') {
        res.sendStatus(200)
    } else {
        next()
    }
})

app.use('/user', usersRouter);
app.use('/task', tasksRouter);
app.use('/comment', commentRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    res.status = 404
    next(new Error('not found'));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    // res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status = res.status || err.status || 500
    res.message = err.message || '错误原因不明'
    res.json({
        message: res.message,
        status: res.status
    });
});

module.exports = app;