'use strict';
module.exports = (sequelize, DataTypes) => {
    const Task = sequelize.define('Task', {
        title: DataTypes.STRING,
        content: DataTypes.STRING,
        publisherName: DataTypes.STRING,
        publisherID: {
            type: DataTypes.STRING,
            allowNull: false
        },
        lastModify: DataTypes.DATE,
        address: DataTypes.STRING,
        money: DataTypes.STRING,
        number: DataTypes.INTEGER,
        status: DataTypes.INTEGER,
        phone: {
            type: DataTypes.STRING,
            validate: {
                is: /^1[3578]\d{9}$/
            }
        },
        labels: DataTypes.INTEGER
    }, {
        timestamps: false
    });
    Task.associate = function(models) {
        // associations can be defined here
    };
    return Task;
};