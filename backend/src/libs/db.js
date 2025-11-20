import mongoose from "mongoose"

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_CONNECTIONSTRING);
        console.log("liên kết CSDL thành công");
    } catch (error) {
        console.log("lỗi khi kết lối csdl", error);
        process.exit(1);
    }
}