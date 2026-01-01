import mongoose from "mongoose";

const travelPlanSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        city: { type: String, required: true },
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        genderPreference: {
            type: String,
            enum: ["female-only", "all"],
            default: "all"
        },
        isActive: { type: Boolean, default: true }
    },
    { timestamps: true }
);

export default mongoose.model("TravelPlan", travelPlanSchema);
