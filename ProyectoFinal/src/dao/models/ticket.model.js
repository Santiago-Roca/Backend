import mongoose from "mongoose";

const collection = "Ticket";

const schema = new mongoose.Schema(
    {
        code: Number,
        amount: Number,
        purchaser: String,
    },
    { timestamps: { createdAt: "purchase_datetime", updatedAt: "updated_at" } }
);

const ticketModel = mongoose.model(collection, schema);
export default ticketModel;
