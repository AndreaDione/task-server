'use strict';
module.exports = (sequelize, DataTypes) => {
    const TaskLabel = sequelize.define('TaskLabel', {
        taskID: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false
        },
        labelID: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false
        }
    }, {
        timestamps: false
    });
    TaskLabel.associate = function(models) {
        // associations can be defined here
    };
    return TaskLabel;
};