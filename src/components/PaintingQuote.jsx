import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  X,
  Upload,
  Calendar,
  MapPin,
  Phone,
  Mail,
  User,
  Home,
  PaintBucket,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "./AuthContext";

const API = import.meta.env.VITE_API_URL || window.location.origin;

const PaintingQuote = ({ onClose }) => {
  const { user } = useAuth();

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    propertyType: "apartment",
    area: "",
    serviceType: "new-wall",
    paintBrand: "asian-paints",
    colorPreferences: "",
    additionalRequirements: "",
    inspectionDate: "",
    inspectionTime: "",
    address: "",
  });

  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Auto-fill user data
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || "",
        phone: user.phone || "",
        email: user.email || "",
      }));
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    if (photos.length + files.length > 5) {
      toast.error("Maximum 5 photos allowed");
      return;
    }

    const newPhotos = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setPhotos((prev) => [...prev, ...newPhotos]);
  };

  const removePhoto = (index) => {
    setPhotos((prev) => {
      const updated = [...prev];
      URL.revokeObjectURL(updated[index].preview);
      updated.splice(index, 1);
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.phone || !formData.email) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!formData.area || parseFloat(formData.area) <= 0) {
      toast.error("Please enter a valid area");
      return;
    }

    setLoading(true);

    try {
      // In a real application, you would upload photos and submit the form data
      // For now, we'll simulate the API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setSubmitted(true);
      toast.success("Quote request submitted successfully!");

      // Auto close after 3 seconds
      setTimeout(() => {
        onClose();
      }, 3000);
    } catch (error) {
      console.error("Error submitting quote:", error);
      toast.error("Failed to submit quote request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Get minimum date (today)
  const today = new Date().toISOString().split("T")[0];

  if (submitted) {
    return (
      <div className="p-8 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle2 className="w-10 h-10 text-white" />
        </motion.div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Quote Request Submitted!
        </h3>
        <p className="text-gray-600 mb-4">
          Thank you for your interest. Our team will contact you within 24
          hours with a detailed quote.
        </p>
        <button
          onClick={onClose}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
        >
          Close
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Header */}
      <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl z-10">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-all"
        >
          <X className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
            <PaintBucket className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Get Free Quote</h2>
            <p className="text-blue-100">We'll contact you within 24 hours</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Personal Information */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" />
            Personal Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter phone number"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter email address"
              />
            </div>
          </div>
        </div>

        {/* Property Details */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Home className="w-5 h-5 text-purple-600" />
            Property Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property Type *
              </label>
              <select
                name="propertyType"
                value={formData.propertyType}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="apartment">Apartment</option>
                <option value="villa">Villa</option>
                <option value="independent-house">Independent House</option>
                <option value="office">Office</option>
                <option value="shop">Shop</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Area (sq.ft) *
              </label>
              <input
                type="number"
                name="area"
                value={formData.area}
                onChange={handleInputChange}
                required
                min="1"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="e.g., 1000"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address *
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
                rows="2"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter complete address"
              />
            </div>
          </div>
        </div>

        {/* Service Requirements */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <PaintBucket className="w-5 h-5 text-green-600" />
            Service Requirements
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Type *
              </label>
              <select
                name="serviceType"
                value={formData.serviceType}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="new-wall">New Wall Painting</option>
                <option value="repainting">Repainting</option>
                <option value="texture">Texture Painting</option>
                <option value="designer">Designer Paint</option>
                <option value="touch-up">Touch-up Painting</option>
                <option value="full-home">Full Home Painting</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Paint Brand
              </label>
              <select
                name="paintBrand"
                value={formData.paintBrand}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="asian-paints">Asian Paints</option>
                <option value="berger">Berger Paints</option>
                <option value="dulux">Dulux</option>
                <option value="nerolac">Nerolac</option>
                <option value="no-preference">No Preference</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color Preferences
              </label>
              <input
                type="text"
                name="colorPreferences"
                value={formData.colorPreferences}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="e.g., White, Light Blue, Beige (optional)"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Requirements
              </label>
              <textarea
                name="additionalRequirements"
                value={formData.additionalRequirements}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Any specific requirements or concerns..."
              />
            </div>
          </div>
        </div>

        {/* Photo Upload */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Upload className="w-5 h-5 text-orange-600" />
            Upload Photos (Optional)
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Upload photos of the area to be painted (Max 5 photos)
          </p>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handlePhotoUpload}
              className="hidden"
              id="photo-upload"
            />
            <label
              htmlFor="photo-upload"
              className="cursor-pointer inline-block"
            >
              <div className="bg-orange-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                <Upload className="w-8 h-8 text-orange-600" />
              </div>
              <p className="text-gray-700 font-medium mb-1">
                Click to upload photos
              </p>
              <p className="text-sm text-gray-500">PNG, JPG up to 5MB each</p>
            </label>
          </div>

          {photos.length > 0 && (
            <div className="grid grid-cols-3 md:grid-cols-5 gap-4 mt-4">
              {photos.map((photo, index) => (
                <div key={index} className="relative group">
                  <img
                    src={photo.preview}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Inspection Booking */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            Schedule Inspection (Optional)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Date
              </label>
              <input
                type="date"
                name="inspectionDate"
                value={formData.inspectionDate}
                onChange={handleInputChange}
                min={today}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Time
              </label>
              <select
                name="inspectionTime"
                value={formData.inspectionTime}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select time slot</option>
                <option value="9am-12pm">9 AM - 12 PM</option>
                <option value="12pm-3pm">12 PM - 3 PM</option>
                <option value="3pm-6pm">3 PM - 6 PM</option>
                <option value="6pm-9pm">6 PM - 9 PM</option>
              </select>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex gap-4 pt-4 border-t">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5" />
                Submit Quote Request
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PaintingQuote;
