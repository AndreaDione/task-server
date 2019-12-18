'use strict';
module.exports = (sequelize, DataTypes) => {
    const Task = sequelize.define('Task', {
        title: DataTypes.STRING(30),
        content: DataTypes.STRING,
        publisher: DataTypes.STRING(30),
        lastModify: DataTypes.DATE,
        address: DataTypes.STRING,
        money: DataTypes.DOUBLE(10, 2),
        status: DataTypes.INTEGER,
        phone: {
            type: DataTypes.STRING(11),
            validate: {
                is: /^1[3578]\d{9}$/
            }
        },
    }, {
        timestamps: false
    });
    Task.associate = function(models) {
        // associations can be defined here
    };
    return Task;
};