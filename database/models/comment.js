'use strict';
module.exports = (sequelize, DataTypes) => {
    const Comment = sequelize.define('Comment', {
        score: DataTypes.DOUBLE,
        content: DataTypes.STRING,
        reply: DataTypes.STRING,
        commentDate: DataTypes.DATE,
        replyDate: DataTypes.DATE,
        commentatorID: {
            type: DataTypes.STRING,
            allowNull: false
        },
        masterID: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        timestamps: false
    });
    Comment.associate = function(models) {
        // associations can be defined here
    };
    return Comment;
};