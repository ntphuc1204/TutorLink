import bcrypt from "bcrypt"
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import Session from "../models/Session.js";

const ACCESS_TOKEN_TTL = "30m";
const REFRESH_TOKEN_TTL = 14*24*60*60*1000;
export const signUp = async (req, res) => {
    try {
      const { username, password, email, firstName, lastName, role } = req.body;
  
      if (!username || !password || !email || !firstName || !lastName) {
        return res.status(400).json({
          message: "không thể thiếu username, password, email, firstName, lastName",
        });
      }
  
      const duplicate = await User.findOne({ username });
      if (duplicate) {
        return res.status(409).json({ message: "username đã tồn tại" });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // validate role (chỉ chấp nhận 3 loại)
      const allowedRoles = ["student", "teacher", "admin"];
      const finalRole = allowedRoles.includes(role) ? role : "student";
  
      await User.create({
        username,
        hashedPassword,
        email,
        displayName: `${firstName} ${lastName}`,
        role: finalRole,
      });
  
      return res.sendStatus(204);
  
    } catch (error) {
      console.error("lỗi khi gọi signUp", error);
      return res.status(500).json({ message: "lỗi hệ thống" });
    }
  };
  
export const signIn = async (req, res) => {
    try {
        // lấy inputs
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: "thiếu username hoặc password" });
        }

        // lấy hashedPassword trong db để so với password input
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(401).json({message:"username hoặc password không chính xác"})
        }

        // kiểm tra password
        const passwordCorrect = await bcrypt.compare(password, user.hashedPassword);

        if (!passwordCorrect) {
            return res.status(401).json({ message: "username hoặc password không chính xác" });
        }

        // nếu khớp, tạo accessToken với JWT
        const accessToken = jwt.sign({userId: user._id}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: ACCESS_TOKEN_TTL})

        // tạo refresh token
        const refreshToken = crypto.randomBytes(64).toString('hex');

        // tạo session mới để lưu refresh token
        await Session.create({
            userId: user._id,
            refreshToken,
            expireAt: new Date(Date.now()+ REFRESH_TOKEN_TTL)
        })

        // trả refresh token về trong cookie

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: REFRESH_TOKEN_TTL,
        })

        // trả access token về trong res
        return res.status(200).json({message: `User ${user.displayName} đã logged in`, accessToken})
    } catch (error) {
        console.error('lỗi khi gọi signIn', error);
        return res.status(500).json({ message: "lỗi hệ thống" });
    }
}
export const signOut = async (req, res) => {
    try {
        //lấy ra refresh token trong cookie
        const token = req.cookies?.refreshToken;

        
        if (token) {
            //xóa refresh token trong Session
            await Session.deleteOne({ refreshToken: token });

            //Xóa cookie
            res.clearCookie("refreshToken");
        }

        return res.sendStatus(204);
    } catch (error) {
        console.error('lỗi khi gọi signOut', error);
        return res.status(500).json({ message: "lỗi hệ thống" });
    }
}
// tạo access token mới dựa trên refresh token
export const refreshToken = async (req, res) => { 
    try {
        //lấy ra refresh token trong cookie
        const token = req.cookies?.refreshToken;
        if(!token){
            return res.status(401).json({message: "không tìm thấy token"})
        }

        //so với refresh token trong db
        const session = await Session.findOne({ refreshToken: token });
        if(!session){
            return res.status(403).json({message: "token không hợp lệ"})
        }

        //kiểm tra hết hạn
        if(session.expireAt < new Date()){
            return res.status(403).json({message: "token đã hết hạn"})
        }

        //tạo access token mới
        const accessToken = jwt.sign(
            { userId: session.userId },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: ACCESS_TOKEN_TTL }
        );

        //return access token mới
        return res.status(200).json({ accessToken });

    } catch (error) {
        console.error('lỗi khi gọi refreshToken', error);
        return res.status(500).json({ message: "lỗi hệ thống" });
    }
}