import mongoose from "mongoose";

const emergencyLogSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false }, // optional if guest
        location: {
            lat: { type: Number, required: true },
            lng: { type: Number, required: true },
            city: { type: String }
        },
        timestamp: { type: Date, default: Date.now }
    },
    { timestamps: true }
);

export default mongoose.model("EmergencyLog", emergencyLogSchema);
