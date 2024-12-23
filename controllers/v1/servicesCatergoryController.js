const ServicesCategory = require("../../models/ServicesCategory");

//@desc POST create category
//@route POST /v1/categories
//@access Private

const createServiceCategoryHandler = async (req, res) => {
  try {
    const { name } = req.body;
    if (typeof name !== "string") {
      return res.status(400).json({ message: "Name must be a string" });
    }

    const existingServices = await ServicesCategory.findOne({
      where: { name },
    });
    if (existingServices) {
      return res.status(400).json({
        message: "Services already exists",
      });
    }
    const services = await ServicesCategory.create({ name });

    res.status(201).json(services);
    return;
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//@desc Retrieve Services
//@route GET /v1/Services
//@access Public
const retrieveServiceCategoriesHandler = async (req, res) => {
  try {
    const services = await ServicesCategory.findAll();
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//@desc Retrieve Service
//@route GET /v1/Services/:id
//@access Public
const retrieveServiceCategoryHandler = async (req, res) => {
  try {
    let { id } = req.params;
    if (typeof id !== "string") {
      return res.status(400).json({ message: "Id must be a string" });
    }
    

    const service = await ServicesCategory.findByPk(id);
    if (!service) {
      res.status(404).json({ message: "Service not found" });
    }
    res.status(200).json(service);
    return;
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//@desc Update Services
//@route PUT /v1/Servicess/:id
//@access Private
const updateServiceCategoryHandler = async (req, res) => {
  try {
    const { id } = req.params;
    if (typeof id !== "string") {
      return res.status(400).json({ message: "Id must be a string" });
    }
    const { name } = req.body;
    if (typeof name !== "string") {
      return res.status(400).json({ message: "Name must be a string" });
    }

    const existingServices = await ServicesCategory.findOne({
      where:{name}
    })
    if (existingServices){
      return res.status(400).json({ message: "Services name same as initial Services name" });
    }

    const services = await ServicesCategory.findByPk(id);
    if (!services) {
      return res.status(404).json({ message: "Services not found" });
    }

    services.name = name;
    await services.save();

    return res.status(200).json(services);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//@desc Delete Services
//@route Delete /v1/Services/:id
//@access Private
const deleteServiceCategoryHandler = async (req, res) => {
  try {
    const { id } = req.params;
    if (typeof id !== "string") {
      return res.status(400).json({ message: "Id must be a string" });
    }

    const services = await ServicesCategory.findByPk(id);
    if (!services) {
      return res.status(404).json({ message: "Services not found" });
    }

    await services.destroy();
    res
      .status(204)
      .json({ message: `User ${services.name} deleted successfully.` });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createServiceCategoryHandler,
  retrieveServiceCategoryHandler,
  retrieveServiceCategoriesHandler,
  updateServiceCategoryHandler,
  deleteServiceCategoryHandler,
};
