import mongoose from "mongoose";

export const authMe = async (req, res) => {
    try {
        const user = req.user;
        return await res.status(200).json({user})
    } catch (error) {
        console.error('lỗi khi gọi autMe', error);
        return res.status(500).json({ message: "lỗi hệ thống" });
    }
}