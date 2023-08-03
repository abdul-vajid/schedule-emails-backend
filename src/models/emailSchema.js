import mongoose from "mongoose";


const emailSchema = new mongoose.Schema({
    toEmail: {
        type: String,
        required: true,
    },
    subject: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    scheduledAt: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ["pending", "sent", "failed"],
        default: "pending",
    },
},
    {
        timestamps: true,
        description: "This schema defines the structure for scheduling emails.",
        version: 1,
        indexes: [
            {
                name: "scheduled",
                index: {
                    scheduledAt: 1,
                },
                unique: false,
            },
        ],
    }
);

export default mongoose.model('Email', emailSchema);
