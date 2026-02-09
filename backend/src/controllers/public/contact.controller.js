const contactService = require("../../services/public/contact.service");

//* Create a new contact message
const createMessage = async (req, res) => {
  const { name, email, phone, message } = req.body;

  if (!name || !message || (!email && !phone)) {
    return res.status(400).json({
      success: false,
      message: "Name, message and email or phone are required",
    });
  }

  try {
    const newMessage = await contactService.createContactMessage({
      name,
      email,
      phone: phone || null,
      message,
    });

    res.status(201).json({
      success: true,
      message: "Message received successfully",
      data: newMessage,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

//* Get all messages
const getAllMessages = async (req, res) => {
  try {
    const messages = await contactService.getAllContactMessages();
    res.status(200).json({ success: true, data: messages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get a message by ID
const getMessageById = async (req, res) => {
  const { id } = req.params;
  try {
    const message = await contactService.getContactMessageById(id);
    if (!message) {
      return res
        .status(404)
        .json({ success: false, message: "Message not found" });
    }
    res.status(200).json({ success: true, data: message });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

//? Update message by ID
const updateMessage = async (req, res) => {
  const { id } = req.params;
  const { name, email, message } = req.body;

  try {
    const updated = await contactService.updateContactMessage(id, {
      name,
      email,
      message,
    });
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Server error or message not found" });
  }
};

//! Delete message by ID
const deleteMessage = async (req, res) => {
  const { id } = req.params;
  try {
    await contactService.deleteContactMessage(id);
    res
      .status(200)
      .json({ success: true, message: "Message deleted successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Server error or message not found" });
  }
};

module.exports = {
  createMessage,
  getAllMessages,
  getMessageById,
  updateMessage,
  deleteMessage,
};
