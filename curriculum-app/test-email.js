const nodemailer = require('nodemailer');

async function testEmail() {
  const gmailUser = process.env.GMAIL_USER;
  const gmailPass = process.env.GMAIL_APP_PASSWORD;
  
  if (!gmailUser || !gmailPass) {
    console.log("Credentials missing from .env.local");
    return;
  }
  
  console.log("Using user:", gmailUser);
  console.log("Using pass length:", gmailPass.length);

  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: gmailUser,
      pass: gmailPass,
    },
  });

  try {
    let info = await transporter.sendMail({
      from: `"The Career Breweries" <${gmailUser}>`,
      to: gmailUser, // send to self
      subject: "Test from Nodemailer",
      text: "This is a test email.",
    });
    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error("Error sending:", error);
  }
}

testEmail();
