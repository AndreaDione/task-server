'use strict';
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        account: {
            type: DataTypes.STRING(16),
            allowNull: false,
            primaryKey: true,
            unique: 'accountIndex',
            validate: {
                len: [2, 16]
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING(30)
        },
        phone: {
            type: DataTypes.STRING(11),
            validate: {
                is: /^1[3578]\d{9}$/
            }
        },
        email: {
            type: DataTypes.STRING(30),
            validate: {
                is: /^[\w-]+([\.\w-]+)?@[\w-]+([\.\w-]+)?\.[a-z]{2,}$/
            }
        },
        avatar: DataTypes.STRING
    }, {
        timestamps: false
    });
    User.associate = function(models) {
        // associations can be defined here
    };
    return User;
};