const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: 'falisqueen884@gmail.com',  
    pass: 'wefnpzlfgzddwjia',  // Use your generated app password here
  },
});


const sendEmail = async (to, subject, text) => {
  const mailOptions = {
    from: 'your-email@gmail.com',
    to,
    subject,
    text,
  };

  // Log the email details before sending
  console.log("Sending email with the following details:", mailOptions);

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully!');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};


module.exports = { sendEmail };
