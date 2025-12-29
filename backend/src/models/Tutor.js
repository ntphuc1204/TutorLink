import mongoose from "mongoose"

const tutorSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    bio: String,
    experienceYears: Number,
    hourlyRate: Number,
    subjects: [String],
    verified: { type: Boolean, default: false },
}, {
    timestamps: true,
});

tutorSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model('Tutor', tutorSchema)