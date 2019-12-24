'use strict';
module.exports = (sequelize, DataTypes) => {
    const MyReceiveTasks = sequelize.define('MyReceiveTasks', {
        taskID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false
        },
        receiverID: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false
        },
        date: DataTypes.DATE
    }, {
        timestamps: false
    });
    MyReceiveTasks.associate = function(models) {
        // associations can be defined here
    };
    return MyReceiveTasks;
};