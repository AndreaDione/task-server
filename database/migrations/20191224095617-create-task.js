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
                type: Sequelize.STRING
            },
            content: {
                type: Sequelize.STRING
            },
            publisherName: {
                type: Sequelize.STRING
            },
            publisherID: {
                type: Sequelize.STRING,
                allowNull: false
            },
            lastModify: {
                type: Sequelize.DATE
            },
            address: {
                type: Sequelize.STRING
            },
            money: {
                type: Sequelize.STRING
            },
            number: {
                type: Sequelize.INTEGER
            },
            status: {
                type: Sequelize.INTEGER
            },
            phone: {
                type: Sequelize.STRING
            },
            labels: {
                type: Sequelize.STRING
            }
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('Tasks');
    }
};