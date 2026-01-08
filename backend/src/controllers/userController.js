import User from "../models/User.js";

/**
 * GET /user/me
 */
export const authMe = async (req, res) => {
  try {
    const user = req.user;
    return res.status(200).json({ user });
  } catch (error) {
    console.error("lỗi khi gọi authMe", error);
    return res.status(500).json({ message: "lỗi hệ thống" });
  }
};

/**
 * GET /user/all  (ADMIN ONLY)
 */
export const getAllUsers = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Không có quyền truy cập" });
    }

    const users = await User.find({
      role: { $ne: "admin" }
    }).select("-hashedPassword -__v");

    return res.status(200).json({ users });
  } catch (error) {
    console.error("lỗi khi gọi getAllUsers", error);
    return res.status(500).json({ message: "lỗi hệ thống" });
  }
};

/**
 * PUT /user/profile
 */
export const updateProfile = async (req, res) => {
    try {
      const userId = req.user._id;
  
      const { displayName, phone, bio, avatarUrl } = req.body;
  
      const updated = await User.findByIdAndUpdate(
        userId,
        { displayName, phone, bio, avatarUrl },
        { new: true }
      ).select("-hashedPassword");
  
      res.status(200).json({
        message: "Cập nhật profile thành công",
        user: updated,
      });
    } catch (error) {
      console.error("updateProfile error", error);
      res.status(500).json({ message: "Lỗi server" });
    }
  };
  

  export const adminUpdateUser = async (req, res) => {
    try {
      const { id } = req.params;
  
      const updated = await User.findByIdAndUpdate(
        id,
        req.body,
        { new: true }
      ).select("-hashedPassword");
  
      if (!updated) return res.status(404).json({ message: "User không tồn tại" });
  
      res.status(200).json({
        message: "Cập nhật user thành công",
        user: updated,
      });
    } catch (error) {
      console.error("adminUpdateUser error", error);
      res.status(500).json({ message: "Lỗi server" });
    }
  };
  
/**
 * DELETE /user/:id  (ADMIN ONLY)
 */
export const deleteUser = async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Không có quyền xoá user" });
      }
  
      const { id } = req.params;
  
      const user = await User.findByIdAndDelete(id);
  
      if (!user) return res.status(404).json({ message: "User không tồn tại" });
  
      return res.status(200).json({ message: "Xóa user thành công" });
    } catch (error) {
      console.error("deleteUser error", error);
      return res.status(500).json({ message: "Lỗi server" });
    }
  };
  export const uploadAvatar = async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "Không có file upload" });
      }
      const avatarUrl = `localhost:5001/uploads/${req.file.filename}`;
  
      const updated = await User.findByIdAndUpdate(
        req.user._id,
        { avatarUrl },
        { new: true }
      ).select("-hashedPassword");
  
      return res.status(200).json({
        message: "Upload avatar thành công",
        avatarUrl,
        user: updated,
      });
    } catch (error) {
      console.error("uploadAvatar error", error);
      return res.status(500).json({ message: "Lỗi server" });
    }
  };
  
  