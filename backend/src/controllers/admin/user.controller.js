const {
  createUser,
  listUsers,
  updateUser,
  deleteUser,
  adminResetPassword,
  getUserById,
} = require("../../services/admin/user.service");

const createUserController = async (req, res) => {
  try {
    const user = await createUser(req.body);
    res.json({ message: "User created & OTP sent", user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const listUsersController = async (req, res) => {
  try {
    const currentRole = req.user.role;
    const users = await listUsers(currentRole);
    res.json(users);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updateUserController = async (req, res) => {
  const { id } = req.params;
  await updateUser(id, req.body);
  res.json({ message: "User updated" });
};

const deleteUserController = async (req, res) => {
  const { id } = req.params;
  await deleteUser(id);
  res.json({ message: "User deleted" });
};

const getUserByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await getUserById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

const adminResetPasswordController = async (req, res) => {
  try {
    const { id } = req.params;
    const { password } = req.body;

    if (!password || password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    await adminResetPassword(BigInt(id), password);
    res.json({ message: "Password reset successfully" });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

module.exports = {
  createUserController,
  listUsersController,
  updateUserController,
  deleteUserController,
  getUserByIdController,
  adminResetPasswordController,
};
