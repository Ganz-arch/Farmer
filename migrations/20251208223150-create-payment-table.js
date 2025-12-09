"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Payments", {
      paymentReference: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
      },
      amount: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      customerName: Sequelize.STRING,
      customerEmail: Sequelize.STRING,
      paymentStatus: {
        type: Sequelize.STRING,
        defaultValue: "PENDING",
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Payments");
  },
};
