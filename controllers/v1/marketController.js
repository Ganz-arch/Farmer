const { Op } = require("sequelize");
const MarketCategory = require("../../models/MarketCategory");
const Market = require("../../models/Market");

//@desc Create Marketplace
//@route POST /v1/marketplaces
//@access Private

const createMarketHandler = async (req, res) => {
  try {
    const user = req.user;
    const {
      location,
      typeOfProduce,
      quantity,
      description,
      regularPrice,
      bulkPrice,
      phoneNo,
      name,
      deliveryOption,
      marketCategoryId,
    } = req.body;

    if (typeof location !== "string") {
      return res.status(400).json({ message: "Location must be a string" });
    }
    if (typeof typeOfProduce !== "string") {
      return res
        .status(400)
        .json({ message: "typeOfProduce must be a string" });
    }
    if (typeof quantity !== "number") {
      return res.status(400).json({ message: "Quantity must be a number" });
    }
    if (typeof description !== "string") {
      return res.status(400).json({ message: "Description must be a string" });
    }
    if (typeof regularPrice !== "number") {
      return res
        .status(400)
        .json({ message: "Regular price must be a number" });
    }
    if (typeof bulkPrice !== "number") {
      return res.status(400).json({ message: "Bulk price must be a number" });
    }
    if (typeof phoneNo !== "number") {
      return res
        .status(400)
        .json({ message: "Sellers phone Number must be a number" });
    }
    if (typeof name !== "string") {
      return res
        .status(400)
        .json({ message: "Name of seller must be a string" });
    } else if (name !== user.fullName) {
      return res
        .status(400)
        .json({ message: "Name has to be same with sellers name." });
    }
    if (typeof deliveryOption !== "string") {
      return res
        .status(400)
        .json({ message: "Delivery option must be a string" });
    }
    if (typeof marketCategoryId !== "string") {
      return res
        .status(400)
        .json({ message: "Market CategoryId must be a string" });
    }

    const marketCategory = await MarketCategory.findByPk(marketCategoryId);
    if (!marketCategory) {
      return res.status(404).json({ message: "Market Category not found" });
    }

    const market = await Market.create({
      location,
      typeOfProduce,
      quantity,
      description,
      regularPrice,
      bulkPrice,
      phoneNo,
      name,
      deliveryOption,
      marketCategoryId,
    });
    market.setUser(user);
    market.setMarketCategory(marketCategory);
    return res.status(201).json(marketCategory);
  } catch (error) {
    return res.status(200).json({ message: error.message });
  }
};

//@desc Retrieve all user Marketplaces(Including filtering by catergory, searching by market product type/quantity/location/regular price/bulk price)
//@route GET /v1/marketplaces
//@access Private

