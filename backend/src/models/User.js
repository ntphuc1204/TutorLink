import mongoose from "mongoose";

const options = {
  timestamps: true,
  discriminatorKey: "role",
};

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, trim: true, lowercase: true },
    hashedPassword: { type: String, required: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    displayName: { type: String, required: true, trim: true },
    avatarUrl: String,
    bio: { type: String, maxlength: 500 },
    phone: { type: String, sparse: true },
  
    role: {
      type: String,
      enum: ["student", "teacher", "admin"],
      default: "student"
    }
  
  }, { timestamps: true });
  

const User = mongoose.model("User", userSchema);
export default User;

const studentSchema = new mongoose.Schema({
    className: String,
    parentPhone: String,
  });
  
export const Student = User.discriminator("student", studentSchema);


const teacherSchema = new mongoose.Schema({
    subjects: [String],
    experienceYears: Number,
  });
  
export const Teacher = User.discriminator("teacher", teacherSchema);

const adminSchema = new mongoose.Schema({
    permissions: [String],
  });
  
export const Admin = User.discriminator("admin", adminSchema);
  