'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('Messages', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            content: {
                type: Sequelize.STRING
            },
            status: {
                type: Sequelize.INTEGER
            },
            masterID: {
                type: Sequelize.STRING
            },
            emitter: {
                type: Sequelize.STRING
            },
            date: {
                type: Sequelize.DATE
            },
            type: {
                type: Sequelize.INTEGER
            }
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('Messages');
    }
};