const retrieveMarketsHandler = async (req, res) => {
  try {
    const user = req.user;
    let {
      filter,
      locationSearch,
      typeOfProduceSearch,
      quantitySearch,
      regularPriceSearch,
      bulkPriceSearch,
    } = req.query;

    if (filter) {
      if (typeof filter !== "string") {
        return res.status(400).json({ message: "Filter must be a string" });
      }

      const marketCategory = await MarketCategory.findOne({
        where: {
          name: filter,
        },
      });

      if (!marketCategory) {
        return res.status(404).json({ message: "Market category not found" });
      }

      const market = await Market.findAll({
        where: {
          // UserId: user.id,
          MarketCategoryId: marketCategory.id,
        },
      });
      res.status(200).json(market);
    }

    if (locationSearch) {
      if (typeof locationSearch !== "string") {
        return res
          .status(400)
          .json({ message: "Location search must be a string" });
      }

      const market = await Market.findAll({
        where: {
          location: {
            [Op.iLike]: `%${locationSearch}%`,
          },
        },
      });
      return res.status(200).json(market);
    }

    if (typeOfProduceSearch) {
      if (typeof typeOfProduceSearch !== "string") {
        return res
          .status(400)
          .json({ message: "typeOfProduceSearch must be a string" });
      }
      const market = await Market.findAll({
        where: {
          typeOfProduce: {
            [Op.iLike]: `%${typeOfProduceSearch}%`,
          },
        },
      });

      return res.status(200).json(market);
    }

    if (quantitySearch) {
      // if (typeof quantitySearch !== "number") {
      //   res.status(400).json({ message: "Quantity search must be a number" });
      // }

      const market = await Market.findAll({
        where: {
          quantity: {
            [Op.match]: `%${quantitySearch}%`,
          },
        },
      });
      return res.status(200).json(market);
    }
    if (regularPriceSearch) {
      // if (typeof regularPriceSearch !== "string") {
      //   res
      //     .status(400)
      //     .json({ message: "Regular price search must be a string" });
      // }

      const market = await Market.findAll({
        where: {
          regularPrice: {
            [Op.match]: `%${regularPriceSearch}%`,
          },
        },
      });
      return res.status(200).json(market);
    }
    if (bulkPriceSearch) {
      // if (typeof bulkPriceSearch !== "number") {
      //   res.status(400).json({ message: "Bulk price search must be a string" });
      // }

      const market = await Market.findAll({
        where: {
          bulkPrice: {
            [Op.match]: `%${bulkPriceSearch}%`,
          },
        },
      });
      return res.status(200).json(market);
    }

    //Fetch all user expenses
    const market = await Market.findAll({
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json(market);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//@desc Retrieve all markets created by user(Including filtering by catergory, searching by market product type/quantity/location/regular price/bulk price)
//@route GET /v1/marketplaces/myproducts/:id
//@access Private
const retrieveMyProductsHandler = async (req, res) => {
  try {
    // const id = req.params
    const user = req.user;
    let {
      filter,
      locationSearch,
      typeOfProduceSearch,
      quantitySearch,
      regularPriceSearch,
      bulkPriceSearch,
    } = req.query;
    // if(typeof id !== "string"){
    //   return res.status(400).json({ message: "Id must be a string" });
    // }
    // const userId =
    if (filter) {
      if (typeof filter !== "string") {
        return res.status(400).json({ message: "Filter must be a string" });
      }

      const marketCategory = await MarketCategory.findOne({
        where: {
          name: filter,
        },
      });

      if (!marketCategory) {
        return res.status(404).json({ message: "Market category not found" });
      }

      const market = await Market.findAll({
        where: {
          UserId: user.id,
          MarketCategoryId: marketCategory.id,
        },
      });
      res.status(200).json(market);
    }

    if (locationSearch) {
      if (typeof locationSearch !== "string") {
        return res
          .status(400)
          .json({ message: "Location search must be a string" });
      }

      const market = await Market.findAll({
        where: {
          UserId: user.id,
          location: {
            [Op.iLike]: `%${locationSearch}%`,
          },
        },
      });
      return res.status(200).json(market);
    }

    if (typeOfProduceSearch) {
      if (typeof typeOfProduceSearch !== "string") {
        return res
          .status(400)
          .json({ message: "typeOfProduceSearch must be a string" });
      }
      const market = await Market.findAll({
        where: {
          UserId: user.id,
          typeOfProduce: {
            [Op.iLike]: `%${typeOfProduceSearch}%`,
          },
        },
      });

      return res.status(200).json(market);
    }

    if (quantitySearch) {
      const numQuantitySearch = parseFloat(quantitySearch);
      if (typeof numQuantitySearch !== "number") {
        res.status(400).json({ message: "Quantity search must be a number" });
      }

      const market = await Market.findAll({
        where: {
          UserId: user.id,
          quantity: {
            [Op.match]: `%${numQuantitySearch}%`,
          },
        },
      });
      return res.status(200).json(market);
    }
    if (regularPriceSearch) {
      // if (typeof regularPriceSearch !== "string") {
      //   res
      //     .status(400)
      //     .json({ message: "Regular price search must be a string" });
      // }

      const market = await Market.findAll({
        where: {
          UserId: user.id,
          regularPrice: {
            [Op.match]: `%${regularPriceSearch}%`,
          },
        },
      });
      return res.status(200).json(market);
    }
    if (bulkPriceSearch) {
      // if (typeof bulkPriceSearch !== "number") {
      //   res.status(400).json({ message: "Bulk price search must be a string" });
      // }

      const market = await Market.findAll({
        where: {
          UserId: user.id,
          bulkPrice: {
            [Op.match]: `%${bulkPriceSearch}%`,
          },
        },
      });
      return res.status(200).json(market);
    }

    //Fetch all user expenses
    const market = await Market.findAll({
      where: {
        UserId: user.id,
      },
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json(market);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//@desc Retrieve Marketplace
//@route GET /v1/marketplaces/:id
//@access Private
const retrieveMarketHandler = async (req, res) => {
  try {
    const { id } = req.params;
    if (typeof id !== "string") {
      return res.status(400).json({ message: "Id must be a string" });
    }

    const market = await Market.findByPk(id);
    if (!market) {
      return res.status(400).json({ message: "Market not found" });
    }
    res.status(200).json(market);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//@desc Update Marketplace
//@route PUT /v1/marketplaces/:id
//@access Private
const updateMarketHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;
    const {
      location,
      typeOfProduce,
      quantity,
      description,
      regularPrice,
      bulkPrice,
      phoneNo,
      name,
      deliveryOption,
      marketCategoryId,
    } = req.body;

    if (typeof id !== "string") {
      return res.status(400).json({ message: "Id must be a string" });
    }
    if (typeof location !== "string") {
      return res.status(400).json({ message: "Location must be a string" });
    }
    if (typeof typeOfProduce !== "string") {
      return res
        .status(400)
        .json({ message: "typeOfProduce must be a string" });
    }
    if (typeof quantity !== "number") {
      return res.status(400).json({ message: "Quantity must be a number" });
    }
    if (typeof description !== "string") {
      return res.status(400).json({ message: "Description must be a string" });
    }
    if (typeof regularPrice !== "number") {
      return res
        .status(400)
        .json({ message: "Regular price must be a number" });
    }
    if (typeof bulkPrice !== "number") {
      return res.status(400).json({ message: "Bulk price must be a number" });
    }
    if (typeof phoneNo !== "number") {
      return res
        .status(400)
        .json({ message: "Sellers phone Number must be a number" });
    }
    if (typeof name !== "string") {
      return res
        .status(400)
        .json({ message: "Name of seller must be a string" });
    } else if (name !== user.name) {
      return res
        .status(400)
        .json({ message: "Name has to be same with sellers name." });
    }
    if (typeof deliveryOption !== "string") {
      return res
        .status(400)
        .json({ message: "Delivery option must be a string" });
    }
    if (typeof marketCategoryId !== "string") {
      return res
        .status(400)
        .json({ message: "Market CategoryId must be a string" });
    }

    const marketCategory = await MarketCategory.findByPk(marketCategoryId);
    if (!marketCategory) {
      return res.status(404).json({ message: "Market Category not found" });
    }

    const market = await Market.findByPk(id);
    if (!market) {
      return res.status(400).json({ message: "Market not found" });
    }
    market.location = location;
    market.typeOfProduce = typeOfProduce;
    market.quantity = quantity;
    market.description = description;
    market.regularPrice = regularPrice;
    market.bulkPrice = bulkPrice;
    market.phoneNo = phoneNo;
    market.name = name;
    market.deliveryOption = deliveryOption;

    await market.save();

    market.setMarketCategory(marketCategory);
    // market.setUser(user)

    return res.status(200).json(marketCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//@desc Delete a user Expense
//@route DELETE /v1/expenses/:id
//@access Private

const deleteMarketHandler = async (req, res) => {
  try {
    const { id } = req.params;
    if (typeof id !== "string") {
      return res.status(400).json({ message: "Id must be a string" });
    }

    const market = await Market.findByPk(id);
    if (!market) {
      return res.status(400).json({ message: "Market not found" });
    }
    await market.destroy();
    res.status(200).json({ message: "Market deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createMarketHandler,
  retrieveMyProductsHandler,

  retrieveMarketsHandler,
  retrieveMarketHandler,
  updateMarketHandler,
  deleteMarketHandler,
};
