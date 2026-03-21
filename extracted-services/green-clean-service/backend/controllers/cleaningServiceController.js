// controllers/cleaningServiceController.js
import CleaningService from "../models/CleaningService.js";
import mongoose from "mongoose";

// GET /api/green/services
export const listServices = async (req, res) => {
  try {
    const {
      q, // text search
      category,
      minPrice,
      maxPrice,
      sort = "-sortOrder,createdAt",
      page = 1,
      limit = 20,
      branchId,
    } = req.query;

    const filter = { active: true };

    if (q) {
      filter.$text = { $search: q };
    }
    if (category) filter.category = category;
    if (minPrice)
      filter["basePrice"] = {
        ...(filter["basePrice"] || {}),
        $gte: Number(minPrice),
      };
    if (maxPrice)
      filter["basePrice"] = {
        ...(filter["basePrice"] || {}),
        $lte: Number(maxPrice),
      };
    if (branchId) filter.branchIds = mongoose.Types.ObjectId(branchId);

    const skip = (Math.max(1, Number(page)) - 1) * Number(limit);

    const services = await CleaningService.find(filter)
      .sort(sort.replace(",", " "))
      .skip(skip)
      .limit(Number(limit))
      .lean();

    const total = await CleaningService.countDocuments(filter);

    return res.json({
      success: true,
      data: services,
      meta: { total, page: Number(page), limit: Number(limit) },
    });
  } catch (err) {
    console.error("listServices", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET /api/green/services/:idOrSlug
export const getService = async (req, res) => {
  try {
    const { idOrSlug } = req.params;
    let service;
    if (mongoose.isValidObjectId(idOrSlug)) {
      service = await CleaningService.findById(idOrSlug).lean();
    } else {
      service = await CleaningService.findOne({ slug: idOrSlug }).lean();
    }
    if (!service)
      return res
        .status(404)
        .json({ success: false, message: "Service not found" });
    return res.json({ success: true, data: service });
  } catch (err) {
    console.error("getService", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ADMIN: POST /api/green/services
export const createService = async (req, res) => {
  try {
    // TODO: protect with admin middleware
    const payload = req.body;
    const created = await CleaningService.create(payload);
    return res.status(201).json({ success: true, data: created });
  } catch (err) {
    console.error("createService", err);
    return res.status(400).json({ success: false, message: err.message });
  }
};

// ADMIN: PUT /api/green/services/:id
export const updateService = async (req, res) => {
  try {
    const id = req.params.id;
    const payload = req.body;
    const updated = await CleaningService.findByIdAndUpdate(id, payload, {
      new: true,
    });
    if (!updated)
      return res.status(404).json({ success: false, message: "Not found" });
    return res.json({ success: true, data: updated });
  } catch (err) {
    console.error("updateService", err);
    return res.status(400).json({ success: false, message: err.message });
  }
};

// ADMIN: DELETE /api/green/services/:id
export const deleteService = async (req, res) => {
  try {
    const id = req.params.id;
    await CleaningService.findByIdAndDelete(id);
    return res.json({ success: true });
  } catch (err) {
    console.error("deleteService", err);
    return res.status(400).json({ success: false, message: err.message });
  }
};
