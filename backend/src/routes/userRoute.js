import express from "express";
import {
  authMe,
  getAllUsers,
  updateProfile,
    adminUpdateUser,
    deleteUser
} from "../controllers/userController.js";
import { protectedRoute } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/uploadMiddleware.js";
import { uploadAvatar } from "../controllers/userController.js";


const router = express.Router();

// login required cho tất cả
router.use(protectedRoute);

router.get("/me", authMe);
router.get("/all", getAllUsers);

// upload avatar
router.put(
  "/upload-avatar",
  (req, res, next) => {
    upload.single("avatar")(req, res, function (err) {
      if (err) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({ message: "Ảnh quá lớn (tối đa 2MB)" });
        }
        return res.status(400).json({ message: err.message });
      }
      next();
    });
  },
  uploadAvatar
);


// update profile user hiện tại
router.put("/profile", updateProfile);

// ADMIN routes
router.delete("/:id", deleteUser);
router.put("/:id", adminUpdateUser);

export default router;
