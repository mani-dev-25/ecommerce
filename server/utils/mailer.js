const nodemailer = require('nodemailer');

// Helper to create the mail transporter based on environment configuration
const createTransporter = () => {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || '587');
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    return null; // No SMTP configuration, use console logging fallback
  }

  return nodemailer.createTransport({
    host: host || 'smtp.gmail.com',
    port: port,
    secure: port === 465, // true for 465, false for other ports
    auth: {
      user: user,
      pass: pass
    }
  });
};

/**
 * Sends a premium-styled OTP email or logs it to the server console if SMTP credentials are missing.
 * @param {string} email - Destination email address
 * @param {string} otp - The 6-digit OTP code
 * @returns {Promise<boolean>} True if sent via email, false if fallback to console
 */
async function sendOtpEmail(email, otp) {
  const transporter = createTransporter();
  const brandName = 'Vynex Premium';
  const accentColor = '#ff6b00'; // Brand orange

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Email Verification</title>
      <style>
        body {
          font-family: 'Plus Jakarta Sans', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          background-color: #f5f5f5;
          margin: 0;
          padding: 0;
          -webkit-font-smoothing: antialiased;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          background: #ffffff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
        }
        .header {
          background-color: #111111;
          padding: 30px 40px;
          text-align: center;
        }
        .logo {
          color: #ffffff;
          font-size: 24px;
          font-weight: 700;
          letter-spacing: 2px;
          text-decoration: none;
        }
        .logo span {
          color: ${accentColor};
        }
        .content {
          padding: 40px;
          color: #333333;
          line-height: 1.6;
        }
        .headline {
          font-size: 20px;
          font-weight: 700;
          color: #111111;
          margin-top: 0;
          margin-bottom: 20px;
        }
        .otp-container {
          background-color: #f9f9f9;
          border: 1px solid #eeeeee;
          border-radius: 8px;
          padding: 24px;
          text-align: center;
          margin: 30px 0;
        }
        .otp-code {
          font-size: 36px;
          font-weight: 800;
          letter-spacing: 8px;
          color: #111111;
          margin: 0;
        }
        .footer {
          background-color: #f9f9f9;
          padding: 24px 40px;
          text-align: center;
          font-size: 12px;
          color: #888888;
          border-top: 1px solid #eeeeee;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <a class="logo" href="#">VY<span>NEX</span></a>
        </div>
        <div class="content">
          <h2 class="headline">Verify Your Email Address</h2>
          <p>Thank you for registering with Vynex. To complete your registration and secure your account, please enter the 6-digit verification code below on the signup page:</p>
          
          <div class="otp-container">
            <h1 class="otp-code">${otp}</h1>
          </div>
          
          <p style="margin-bottom: 0;">This OTP is valid for the next <strong>5 minutes</strong>. If you did not request this code, please ignore this email or contact security support.</p>
        </div>
        <div class="footer">
          &copy; 2026 Vynex Premium Inc. All rights reserved. <br>
          This is an automated security message. Please do not reply directly.
        </div>
      </div>
    </body>
    </html>
  `;

  if (!transporter) {
    // Print styled OTP in server console
    console.log('\n┌────────────────────────────────────────────────────────┐');
    console.log(`│               ${brandName.toUpperCase()} VERIFICATION               │`);
    console.log('├────────────────────────────────────────────────────────┤');
    console.log(`│ Email:  ${email.padEnd(46)} │`);
    console.log(`│ Code:   ${otp.padEnd(46)} │`);
    console.log(`│ Mode:   ${'Console Log (SMTP Not Configured)'.padEnd(46)} │`);
    console.log('└────────────────────────────────────────────────────────┘\n');
    return false;
  }

  try {
    await transporter.sendMail({
      from: `"${brandName}" <${process.env.SMTP_USER}>`,
      to: email,
      subject: `[${brandName}] Email Verification Code: ${otp}`,
      html: htmlContent
    });
    console.log(`[SMTP] OTP sent successfully to ${email}`);
    return true;
  } catch (err) {
    console.error(`[SMTP] Failed to send email to ${email}:`, err.message);
    
    // Fail-safe fallback to console
    console.log('\n┌────────────────────────────────────────────────────────┐');
    console.log(`│               ${brandName.toUpperCase()} VERIFICATION               │`);
    console.log('├────────────────────────────────────────────────────────┤');
    console.log(`│ Email:  ${email.padEnd(46)} │`);
    console.log(`│ Code:   ${otp.padEnd(46)} │`);
    console.log(`│ Mode:   ${'Console Log Fallback (SMTP Failed)'.padEnd(46)} │`);
    console.log('└────────────────────────────────────────────────────────┘\n');
    return false;
  }
}

module.exports = {
  sendOtpEmail
};
