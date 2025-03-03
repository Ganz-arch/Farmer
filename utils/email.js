"use strict";

const nodemailer_1 = require("nodemailer");
const config = require('../config/config')
// Create a transporter
const transporter = nodemailer_1.createTransport({
    service: 'gmail',
    auth: {
        user: config.email.user,
        pass: config.email.password,
    },
});
// Verify the connection configuration
transporter.verify((error, success) => {
    if (error) {
        console.error('Error setting up transporter:', error);
    }
    else {
        console.log('Mail transporter configured successfully:', success);
    }
});
// Function to send emails
const sendEmail = async (emailOptions) => {
    try {
        const { to, subject, text, html } = emailOptions;
        const mailOptions = {
            from: config.email.user,
            to: emailOptions.to,
            subject: emailOptions.subject,
            text: emailOptions.text,
            html: emailOptions.html,
        };
        const info = await transporter.sendMail(mailOptions);
    }
    catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send email');
    }
};
module.exports= sendEmail;

//email functions
