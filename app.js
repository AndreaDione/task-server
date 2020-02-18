/*
 * @Author: Andrea 
 * @Date: 2019-12-15 20:29:00 
 * @Last Modified by: Andrea
 * @Last Modified time: 2020-02-18 15:46:17
 */


var express = require('express');
var http = require('http');
var ws = require('socket.io');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var usersRouter = require('./routes/user');
var tasksRouter = require('./routes/task');
var commentRouter = require('./routes/comment');
var messageRouter = require('./routes/message');
var labelRouter = require('./routes/label');

var app = express();
// view engine setup

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/upload', express.static(path.join(__dirname, "/static/uploads")))
app.use(cookieParser());

// websocket监听
var server = http.createServer(app)
var io = ws(server)

app.use(function(req, res, next) {
    res.io = io
    next()
})

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

// 监听页面路由
app.use('/user', usersRouter);
app.use('/task', tasksRouter);
app.use('/comment', commentRouter);
app.use('/message', messageRouter);
app.use('/label', labelRouter)

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

// 导出的是http服务器和express服务器
module.exports = {
    server,
    app
};