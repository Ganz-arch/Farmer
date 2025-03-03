"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Services", "ServicesCategoryId", {
      type: Sequelize.UUID,
      reference:{
        models:"ServicesCategories",
        key:"id"
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Services", "ServicesCategoryId",);
  },
};
