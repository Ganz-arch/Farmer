"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Services", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      location: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      typeOfService: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      regularPrice: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      bulkPrice: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      phoneNo: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      serviceOption: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Services");
  },
};
