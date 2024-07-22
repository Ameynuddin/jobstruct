// const nodemailer = require('nodemailer')
// const dotenv = require('dotenv');

// dotenv.config({ path: './config.env' });

// const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   port: 587,
//   secure: false, // Use `true` for port 465, `false` for all other ports
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS
//   },
// });

// // async..await is not allowed in global scope, must use a wrapper
// async function sendMail(to, subject, text, html) {
//   try {
//     // send mail with defined transport object
//     const info = await transporter.sendMail({
//       from: `JobTrack <${process.env.EMAIL_USER}>`, // sender address
//       to,
//       subject,
//       text,
//       html,
//     });

//     console.log(`Email sent: ${info.messageId}`);
//     return info;
//   } catch (error) {
//     console.error('Error sending email:', error);
//     throw error;
//   }
// }

// module.exports = { sendMail }
