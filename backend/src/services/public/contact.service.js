const prisma = require("../../config/db.js");
const { transporter } = require("../../config/email.js");


//* Create contact message + send email
const createContactMessage = async ({ name, email, phone, message }) => {

  // Decide form type
  const isContactForm = Boolean(email && email.trim());
  const formType = isContactForm ? "contact form" : "discount form";

  // Dummy email for DB only (for discount from process)
  const prismaEmail = isContactForm ? email : "no-reply@bookmybanquets.in";

  // Save message to database
  const savedMessage = await prisma.contactmessage.create({
    data: { name, email: prismaEmail, phone, message }
  });


  // Labels for the email
  const emailLabelKey = isContactForm ? "Email" : "Phone";
  const emailLabelValue = isContactForm ? email : phone;


  // Send email to admin
  await transporter.sendMail({
    from: `"BookMyBanquets" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    replyTo: isContactForm ? email : process.env.EMAIL_USER,
    subject: `New ${formType} submission`,
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
    <div style="background: #dc2626; padding: 20px;">
      <h2 style="color: #ffffff; margin: 0; font-size: 22px;">
        BookMyBanquets
      </h2>
    </div>

    <div style="padding: 24px;">
      <p style="font-size: 16px; color: #374151; line-height: 1.6;">
           You’ve received a new message via the <strong>${formType}</strong>.
      </p>

      <div style="margin-top: 24px;">
        <p style="font-size: 14px; margin: 6px 0;">
          <strong>Name:</strong> ${name}
        </p>

        <p style="font-size: 14px; margin: 6px 0;">
          <strong>${emailLabelKey}:</strong> ${emailLabelValue}
        </p>

        <p style="font-size: 14px; margin: 16px 0 8px;">
          <strong>Message:</strong>
        </p>

        <div style="
          background: #f9fafb;
          padding: 18px;
          border-radius: 8px;
          line-height: 1.7;
          color: #111827;
          font-size: 18px;
        ">
          ${message}
        </div>
      </div>
    </div>

    <div style="
      padding: 16px;
      text-align: center;
      font-size: 12px;
      color: #6b7280;
      background: #f3f4f6;
    ">
      This message was sent from the BookMyBanquets website.<br/>
      Please do not reply directly to this email.
    </div>
  </div>
`}
  );

  return savedMessage;
};


//* Get all messages
const getAllContactMessages = async () => {
  return prisma.contactmessage.findMany({
    orderBy: { createdAt: "desc" }
  });
};


//* Get message by ID
const getContactMessageById = async (id) => {
  return prisma.contactmessage.findUnique({
    where: { id: parseInt(id) }
  });
};


//? Update message
const updateContactMessage = async (id, data) => {
  return prisma.contactmessage.update({
    where: { id: parseInt(id) },
    data
  });
};


//! Delete message
const deleteContactMessage = async (id) => {
  return prisma.contactmessage.delete({
    where: { id: parseInt(id) }
  });
};


module.exports = {
  createContactMessage,
  getAllContactMessages,
  getContactMessageById,
  updateContactMessage,
  deleteContactMessage
};
