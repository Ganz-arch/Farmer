"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Markets", "MarketCategoryId", {
      type: Sequelize.UUID,
      reference:{
        models:"MarketCategories",
        key:"id"
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Markets", "MarketCategoryId",);
  },
};
