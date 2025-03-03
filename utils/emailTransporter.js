// const config = require("../config/config");
// const nodemailer = require("nodemailer");

// //Send verification email
// const sendVerificationEmail = async (email, token) => {
//   const transporter = nodemailer.createTransport({
//     host: config.email.host,
//     port: config.email.port,
//     secure: false, //Set to false for ports other than 487
//     auth: {
//       user: config.email.user, //Admin/company email
//       pass: config.email.password, //Gmail app address
//     },
//   });

//   const verificationUrl = `${config.email.baseUrl}/verify-email/${token}`;

//   const mailOptions = {
//     from: config.email.user, //Sender email
//     to: email, //Reciepent email
//     subject: "Verify Email",
//     html: `
//         <h1>Thank you for signing up on our platform</h1>
//         <p>Please click the link below to verify your email address:</p>
//         <a href='${verificationUrl}'>Verify Email</a>
//     `,
//   };

//   try {
    
//     const sendEmail = await transporter.sendMail(mailOptions);
//     console.log('Verififcatiion email sent', sendEmail)
//   } catch (error) {
//     console.log('Error sending email', error)
//   }
// };

// module.exports={sendVerificationEmail}
