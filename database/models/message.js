'use strict';
module.exports = (sequelize, DataTypes) => {
    const Message = sequelize.define('Message', {
        content: DataTypes.STRING,
        status: DataTypes.INTEGER,
        masterID: DataTypes.STRING,
        emitter: DataTypes.STRING,
        date: DataTypes.DATE,
        type: DataTypes.INTEGER
    }, {
        timestamps: false
    });
    Message.associate = function(models) {
        // associations can be defined here
    };
    return Message;
};