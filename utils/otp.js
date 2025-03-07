const crypto_1 = require("crypto");
const { Op } = require("sequelize");
const sequelize = require("../db");
const Otp_1 = require("../models/Otp");
const User = require("../models/User");

const createOtp = () => {
  return Math.floor(1000 + Math.random() * 900000).toString();
};

const sendOtp = async (userId) => {
  try {
    const otp = createOtp();
    const hashedOTP = crypto_1.createHash("sha256").update(otp).digest("hex");
    const expireAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
    expireAt.setMilliseconds(0);
    const insertAndUpdateOtpHandler = await Otp_1.upsert(
      {
        UserId: userId,
        otpCode: hashedOTP,
        expiresAt: expireAt,
        isUsed: false,
      },
      {
        conflictFields: ["id"], // The unique column to check for conflicts
        updateOnDuplicate: ["otpCode", "expiresAt", "isUsed"],
      }
    );
    if (!insertAndUpdateOtpHandler) {
      return { createOtpErrorMessage: "Unable to create OTP" };
    }
    return { sentOtpMessage: "OTP created successfully", otp };
  } catch (error) {
    return { message: error.message };
  }
};

const resendOtp = async (userEmail) => {
  try {
    const user = await User.findOne({ where: { email: userEmail } });
    if (!user) {
      return {
        resendOtpErrorMessage: "Unable to resend otp. User does not exist",
      };
    }
    return user;
  } catch (error) {
    return { message: error.message };
  }
};

const verifyOtp = async (otp) => {
  try {
    const hashedOTP = crypto_1.createHash("sha256").update(otp).digest("hex");
    const now = new Date();
    now.setMilliseconds(0);
    const result = await Otp_1.findOne({
      attributes: [
        [sequelize.col("User.id"), "userId"],
        [sequelize.col("User.fullName"), "userFullname"],
        [sequelize.col("User.email"), "email"],
        ["expiresAt", "expiresAt"],
      ],
      include: [
        {
          model: User, // Sequelize model for users
          as: "User", // Alias to match column reference in attributes
          required: true, // INNER JOIN instead of LEFT JOIN
          // on: {
          //   userId: sequelize.col("User.id"),
          // },
        },
      ],
      where: {
        otpCode: hashedOTP,
        isUsed: false,
        expiresAt: { [Op.gte]: now }, // expires_at >= now
      },
    });

    // console.log("ResultLength:", result);

    if (!result) {
      return { otpErrorMessage: "Invalid or expired OTP" };
    }
    // console.log("Result:", result);
    const userIdValue = result.get("userId");
    console.log("Result:", userIdValue);

    const verifiedOtp = await Otp_1.update(
      {
        otpCode: "", // Clear the OTP code
        isUsed: true, // Mark as used
      },
      {
        where: {
          UserId: userIdValue, // Find user by ID
        },
        returning: true, // Returns the updated record(s) (PostgreSQL only)
      }
    );

    // Find the user being verified
    return verifiedOtp;
  } catch (error) {
    console.error("Error in verifying otp:", error);
    return { message: error.message };
  }
};

module.exports = { sendOtp, resendOtp, verifyOtp };
