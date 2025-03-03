"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Users", "confirmPassword", {
      type: Sequelize.STRING,
      defaultScope: {
        attributes: { exclude: ["confirmPassword"] },
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Users", "confirmPassword");
  },
};
