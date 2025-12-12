// models/VehicleCheckupBooking.js
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const AddOnSchema = new Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
  },
  { _id: false }
);

const VehicleCheckupBookingSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  vehicleType: {
    type: String,
    enum: ["bike", "car"],
    required: true,
  },
  packageType: {
    type: String,
    enum: ["basic", "comprehensive"],
    required: true,
  },
  packageName: { type: String, required: true },
  serviceName: { type: String, default: 'checkup' },
  basePrice: { type: Number, required: true },
  addOns: [AddOnSchema],
  totalAmount: { type: Number, required: true },
  payableAmount: { type: Number, required: true },
  currency: { type: String, default: "INR" },
  vehicleDetails: {
    make: String,
    model: String,
    year: Number,
    registrationNumber: String,
  },
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
  scheduledDate: { type: Date, required: true },
  scheduledTime: String,
  assignedEmployee: {
    type: Schema.Types.ObjectId,
    ref: "Employee",
  },
  inspectionReport: {
    reportUrl: String,
    findings: [
      {
        category: String,
        item: String,
        status: {
          type: String,
          enum: ["good", "attention", "critical"],
        },
        notes: String,
        imageUrls: [String],
      },
    ],
    recommendations: String,
    completedAt: Date,
  },
  payment: {
    status: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    method: String,
    transactionId: String,
  },
  status: {
    type: String,
    enum: [
      "pending",
      "confirmed",
      "assigned",
      "in-progress",
      "inspection-completed",
      "report-generated",
      "completed",
      "cancelled",
    ],
    default: "pending",
  },
  notes: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

VehicleCheckupBookingSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model(
  "VehicleCheckupBooking",
  VehicleCheckupBookingSchema
);
