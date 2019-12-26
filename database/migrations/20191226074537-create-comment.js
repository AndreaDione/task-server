'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('Comments', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            score: {
                type: Sequelize.DOUBLE
            },
            content: {
                type: Sequelize.STRING
            },
            reply: {
                type: Sequelize.STRING
            },
            commentDate: {
                type: Sequelize.DATE
            },
            replyDate: {
                type: Sequelize.DATE
            },
            commentatorID: {
                type: Sequelize.STRING,
                allowNull: false
            },
            masterID: {
                type: Sequelize.STRING,
                allowNull: false
            }
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('Comments');
    }
};