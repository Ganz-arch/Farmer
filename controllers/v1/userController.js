const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const config = require("../../config/config");

const blacklistedTokens = [];

//@desc POST Creates users
//@route POST /users
//@access private
const createUserHandler = async (req, res) => {
  try {
    let { name, email, phoneNo, password, role } = req.body;
    if (typeof name !== "string") {
      res.status(400).json({ message: "Name must be a string." });
      return;
    }
    if (typeof email !== "string") {
      res.status(400).json({ message: "Email must be a string." });
      return;
    } else if (!email.includes("@")) {
      res.status(400).json({ message: "Invalid email." });
      return;
    }
    if (typeof phoneNo !== "number") {
      res.status(400).json({ message: "Phone number must be a number." });
      return;
    }
    if (typeof password !== "string") {
      res.status(400).json({ message: "Password must be a string." });
      return;
    } else if (password < 8) {
      res
        .status(400)
        .json({ message: "Password must be at least 8 characters long." });
      return;
    } else if (
      !password.includes("q") &&
      !password.includes("w") &&
      !password.includes("e") &&
      !password.includes("r") &&
      !password.includes("t") &&
      !password.includes("y") &&
      !password.includes("u") &&
      !password.includes("i") &&
      !password.includes("o") &&
      !password.includes("p") &&
      !password.includes("a") &&
      !password.includes("s") &&
      !password.includes("d") &&
      !password.includes("f") &&
      !password.includes("g") &&
      !password.includes("h") &&
      !password.includes("j") &&
      !password.includes("k") &&
      !password.includes("l") &&
      !password.includes("z") &&
      !password.includes("x") &&
      !password.includes("c") &&
      !password.includes("v") &&
      !password.includes("b") &&
      !password.includes("n") &&
      !password.includes("m")
    ) {
      res.status(400).json({
        message: "Password must contain atleast one lowercase alphabet",
      });
      return;
    } else if (
      !password.includes("Q") &&
      !password.includes("W") &&
      !password.includes("E") &&
      !password.includes("R") &&
      !password.includes("T") &&
      !password.includes("Y") &&
      !password.includes("U") &&
      !password.includes("I") &&
      !password.includes("O") &&
      !password.includes("P") &&
      !password.includes("A") &&
      !password.includes("S") &&
      !password.includes("D") &&
      !password.includes("F") &&
      !password.includes("G") &&
      !password.includes("H") &&
      !password.includes("J") &&
      !password.includes("K") &&
      !password.includes("L") &&
      !password.includes("Z") &&
      !password.includes("X") &&
      !password.includes("C") &&
      !password.includes("V") &&
      !password.includes("B") &&
      !password.includes("N") &&
      !password.includes("M")
    ) {
      res.status(400).json({
        message: "Password must contain atleast one uppercase alphabet",
      });
      return;
    } else if (
      !password.includes("~") &&
      !password.includes("!") &&
      !password.includes("@") &&
      !password.includes("#") &&
      !password.includes("$") &&
      !password.includes("%") &&
      !password.includes("^") &&
      !password.includes("&") &&
      !password.includes("*") &&
      !password.includes("-") &&
      !password.includes("_") &&
      !password.includes("<") &&
      !password.includes(">") &&
      !password.includes("/") &&
      !password.includes("?") &&
      !password.includes("|") &&
      !password.includes(";") &&
      !password.includes(":") &&
      !password.includes(".") &&
      !password.includes(",") &&
      !password.includes("(") &&
      !password.includes(")") &&
      !password.includes("{") &&
      !password.includes("}") &&
      !password.includes("[") &&
      !password.includes("]")
    ) {
      res.status(400).json({
        message: "Password must contain atleast one special character",
      });
      return;
    } else if (
      !password.includes("1") &&
      !password.includes("2") &&
      !password.includes("3") &&
      !password.includes("4") &&
      !password.includes("5") &&
      !password.includes("6") &&
      !password.includes("7") &&
      !password.includes("8") &&
      !password.includes("9") &&
      !password.includes("0")
    ) {
      res
        .status(400)
        .json({ message: "Password must contain atleast one number" });
      return;
    }

    if (typeof role !== "string") {
      res.status(400).json({ message: "Role must be a string" });
      return;
    } else if (
      role.toLowerCase() !== "admin" &&
      role.toLowerCase() !== "buyer" &&
      role.toLowerCase() !== "seller"
    ) {
      res
        .status(400)
        .json({ message: "Role must be either admin, buyer or seller" });
      return;
    }
    const isEmail = await User.findOne({ where: { email } });
    if (isEmail) {
      return res.status(400).json({
        message: "User already exists",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      phoneNo,
      password: hashedPassword,
      role,
    });
    res
      .status(201)
      .json({
        id: user.id,
        name: user.name,
        email: user.email,
        phoneNo: user.phoneNo,
        role: user.role
      });
    return;
  } 
  catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//@desc GET Retrieves a user
//@route GET /v1/users/:id
//@access private
const getUserHandler = async (req, res) => {
  try {
    const { id } = req.params;
    if (typeof id !== "string") {
      res.status(400).json({ message: "Id must be a string." });
      return;
    }

    const user = await User.findByPk(id);
    if (!user) {
      res.status(404).json({ message: `User by id:${id} does not exist.` });
      return;
    }
    res.status(200).json({ id: user.id, name: user.name, email: user.email });
    return;
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//@desc POST Log a user
//@route POST /v1/users/login
//@access private
const loginUserHandler = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Invalid email." });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid password." });
    }

    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const token = jwt.sign(payload, config.jwtSecret, { expiresIn: "60d" });
    return res.status(200).json({ token });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//@desc GeT Retrieve users
//@route GeT /v1/users
//@access private
const getUsersHandler = async (req, res) => {
  try {
    const users = await User.findAll();
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//@desc UPDATE Update a user
//@route UPDATE /v1/users/:id
//@access private
const updateUserHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phoneNo, password, role } = req.body;
    if (typeof id !== "string") {
      res.status(400).json({ message: "Id must be a string" });
      return;
    }
    if (typeof name !== "string") {
      res.status(400).json({ message: "Name must be a string" });
      return;
    }
    if (typeof email !== "string") {
      res.status(400).json({ message: "Email must be a string" });
      return;
    } else if (!email.includes("@")) {
      res.status(401).json({ message: "Invalid email" });
      return;
    }
    if (typeof phoneNo !== "number") {
      res.status(400).json({ message: "Age must be a string" });
      return;
    }

    if (typeof password !== "string") {
      res.status(400).json({ message: "Password must be a string" });
      return;
    } else if (password.length < 8) {
      res.status(400).json({ message: "Password must contain 8 characters" });
      return;
    } else if (
      !password.includes("q") &&
      !password.includes("w") &&
      !password.includes("e") &&
      !password.includes("r") &&
      !password.includes("t") &&
      !password.includes("y") &&
      !password.includes("u") &&
      !password.includes("i") &&
      !password.includes("o") &&
      !password.includes("p") &&
      !password.includes("a") &&
      !password.includes("s") &&
      !password.includes("d") &&
      !password.includes("f") &&
      !password.includes("g") &&
      !password.includes("h") &&
      !password.includes("j") &&
      !password.includes("k") &&
      !password.includes("l") &&
      !password.includes("z") &&
      !password.includes("x") &&
      !password.includes("c") &&
      !password.includes("v") &&
      !password.includes("b") &&
      !password.includes("n") &&
      !password.includes("m")
    ) {
      res.status(400).json({
        message: "Password must contain atleast one lowercase alphabet",
      });
      return;
    } else if (
      !password.includes("Q") &&
      !password.includes("W") &&
      !password.includes("E") &&
      !password.includes("R") &&
      !password.includes("T") &&
      !password.includes("Y") &&
      !password.includes("U") &&
      !password.includes("I") &&
      !password.includes("O") &&
      !password.includes("P") &&
      !password.includes("A") &&
      !password.includes("S") &&
      !password.includes("D") &&
      !password.includes("F") &&
      !password.includes("G") &&
      !password.includes("H") &&
      !password.includes("J") &&
      !password.includes("K") &&
      !password.includes("L") &&
      !password.includes("Z") &&
      !password.includes("X") &&
      !password.includes("C") &&
      !password.includes("V") &&
      !password.includes("B") &&
      !password.includes("N") &&
      !password.includes("M")
    ) {
      res.status(400).json({
        message: "Password must contain atleast one uppercase alphabet",
      });
      return;
    } else if (
      !password.includes("~") &&
      !password.includes("!") &&
      !password.includes("@") &&
      !password.includes("#") &&
      !password.includes("$") &&
      !password.includes("%") &&
      !password.includes("^") &&
      !password.includes("&") &&
      !password.includes("*") &&
      !password.includes("-") &&
      !password.includes("_") &&
      !password.includes("<") &&
      !password.includes(">") &&
      !password.includes("/") &&
      !password.includes("?") &&
      !password.includes("|") &&
      !password.includes(";") &&
      !password.includes(":") &&
      !password.includes(".") &&
      !password.includes(",") &&
      !password.includes("(") &&
      !password.includes(")") &&
      !password.includes("{") &&
      !password.includes("}") &&
      !password.includes("[") &&
      !password.includes("]")
    ) {
      res.status(400).json({
        message: "Password must contain atleast one special character",
      });
      return;
    } else if (
      !password.includes("1") &&
      !password.includes("2") &&
      !password.includes("3") &&
      !password.includes("4") &&
      !password.includes("5") &&
      !password.includes("6") &&
      !password.includes("7") &&
      !password.includes("8") &&
      !password.includes("9") &&
      !password.includes("0")
    ) {
      res
        .status(400)
        .json({ message: "Password must contain atleast one number" });
      return;
    }
    if (typeof role !== "string") {
      res.status(400).json({ message: "Role must be a string" });
      return;
    } else if (
      role.toLowerCase() !== "admin" &&
      role.toLowerCase() !== "buyer" &&
      role.toLowerCase() !== "seller"
    ) {
      res
        .status(400)
        .json({ message: "Role must be either admin, buyer or seller" });
      return;
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.findOne({
      where: {
        id: id,
      },
    });
    if (!user) {
      res.status(401).json({ message: "User not found" });
      return;
    }

    user.name = name;
    user.email = email;
    user.phoneNo = phoneNo;
    user.password = hashedPassword;
    user.role = role;

    await user.save();
    res.status(200).json(user);
    return;
  } catch (error) {
    res.status(500).json({ message: error.message });
    return;
  }
};
//@desc Log out User
//@route POST v1/users/:id
//@access Private
const logOutUserHandler = async (req, res) => {
  try {
    const token = req.headers["authorization"];
    if (token) {
      blacklistedTokens.push(token);
      res.status(200).json({ message: "Logged out successfully" });
      return;
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Check if token is blacklisted
const isTokenBlacklisted = (token) => {
  return blacklistedTokens.includes(token);
};

//@desc DELETE DELETE a user
//@route DELETE /v1/users/:id
//@access private
const deleteUserHandler = async (req, res) => {
  try {
    const { id } = req.params;
    if (typeof id !== "string") {
      res.status(400).json({ message: "Id must be a string." });
      return;
    }

    const user = await User.findByPk(id);
    if (!user) {
      res.status(404).json({ message: `User by id:${id} does not exist.` });
      return;
    }

    await user.destroy();
    res.status(204).json({ message: "User deleted successfully." });
    return;
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createUserHandler,
  getUserHandler,
  getUsersHandler,
  loginUserHandler,
  updateUserHandler,
  logOutUserHandler,
  isTokenBlacklisted,
  deleteUserHandler,
  blacklistedTokens
};
