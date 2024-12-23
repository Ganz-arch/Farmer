const MarketCategory = require("../../models/MarketCategory");

//@desc POST create category
//@route POST /v1/categories
//@access Private

const createMarketCategoryHandler = async (req, res) => {
  try {
    const { name } = req.body;
    if (typeof name !== "string") {
      return res.status(400).json({ message: "Name must be a string" });
    }

    const existingMarket = await MarketCategory.findOne({
      where: { name },
    });
    if (existingMarket) {
      return res.status(400).json({
        message: "Market already exists",
      });
    }
    const market = await MarketCategory.create({ name });

    res.status(201).json(market);
    return;
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//@desc Retrieve Markets
//@route GET /v1/Markets
//@access Public
const retrieveMarketsCategoryHandler = async (req, res) => {
  try {
    const markets = await MarketCategory.findAll();
    res.status(200).json(markets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//@desc Retrieve Market
//@route GET /v1/Markets/:id
//@access Public
const retrieveMarketCategoryHandler = async (req, res) => {
  try {
    let { id } = req.params;
    if (typeof id !== "string") {
      return res.status(400).json({ message: "Id must be a string" });
    }
    

    const market = await MarketCategory.findByPk(id);
    if (!market) {
      res.status(404).json({ message: "Market not found" });
    }
    res.status(200).json(market);
    return;
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//@desc Update Market
//@route PUT /v1/Markets/:id
//@access Private
const updateMarketCategoryHandler = async (req, res) => {
  try {
    const { id } = req.params;
    if (typeof id !== "string") {
      return res.status(400).json({ message: "Id must be a string" });
    }
    const { name } = req.body;
    if (typeof name !== "string") {
      return res.status(400).json({ message: "Name must be a string" });
    }

    const existingMarket = await MarketCategory.findOne({
      where:{name}
    })
    if (existingMarket){
      return res.status(400).json({ message: "Market name same as initial Market name" });
    }

    const market = await MarketCategory.findByPk(id);
    if (!market) {
      return res.status(404).json({ message: "Market not found" });
    }

    market.name = name;
    await market.save();

    return res.status(200).json(market);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//@desc Delete Market
//@route Delete /v1/Markets/:id
//@access Private
const deleteMarketCategoryHandler = async (req, res) => {
  try {
    const { id } = req.params;
    if (typeof id !== "string") {
      return res.status(400).json({ message: "Id must be a string" });
    }

    const market = await MarketCategory.findByPk(id);
    if (!market) {
      return res.status(404).json({ message: "Market not found" });
    }

    await market.destroy();
    res
      .status(204)
      .json({ message: `User ${market.name} deleted successfully.` });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createMarketCategoryHandler,
  retrieveMarketCategoryHandler,
  retrieveMarketsCategoryHandler,
  updateMarketCategoryHandler,
  deleteMarketCategoryHandler,
};
