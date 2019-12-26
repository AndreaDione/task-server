'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('TaskLabels', {
            taskID: {
                type: Sequelize.STRING,
                primaryKey: true,
                allowNull: false
            },
            labelID: {
                type: Sequelize.STRING,
                primaryKey: true,
                allowNull: false
            }
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('TaskLabels');
    }
};