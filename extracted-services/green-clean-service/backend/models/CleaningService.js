// models/CleaningService.js
import mongoose from "mongoose";
import slugify from "slugify";

const Schema = mongoose.Schema;

const AddonSchema = new Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, default: 0 },
    description: { type: String },
  },
  { _id: false }
);

const CleaningServiceSchema = new Schema({
  title: { type: String, required: true, index: true },
  serviceName: { type: String, index: true, default: 'washing' },
  slug: { type: String, unique: true, index: true },
  shortDescription: { type: String, required: true },
  longDescription: { type: String },
  category: { type: String, required: true, index: true }, // e.g., home-cleaning, sofa-carpet
  subcategory: { type: String }, // optional
  images: [{ type: String }], // hosted URLs (CDN/Unsplash/S3)
  features: [{ type: String }],
  basePrice: { type: Number, required: true },
  priceRange: {
    min: { type: Number },
    max: { type: Number },
  },
  durationMinutes: { type: Number, default: 60 }, // estimated time
  addons: [AddonSchema],
  tags: [{ type: String, index: true }],
  branchIds: [{ type: Schema.Types.ObjectId, ref: "Branch" }],
  providerIds: [{ type: Schema.Types.ObjectId, ref: "Provider" }],
  rating: {
    avg: { type: Number, default: 0 },
    count: { type: Number, default: 0 },
  },
  active: { type: Boolean, default: true, index: true },
  sortOrder: { type: Number, default: 1000 },
  meta: {
    seoTitle: String,
    seoDescription: String,
  },
  cancellationPolicy: {
    description: String,
    hoursBefore: { type: Number, default: 24 },
    refundPercent: { type: Number, default: 100 },
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// pre-save slug
CleaningServiceSchema.pre("save", function (next) {
  if (!this.slug && this.title) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  this.updatedAt = new Date();
  next();
});

// text index for search
CleaningServiceSchema.index({
  title: "text",
  shortDescription: "text",
  longDescription: "text",
  tags: "text",
});

export default mongoose.model("CleaningService", CleaningServiceSchema);
