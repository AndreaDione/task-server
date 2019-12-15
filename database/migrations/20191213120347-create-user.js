'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('Users', {
            account: {
                type: Sequelize.STRING(16),
                allowNull: false,
                primaryKey: true,
                unique: 'accountIndex'
            },
            password: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            name: {
                type: Sequelize.STRING(30)
            },
            phone: {
                type: Sequelize.STRING(11)
            },
            email: {
                type: Sequelize.STRING(30)
            },
            avatar: {
                type: Sequelize.STRING
            }
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('Users');
    }
};