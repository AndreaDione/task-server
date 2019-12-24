'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('MyReceiveTasks', {
            taskID: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                allowNull: false
            },
            receiverID: {
                type: Sequelize.STRING,
                primaryKey: true,
                allowNull: false
            },
            date: {
                type: Sequelize.DATE
            }
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('MyReceiveTasks');
    }
};