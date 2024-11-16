require('dotenv').config();
const nodeMailer = require('nodemailer');


const transporter = nodeMailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendingMail = (email,otp)=> {
    transporter.sendMail({
        from: process.env.EMAIL_USER,
            to: email,
            subject: "Your Otp for login",
            text: `Use the follwoing otp to login : ${otp}`
        }
    )
}


module.exports = {transporter, sendingMail}