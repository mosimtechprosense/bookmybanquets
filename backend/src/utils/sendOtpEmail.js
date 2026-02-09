const { transporter } = require("../config/email.js");

const sendOtpEmail = async ({ to, otp, purpose }) => {
  const subjectMap = {
    ADMIN_LOGIN: "Admin Login OTP",
    PASSWORD_RESET: "Password Reset OTP",
    FIRST_TIME_SETUP: "Complete Your Account Setup",
  };

  const titleMap = {
    ADMIN_LOGIN: "Admin Login Verification",
    PASSWORD_RESET: "Reset Your Password",
    FIRST_TIME_SETUP: "Set Up Your Account",
  };

  await transporter.sendMail({
    from: `"BookMyBanquets" <${process.env.EMAIL_USER}>`,
    to,
    subject: subjectMap[purpose] || "Your OTP",
    html: `
      <div style="
        max-width: 600px;
        margin: auto;
        font-family: Inter, Arial, sans-serif;
        background: #ffffff;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.08);
        overflow: hidden;
      ">
        <!-- Header -->
        <div style="background: #dc2626; padding: 20px;">
          <h2 style="color: #ffffff; margin: 0; font-size: 22px;">
            BookMyBanquets
          </h2>
        </div>

        <!-- Body -->
        <div style="padding: 24px;">
          <p style="font-size: 16px; color: #374151; line-height: 1.6;">
            ${titleMap[purpose]}
          </p>

          <p style="font-size: 14px; color: #4b5563; margin-top: 16px;">
            Use the OTP below to continue. This OTP is valid for
            <strong>10 minutes</strong>.
          </p>

          <div style="
            margin: 32px 0;
            text-align: center;
          ">
            <div style="
              display: inline-block;
              background: #f9fafb;
              padding: 18px 32px;
              border-radius: 10px;
              font-size: 28px;
              letter-spacing: 6px;
              font-weight: 600;
              color: #111827;
            ">
              ${otp}
            </div>
          </div>

          <p style="font-size: 14px; color: #6b7280;">
            If you did not request this, you can safely ignore this email.
          </p>
        </div>

        <!-- Footer -->
        <div style="
          padding: 16px;
          text-align: center;
          font-size: 12px;
          color: #6b7280;
          background: #f3f4f6;
        ">
          This email was sent from the BookMyBanquets platform.<br/>
          Please do not reply directly to this email.
        </div>
      </div>
    `,
  });
};

module.exports = {
  sendOtpEmail,
};
