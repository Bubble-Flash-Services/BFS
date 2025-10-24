import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      maxlength: 20,
    },
    name: {
      type: String,
      required: true,
      maxlength: 100,
    },
    description: {
      type: String,
      maxlength: 500,
    },
    discountType: {
      type: String,
      enum: ["percentage", "fixed"],
      required: true,
    },
    discountValue: {
      type: Number,
      required: true,
      min: 0,
    },
    minimumOrderAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    maximumDiscountAmount: {
      type: Number,
      min: 0,
    },
    couponType: {
      type: String,
      enum: [
        "welcome",
        "festival_seasonal",
        "referral",
        "loyalty",
        "minimum_order",
        "limited_time",
        "service_specific",
      ],
      required: true,
    },
    targetAudience: {
      type: String,
      enum: ["new_customers", "existing_customers", "all_customers"],
      default: "all_customers",
    },
    autoApply: {
      type: Boolean,
      default: false,
    },
    showOnHomepage: {
      type: Boolean,
      default: false,
    },
    priority: {
      type: Number,
      default: 1,
      min: 1,
      max: 10,
    },
    validFrom: {
      type: Date,
      required: true,
    },
    validUntil: {
      type: Date,
      required: true,
    },
    usageLimit: {
      type: Number,
      default: null, // null means unlimited
    },
    usedCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    userUsageLimit: {
      type: Number,
      default: 1,
      min: 1,
    },
    applicableCategories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ServiceCategory",
      },
    ],
    applicableServices: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service",
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Method to check if coupon is valid
couponSchema.methods.isValid = function () {
  const now = new Date();
  return (
    this.isActive &&
    now >= this.validFrom &&
    now <= this.validUntil &&
    (this.usageLimit === null || this.usedCount < this.usageLimit)
  );
};

// Method to calculate discount
couponSchema.methods.calculateDiscount = function (orderAmount) {
  if (!this.isValid() || orderAmount < this.minimumOrderAmount) {
    return 0;
  }

  let discount = 0;
  if (this.discountType === "percentage") {
    discount = (orderAmount * this.discountValue) / 100;
    if (this.maximumDiscountAmount && discount > this.maximumDiscountAmount) {
      discount = this.maximumDiscountAmount;
    }
  } else {
    discount = this.discountValue;
  }

  return Math.min(discount, orderAmount);
};

export default mongoose.model("Coupon", couponSchema);
