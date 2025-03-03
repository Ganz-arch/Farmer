const ServicesCategory = require("../../models/ServicesCategory");
const Services = require("../../models/Services");
const { Op } = require("sequelize");

//@desc Create services
//@route POST /v1/services
//@access private
const createServiceHandler = async (req, res) => {
  try {
    const user = req.user;
    const {
      location,
      typeOfService,
      description,
      regularPrice,
      bulkPrice,
      phoneNo,
      name,
      serviceOption,
      servicesCategoryId,
    } = req.body;
    if (typeof location !== "string") {
      return res.status(400).json({ message: "Location must be a string" });
    }
    if (typeof typeOfService !== "string") {
      return res
        .status(400)
        .json({ message: "Type of service must be a string" });
    }
    if (typeof description !== "string") {
      return res.status(400).json({ message: "Description must be a string" });
    }
    if (typeof regularPrice !== "number") {
      return res
        .status(400)
        .json({ message: "Regular price must be a string" });
    }
    if (typeof bulkPrice !== "number") {
      return res.status(400).json({ message: "Bulk price must be a string" });
    }
    if (typeof phoneNo !== "number") {
      return res.status(400).json({ message: "Phone number must be a string" });
    }
    if (typeof name !== "string") {
      return res.status(400).json({ message: "Name must be a string" });
    } else if (name !== user.name) {
      return res
        .status(400)
        .json({ message: "Name has to be same with sellers name." });
    }
    if (typeof serviceOption !== "string") {
      return res
        .status(400)
        .json({ message: "Service option must be a string" });
    }
    if (typeof servicesCategoryId !== "string") {
      return res
        .status(400)
        .json({ message: "Service category id must be a string" });
    }

    const servicesCategory = await ServicesCategory.findByPk(
      servicesCategoryId
    );
    if (!servicesCategoryId) {
      return res.status(404).json({ message: "Service Category not found" });
    }

    const services = await Services.create({
      location,
      typeOfService,
      description,
      regularPrice,
      bulkPrice,
      phoneNo,
      name,
      serviceOption,
      servicesCategoryId,
    });
    services.setUser(user);
    services.setServicesCategory(servicesCategory);

    return res.status(201).json(servicesCategory);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//@desc Retrieve all user services(Including filtering by catergory, searching by service type/name of service provider/quantity/location/regular price/bulk price)
//@route GET /v1/services
//@access Private
const getServicesHandler = async (req, res) => {
  try {
    const user = req.user;
    let {
      filter,
      typeSearch,
      nameSearch,
      quantitySearch,
      locationSearch,
      regularPriceSearch,
      bulkPriceSearch,
    } = req.query;
    if (filter) {
      if (typeof filter !== "string") {
        return res.status(400).json({ message: "Filter must be a string" });
      }

      const servicesCategory = await ServicesCategory.findAll({
        where: {
          name: filter,
        },
      });
      if (!servicesCategory) {
        return res.status(404).json({ message: "Service category not found" });
      }

      const service = await Services.findAll({
        where: {
          ServicesCategoryId: servicesCategory.id,
        },
      });
      return res.status(200).json(service);
    }
    if (typeSearch) {
      if (typeof typeSearch !== "string") {
        return res
          .status(400)
          .json({ message: "Type search must be a string" });
      }

      const service = await Services.findAll({
        where: {
          typeOfService: {
            [Op.iLike]: `%${typeSearch}%`,
          },
        },
      });
      return res.status(200).json(service);
    }
    if (nameSearch) {
      if (typeof nameSearch !== "string") {
        return res
          .status(400)
          .json({ message: "Name search must be a string" });
      }

      const service = await Services.findAll({
        where: {
          name: {
            [Op.iLike]: `%${nameSearch}%`,
          },
        },
      });
      return res.status(200).json(service);
    }
    if (locationSearch) {
      if (typeof locationSearch !== "string") {
        return res
          .status(400)
          .json({ message: "Location search must be a string" });
      }

      const service = await Services.findAll({
        where: {
          location: {
            [Op.iLike]: `%${locationSearch}%`,
          },
        },
      });
      return res.status(200).json(service);
    }
    if (regularPriceSearch) {
      // if (typeof regularPriceSearch !== "number") {
      //   return res
      //     .status(400)
      //     .json({ message: "Regular price search must be a string" });
      // }

      const service = await Services.findAll({
        where: {
          regularPrice: {
            [Op.match]: `%${regularPriceSearch}%`,
          },
        },
      });
      return res.status(200).json(service);
    }
    if (bulkPriceSearch) {
      // if (typeof bulkPriceSearch !== "number") {
      //   return res.status(400).json({ message: "Bulk price search must be a string" });
      // }

      const service = await Services.findAll({
        where: {
          bulkPrice: {
            [Op.match]: `%${bulkPriceSearch}%`,
          },
        },
      });
      return res.status(200).json(service);
    }
    const service = await Services.findAll({
      order: [["createdAt", "DESC"]],
    });
    return res.status(200).json(service);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//@desc Retrieve user service
//@route GET /v1/services/:id
//@access Private
const getServiceHandler = async (req, res) => {
  try {
    const { id } = req.params;
    if (typeof id !== "string") {
      return res.status(400).json({ message: "ID must be a string" });
    }
    const service = await Services.findByPk(id);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    return res.status(200).json(service);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//@desc Update user service
//@route GET /v1/services/:id
//@access Private
const updateServiceHandler = async (req, res) => {
  try {
    const user = req.user;
    const { id } = req.params;
    const {
      location,
      typeOfService,
      description,
      regularPrice,
      bulkPrice,
      phoneNo,
      name,
      serviceOption,
      servicesCategoryId,
    } = req.body;
    if (typeof id !== "string") {
      return res.status(400).json({ message: "ID must be a string" });
    }
    if (typeof location !== "string") {
      return res.status(400).json({ message: "Location must be a string" });
    }
    if (typeof typeOfService !== "string") {
      return res
        .status(400)
        .json({ message: "Type of service must be a string" });
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
      return res.status(400).json({ message: "Phone number must be a number" });
    }
    if (typeof name !== "string") {
      return res.status(400).json({ message: "Name must be a string" });
    } else if (name !== user.name) {
      return res
        .status(400)
        .json({ message: "Name has to be same with sellers name." });
    }
    if (typeof serviceOption !== "string") {
      return res
        .status(400)
        .json({ message: "Service option must be a string" });
    }
    if (typeof servicesCategoryId !== "string") {
      return res
        .status(400)
        .json({ message: "Service category id must be a string" });
    }
    const servicesCategory = await ServicesCategory.findByPk(servicesCategoryId);
    if (!servicesCategory) {
      return res.status(404).json({ message: "Service category not found" });
    }
    const service = await Services.findByPk(id);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    service.location = location;
    service.typeOfService = typeOfService;
    service.description = description;
    service.regularPrice = regularPrice;
    service.bulkPrice = bulkPrice;
    service.phoneNo = phoneNo;
    service.name = name;
    service.serviceOption = serviceOption;

    await service.save();

    service.setServicesCategory(servicesCategory);
    return res.status(200).json(service);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//@desc Delete user services
//@route GET /v1/services
//@access Private
const deleteServiceHandler = async (req, res) => {
  try {
    const { id } = req.params;
    if (typeof id !== "string") {
      return res.status(400).json({ message: "ID must be a string" });
    }
    const service = await Services.findByPk(id);
    if (!service) {
      return res.status(401).json({ message: "Service not found" });
    }

    await service.destroy();
    return res.status(204).json();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// //@desc Retrieve all user services(Including filtering by catergory, searching by service type/name of service provider/quantity/location/regular price/bulk price)
// //@route GET /v1/services
// //@access Private
// const getServiceHandler = async(req, res)=>{
//     try {

//     } catch (error) {
//         res.status(500).json({message:error.message})
//     }
// }

module.exports = {
  createServiceHandler,
  getServiceHandler,
  getServicesHandler,
  updateServiceHandler,
  deleteServiceHandler,
};
