'use strict';
module.exports = (sequelize, DataTypes) => {
    const MyReceiveTasks = sequelize.define('MyReceiveTasks', {
        taskID: DataTypes.INTEGER,
        receiverID: DataTypes.STRING,
        date: DataTypes.DATE
    }, {
        timestamps: false
    });
    MyReceiveTasks.associate = function(models) {
        // associations can be defined here
    };
    return MyReceiveTasks;
};