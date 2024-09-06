import nodemailer from 'nodemailer';

export const sendEmail = async (to: string, subject: string, text: string) => {
  // Create a test account
  // const testAccount = await nodemailer.createTestAccount();

  // Create a transporter object using the Ethereal SMTP transport
  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'faustino60@ethereal.email', // generated ethereal user
      pass: '72GEgycercZYprz1sp', // generated ethereal password
    },
  });

  // Define email options
  const mailOptions = {
    from: '"Blockchain Price Tracker" <no-reply@example.com>', // sender address
    to, // list of receivers
    subject, // Subject line
    text, // Plain text body
  };

  try {
    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully!');
    console.log('Message ID:', info.messageId);

    // Preview URL for testing
    console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Error sending email:', error);
  }
};
