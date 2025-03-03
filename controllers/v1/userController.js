const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../../models/User");
const BlackListedToken = require("../../models/BlackListedTokens");
const { sendOtp, resendOtp, verifyOtp } = require("../../utils/otp");
const sendEmail = require("../../utils/email");
const config = require("../../config/config");
const { sendVerificationEmail } = require("../../utils/emailTransporter");

//@desc POST Creates users
//@route POST /users
//@access private
const createUserHandler = async (req, res) => {
  try {
    let { fullName, email, phoneNo, password, role } = req.body;
    if (typeof fullName !== "string") {
      res.status(400).json({ message: "fullName must be a string." });
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
    } else if (role !== "admin" && role !== "buyer" && role !== "seller") {
      res.status(400).json({
        message: "Role must be either lowercase admin, buyer or seller",
      });
      return;
    }
    const isEmail = await User.findOne({
      where: { email: email, isVerified: true },
    });
    if (isEmail) {
      return res.status(400).json({
        message: "User already exists",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullName,
      email,
      phoneNo,
      password: hashedPassword,
      role,
    });

    const otpSent = await sendOtp(user.id);
    const otp = otpSent.otp;
    await sendEmail({
      to: email,
      subject: "Your OTP Code",
      text: `Hello,
  
  Your OTP for verification is: ${otp}.
  This code is valid for the next 5 minutes.
  
  If you did not request this, please contact our support team immediately.
  
  Thank you,
  AgriConnect`,
      html: `
          <p>Hello,</p>
          <p>Your OTP for verification is: <strong>${otp}</strong>.</p>
          <p>This code is valid for the next <strong>${5}</strong> minutes.</p>
          <p>If you did not request this, please contact our support team immediately.</p>
          <p>Thank you,<br>AgriConnect</p>
      `,
    });
    // // Generate a verfication token
    // const token = jwt.sign({ id: user.id }, config.jwtSecret2, {
    //   expiresIn: "1000h",
    // });
    // // if (!token){
    // //   res.status(400).json({message: })
    // // }

    // // Send verification email
    // await sendVerificationEmail(user.email, token);

    res.status(201).json({
      message: `${otpSent.message}`,
      id: user.id,
      fullame: user.fullName,
      email: user.email,
      isVerified: user.isVerified,
      role: user.role,
      emailmessage: `otp sent to ${email}`,
    });
    return;
  } catch (error) {
    console.error(error);
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

//@desc POST resend otp
//@route POST /v1/users/resendotp
//@access private
const resentOtpHandler = async (req, res) => {
  try {
    const { email } = req.body
    const sendOtp = await resendOtp(email)
    const otpSent = await sendOtp(sendOtp.id)
    const otp = otpSent.otp;
    await sendEmail({
      to: email,
      subject: "Your OTP Code",
      text: `Hello,
  
  Your OTP for verification is: ${otp}.
  This code is valid for the next 5 minutes.
  
  If you did not request this, please contact our support team immediately.
  
  Thank you,
  AgriConnect`,
      html: `
          <p>Hello,</p>
          <p>Your OTP for verification is: <strong>${otp}</strong>.</p>
          <p>This code is valid for the next <strong>${5}</strong> minutes.</p>
          <p>If you did not request this, please contact our support team immediately.</p>
          <p>Thank you,<br>AgriConnect</p>
      `,
    });
    res.status(200).json({
      status: "Succesful",
      message: `${otpSent.message}`,
      emailmessage: `otp sent to ${email}`
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//@desc POST Verifies otp
//@route POST /v1/users/verifyotp
//@access private
const verifyOtpHandler = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        Status: "Failed",
        Message: "Email and OTP are required"
      });
    }
    const newUser = await verifyOtp(otp);
    // Generate a verfication token
    console.log(newUser.result[0].id)
    const token = jwt.sign({ id: newUser.result[0].id }, config.jwtSecret2, {
      expiresIn: "1h",
    });

    const jwtToken = res.cookie('jwtToken', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    res.status(200).json({
      Status: "Succesful",
      Message: "User Created Succesfully",
      data: { user: newUser },
      Token: jwtToken,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//@desc PATCH Partilly updates isVerified field
//@route PATCH /v1/users/:token
//@access private
const verifyEmailHandler = async (req, res) => {
  try {
    if (!req.params.token) {
      return res
        .status(401)
        .json({ message: "Params token not found" });
    }

    const emailVerificationToken = req.params.token;
    if (!emailVerificationToken) {
      return res
        .status(401)
        .json({ message: "Invalid email verification token" });
    }

    const payload = jwt.verify(emailVerificationToken, config.jwtSecret2);
    if (!payload) {
      return res.status(401).json({ message: "Invalid user" });
    }

    const user = await User.findByPk(payload.id);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "User email has been verified" });
    }

    //Mark user as verified
    user.isVerified = true;
    await user.save();

    res.status(200).json({ message: "Email successfully verified" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// const forgotPasswordHandler = async (req, res) => {
//   try {
//   } catch (error) {
//     return res.status(500).json({ message: error.message });
//   }
// };
// const resetPasswordHandler = async (req, res) => {
//   try {
//   } catch (error) {
//     return res.status(500).json({ message: error.message });
//   }
// };


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
    res
      .status(200)
      .json({ id: user.id, fullName: user.fullName, email: user.email });
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
    const user = await User.findOne({ where: { email, isVerified: true } });
    if (!user) {
      return res
        .status(401)
        .json({ message: "Invalid email or Unverified email." });
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

    const jwtToken = res.cookie('jwtToken', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    return res.status(200).json({ jwtToken });
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
    const { fullName, phoneNo, role } = req.body;
    if (typeof id !== "string") {
      res.status(400).json({ message: "Id must be a string" });
      return;
    }
    if (typeof fullName !== "string") {
      res.status(400).json({ message: "First fullName must be a string" });
      return;
    }
    if (typeof phoneNo !== "number") {
      res.status(400).json({ message: "Phone number must be a number" });
      return;
    }
    if (typeof role !== "string") {
      res.status(400).json({ message: "Role must be a string" });
      return;
    } else if (role !== "admin" && role !== "buyer" && role !== "seller") {
      res.status(400).json({
        message: "Role must be either lowercase admin, buyer or seller",
      });
      return;
    }
    const user = await User.findOne({
      where: {
        id: id,
      },
    });
    if (!user) {
      res.status(401).json({ message: "User not found" });
      return;
    }

    user.fullName = fullName;
    user.phoneNo = phoneNo;
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
    const token = req.headers.authorization.split(" ")[1];
    // const user = await User.findOne({
    //   where: {
    //     id: req.user.id,
    //   },
    // });
    // if (!user) {
    //   res.status(401).json({ message: "User not found" });
    //   return;
    // }

    const isBlacklistedToken = await BlackListedToken.create({
      blacklistedToken: token,
    });

    res
      .status(201)
      .json({ message: "Logged out successfully", isBlacklistedToken });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// //Check if token is blacklisted
// const isTokenBlacklisted = (token) => {
//   return blacklistedTokens.includes(token);
// };

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
    // console.error(error)
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createUserHandler,
  resentOtpHandler,
  verifyOtpHandler,
  verifyEmailHandler,
  getUserHandler,
  getUsersHandler,
  loginUserHandler,
  updateUserHandler,
  logOutUserHandler,
  // isTokenBlacklisted,
  deleteUserHandler,
  
  // blacklistedTokens,
};
