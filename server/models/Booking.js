// models/Booking.js
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const BookingItemSchema = new Schema(
  {
    serviceId: {
      type: Schema.Types.ObjectId,
      ref: "CleaningService",
      required: true,
    },
    title: { type: String, required: true },
    serviceName: { type: String, default: 'washing' },
    price: { type: Number, required: true },
    quantity: { type: Number, default: 1 },
    durationMinutes: { type: Number, default: 0 },
    addons: [{ name: String, price: Number }],
  },
  { _id: false }
);

const BookingSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  cartItems: [BookingItemSchema],
  totalAmount: { type: Number, required: true },
  payableAmount: { type: Number, required: true }, // after discounts/taxes
  currency: { type: String, default: "INR" },
  address: {
    name: String,
    phone: String,
    line1: String,
    line2: String,
    city: String,
    pincode: String,
    lat: Number,
    lng: Number,
  },
  scheduledAt: { type: Date, required: true },
  branchId: { type: Schema.Types.ObjectId, ref: "Branch" },
  providerId: { type: Schema.Types.ObjectId, ref: "Provider" },
  payment: {
    status: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    method: { type: String }, // e.g., razorpay, cod
  },
  status: {
    type: String,
    enum: ["created", "confirmed", "in-progress", "completed", "cancelled"],
    default: "created",
  },
  notes: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

BookingSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model("Booking", BookingSchema);
