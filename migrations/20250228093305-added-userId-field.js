'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Otps","UserId", {
      type: Sequelize.UUID,
      references:{
        model:'Users',
        key:'id'
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Otps","UserId");
  },
};