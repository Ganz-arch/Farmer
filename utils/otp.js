const crypto_1 = require("crypto");
const { Op } = require("sequelize");
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
      throw new Error("Unable to create OTP");
    }
    return { message: "OTP created successfully", otp };
  } catch (error) {
    return { message: error.message };
  }
};

const resendOtp = async (userEmail) => {
  try {
    const user = await User.findOne({ where: { email: userEmail } });
    return user;
  } catch (error) {
    return { message: error.message };
  }
};

const verifyOtp = async (otp) => {
  try {
    const hashedOTP = crypto_1.default
      .createHash("sha256")
      .update(otp)
      .digest("hex");
    const now = new Date();
    now.setMilliseconds(0);
    const result = await Otp_1.findOne({
      attributes: [
        [Sequelize.col("UserTable.id"), "userId"],
        [Sequelize.col("UserTable.fullName"), "username"],
        [Sequelize.col("UserTable.email"), "email"],
        ["expiresAt", "expiresAt"],
      ],
      include: [
        {
          model: User, // Sequelize model for users
          as: "UserTable", // Alias to match column reference in attributes
          required: true, // INNER JOIN instead of LEFT JOIN
          on: {
            userId: Sequelize.col("UserTable.id"),
          },
        },
      ],
      where: {
        otp_code: hashedOTP,
        is_used: false,
        expires_at: { [Op.lte]: now }, // expires_at <= now
      },
      limit: 1,
    });
    if (result.length === 0) {
      throw new Error("Invalid or expired OTP");
    }
    await Otp_1.update(
      {
        otpCode: "", // Clear the OTP code
        isUsed: true, // Mark as used
      },
      {
        where: {
          userId: result[0].id, // Find user by ID
        },
        returning: true, // Returns the updated record(s) (PostgreSQL only)
      }
    );

    // Find the user being verified
    return result[1][0]; // `result[1]` contains the updated rows
  } catch (error) {
    console.error("Error in verifying otp:", error);
    return { message: error.message };
  }
};

module.exports = { sendOtp, resendOtp, verifyOtp };
