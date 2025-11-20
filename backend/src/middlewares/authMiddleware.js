import jwt from "jsonwebtoken"
import User from "../models/User.js"

export const protectedRoute = async (req, res, next) => {
    try {
        //lấy token từ header
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({message: "Không tìm thấy access token"})
        }

        //xác nhận token hợp lệ
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decodedUser) => {
            if (err) {
                console.error(err);

                return res.status(403).json({ message: "Access token hết hạn hoặc không đúng" });
            }

            const user = await User.findById(decodedUser.userId).select('-hashedPassword');
        
            if (!user) {
                return res.status(404).json({ message: "user không tồn tại" });
            }

            //trả user về trong req
            req.user = user;

            next();
        })
        //tìm user
        

    } catch (error) {
        
    }
}