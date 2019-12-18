'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('Tasks', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            title: {
                type: Sequelize.STRING(30)
            },
            content: {
                type: Sequelize.STRING
            },
            publisher: {
                type: Sequelize.STRING(30)
            },
            lastModify: {
                type: Sequelize.DATE
            },
            address: {
                type: Sequelize.STRING
            },
            money: {
                type: Sequelize.DOUBLE(10, 2)
            },
            status: {
                type: Sequelize.INTEGER
            },
            phone: {
                type: Sequelize.STRING(11)
            }
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('Tasks');
    }
};