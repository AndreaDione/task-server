'use strict';
module.exports = (sequelize, DataTypes) => {
    const Label = sequelize.define('Label', {
        name: {
            type: DataTypes.STRING(10),
            allowNull: false,
            validate: {
                len: [1, 10]
            }
        }
    }, {
        timestamps: false
    });
    Label.associate = function(models) {
        // associations can be defined here
    };
    return Label;
};