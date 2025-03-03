const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../../models/User");
const config = require("../../config/config");
const ParseInt = require('body-parser')

const requestPasswordRestHandler = async (req,res)=>{
    try {
        const {email}=req.body
        //Check if email exists
        const user = await User.findOne({
            where:{
                email:email
            }
        })
        if(!user){
            return res.status(401).json({message:'Email does not exist'})
        }

        //Generate reset token
        const token = jwt.sign({id:user.id}, config.jwtSecret, {expiresIn: config.email.resetTokenEpiration})

        //Send reset email
        const transporter = nodemailer.createTransport({
            host:config.email.host,
            port:config.email.port,
            secure:false,
            auth:{
                user:config.email.user,
                pass:config.email.password
            }
        })

        const resetUrl = `${req.protocol}://${req.get('host')}/v1/resetPassword/reset-password/${token}`

        await transporter.sendMail({
            from: `'Support Team' <${config.email.user}`,
            to: user.email,
            subject: 'Password Reset Request',
            text: `You requested a password reset. Click the link to reset your password: ${resetUrl}`,
            html:`
                <p> You requested a password reset. Click the link below to reset your password:</p>
                <a href="${resetUrl}">${resetUrl}</a>
            `
        })
        res.status(200).json({message:'Reset email sent successfully'})
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}