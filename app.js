/*
 * @Author: Andrea 
 * @Date: 2019-12-15 20:29:00 
 * @Last Modified by: Andrea
 * @Last Modified time: 2019-12-16 14:43:50
 */


var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var usersRouter = require('./routes/user');

var app = express();

// view engine setup

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    res.status = 404
    next(new Error('not found'));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status = err.status || 500
    res.json({
        res
    });
});

module.exports = app;