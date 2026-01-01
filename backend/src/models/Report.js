import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
    {
        reporterId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        reportedUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        reason: { type: String, required: true },
        timestamp: { type: Date, default: Date.now }
    },
    { timestamps: true }
);

export default mongoose.model("Report", reportSchema);
