'use strict';
module.exports = (sequelize, DataTypes) => {
    const UserLabel = sequelize.define('UserLabel', {
        userID: {
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
    UserLabel.associate = function(models) {
        // associations can be defined here
    };
    return UserLabel;
};