import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Calculator,
  Home,
  DoorOpen,
  Maximize2,
  PaintBucket,
  Download,
  Calendar,
  CheckCircle2,
  Info,
} from "lucide-react";
import toast from "react-hot-toast";

// Constants
const STANDARD_DOOR_AREA = 21; // 7ft x 3ft
const STANDARD_WINDOW_AREA = 15; // 5ft x 3ft
const PAINT_COVERAGE_PER_LITRE = 120; // sq.ft per litre
const STANDARD_DOOR_PRICE = 599;
const STANDARD_WINDOW_PRICE = 299;

const PaintingCalculator = () => {
  // State for inputs
  const [rooms, setRooms] = useState(1);
  const [roomLength, setRoomLength] = useState("");
  const [roomWidth, setRoomWidth] = useState("");
  const [roomHeight, setRoomHeight] = useState("10");
  const [coats, setCoats] = useState(2);
  const [paintWalls, setPaintWalls] = useState(true);
  const [paintCeiling, setPaintCeiling] = useState(false);
  const [doorCount, setDoorCount] = useState(0);
  const [windowCount, setWindowCount] = useState(0);
  const [serviceType, setServiceType] = useState("new-wall");
  const [paintType, setPaintType] = useState("premium");

  // State for calculations
  const [totalArea, setTotalArea] = useState(0);
  const [laborCost, setLaborCost] = useState(0);
  const [materialCost, setMaterialCost] = useState(0);
  const [totalCost, setTotalCost] = useState(0);

  // Pricing configuration
  const servicePricing = {
    "new-wall": 18,
    "repainting": 14,
    "texture": 35,
    "designer": 45,
  };

  const paintTypePricing = {
    "economy": 150, // per litre
    "premium": 250,
    "luxury": 450,
  };

  // Calculate everything when inputs change
  useEffect(() => {
    calculateCost();
  }, [
    rooms,
    roomLength,
    roomWidth,
    roomHeight,
    coats,
    paintWalls,
    paintCeiling,
    doorCount,
    windowCount,
    serviceType,
    paintType,
  ]);

  const calculateCost = () => {
    if (!roomLength || !roomWidth || !roomHeight) {
      setTotalArea(0);
      setLaborCost(0);
      setMaterialCost(0);
      setTotalCost(0);
      return;
    }

    const length = parseFloat(roomLength);
    const width = parseFloat(roomWidth);
    const height = parseFloat(roomHeight);

    // Calculate wall area
    let wallArea = 0;
    if (paintWalls) {
      wallArea = 2 * (length + width) * height * rooms;
      // Subtract door and window areas
      const doorArea = doorCount * STANDARD_DOOR_AREA;
      const windowArea = windowCount * STANDARD_WINDOW_AREA;
      wallArea = Math.max(0, wallArea - doorArea - windowArea);
    }

    // Calculate ceiling area
    let ceilingArea = 0;
    if (paintCeiling) {
      ceilingArea = length * width * rooms;
    }

    const total = wallArea + ceilingArea;
    setTotalArea(total);

    // Calculate labor cost
    const pricePerSqFt = servicePricing[serviceType];
    const labor = total * pricePerSqFt;
    setLaborCost(labor);

    // Calculate material cost
    // 1 litre covers approximately PAINT_COVERAGE_PER_LITRE sq.ft for 1 coat
    const litresNeeded = (total * coats) / PAINT_COVERAGE_PER_LITRE;
    const pricePerLitre = paintTypePricing[paintType];
    const material = litresNeeded * pricePerLitre;
    setMaterialCost(material);

    // Add door and window painting if any
    const doorCost = doorCount * STANDARD_DOOR_PRICE;
    const windowCost = windowCount * STANDARD_WINDOW_PRICE;

    setTotalCost(labor + material + doorCost + windowCost);
  };

  const handleDownloadEstimate = () => {
    // Create a simple text estimate
    const estimate = `
PAINTING COST ESTIMATE
=====================

Project Details:
- Number of Rooms: ${rooms}
- Room Dimensions: ${roomLength}ft x ${roomWidth}ft x ${roomHeight}ft
- Service Type: ${serviceType.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
- Paint Type: ${paintType.charAt(0).toUpperCase() + paintType.slice(1)}
- Number of Coats: ${coats}
- Paint Walls: ${paintWalls ? "Yes" : "No"}
- Paint Ceiling: ${paintCeiling ? "Yes" : "No"}
- Doors: ${doorCount}
- Windows: ${windowCount}

Cost Breakdown:
- Total Area: ${totalArea.toFixed(2)} sq.ft
- Labor Cost: ₹${laborCost.toFixed(2)}
- Material Cost: ₹${materialCost.toFixed(2)}
- Door Painting: ₹${(doorCount * 599).toFixed(2)}
- Window Painting: ₹${(windowCount * 299).toFixed(2)}

TOTAL COST: ₹${totalCost.toFixed(2)}

Note: This is an estimate. Final quote may vary after on-site inspection.
Generated on: ${new Date().toLocaleDateString()}
    `;

    // Create blob and download
    const blob = new Blob([estimate], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `painting-estimate-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success("Estimate downloaded successfully!");
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-xl">
          <Calculator className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-900">
            Painting Cost Calculator
          </h3>
          <p className="text-gray-600 text-sm">
            Get instant estimate for your project
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Room Details */}
          <div className="bg-blue-50 rounded-xl p-6">
            <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Home className="w-5 h-5 text-blue-600" />
              Room Details
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Rooms
                </label>
                <input
                  type="number"
                  min="1"
                  value={rooms}
                  onChange={(e) => setRooms(parseInt(e.target.value) || 1)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Room Length (ft)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={roomLength}
                  onChange={(e) => setRoomLength(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 12"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Room Width (ft)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={roomWidth}
                  onChange={(e) => setRoomWidth(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 10"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Wall Height (ft)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={roomHeight}
                  onChange={(e) => setRoomHeight(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Service & Paint Type */}
          <div className="bg-purple-50 rounded-xl p-6">
            <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <PaintBucket className="w-5 h-5 text-purple-600" />
              Service & Paint Options
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Type
                </label>
                <select
                  value={serviceType}
                  onChange={(e) => setServiceType(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="new-wall">New Wall Painting (₹18/sq.ft)</option>
                  <option value="repainting">Repainting (₹14/sq.ft)</option>
                  <option value="texture">Texture Painting (₹35/sq.ft)</option>
                  <option value="designer">Designer Paint (₹45/sq.ft)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Paint Quality
                </label>
                <select
                  value={paintType}
                  onChange={(e) => setPaintType(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="economy">Economy (₹150/L)</option>
                  <option value="premium">Premium (₹250/L)</option>
                  <option value="luxury">Luxury (₹450/L)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Coats
                </label>
                <select
                  value={coats}
                  onChange={(e) => setCoats(parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="1">1 Coat</option>
                  <option value="2">2 Coats (Recommended)</option>
                  <option value="3">3 Coats</option>
                </select>
              </div>
            </div>
          </div>

          {/* Areas & Items */}
          <div className="bg-green-50 rounded-xl p-6">
            <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Maximize2 className="w-5 h-5 text-green-600" />
              Areas & Items
            </h4>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="paintWalls"
                  checked={paintWalls}
                  onChange={(e) => setPaintWalls(e.target.checked)}
                  className="w-5 h-5 text-green-600 rounded focus:ring-2 focus:ring-green-500"
                />
                <label htmlFor="paintWalls" className="text-gray-700 font-medium">
                  Paint Walls
                </label>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="paintCeiling"
                  checked={paintCeiling}
                  onChange={(e) => setPaintCeiling(e.target.checked)}
                  className="w-5 h-5 text-green-600 rounded focus:ring-2 focus:ring-green-500"
                />
                <label
                  htmlFor="paintCeiling"
                  className="text-gray-700 font-medium"
                >
                  Paint Ceiling
                </label>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Doors
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={doorCount}
                    onChange={(e) =>
                      setDoorCount(parseInt(e.target.value) || 0)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">₹599 per door</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Windows
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={windowCount}
                    onChange={(e) =>
                      setWindowCount(parseInt(e.target.value) || 0)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">₹299 per window</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cost Summary Section */}
        <div className="lg:col-span-1">
          <div className="sticky top-4 space-y-4">
            {/* Total Cost Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-6 text-white shadow-xl"
            >
              <div className="text-sm opacity-90 mb-2">Estimated Total Cost</div>
              <div className="text-4xl font-bold mb-4">
                ₹{totalCost.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
              </div>
              <div className="bg-white/20 rounded-lg p-3 backdrop-blur-sm">
                <div className="flex items-center gap-2 text-sm mb-1">
                  <Info className="w-4 h-4" />
                  <span>Total Area: {totalArea.toFixed(0)} sq.ft</span>
                </div>
              </div>
            </motion.div>

            {/* Cost Breakdown */}
            <div className="bg-white rounded-xl border-2 border-gray-200 p-6">
              <h4 className="font-bold text-gray-900 mb-4">Cost Breakdown</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span className="text-gray-600">Labor Cost</span>
                  <span className="font-semibold text-gray-900">
                    ₹{laborCost.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span className="text-gray-600">Material Cost</span>
                  <span className="font-semibold text-gray-900">
                    ₹{materialCost.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                  </span>
                </div>
                {doorCount > 0 && (
                  <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                    <span className="text-gray-600">
                      Doors ({doorCount})
                    </span>
                    <span className="font-semibold text-gray-900">
                      ₹{(doorCount * 599).toLocaleString("en-IN")}
                    </span>
                  </div>
                )}
                {windowCount > 0 && (
                  <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                    <span className="text-gray-600">
                      Windows ({windowCount})
                    </span>
                    <span className="font-semibold text-gray-900">
                      ₹{(windowCount * 299).toLocaleString("en-IN")}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleDownloadEstimate}
                disabled={totalCost === 0}
                className="w-full bg-gray-800 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="w-5 h-5" />
                Download Estimate
              </button>
              <button
                onClick={() => {
                  toast.success("Inspection booking coming soon!");
                }}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Calendar className="w-5 h-5" />
                Book Free Inspection
              </button>
            </div>

            {/* Info Note */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex gap-2">
                <Info className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                <div className="text-sm text-yellow-800">
                  <p className="font-semibold mb-1">Note:</p>
                  <p>
                    This is an approximate estimate. Final cost may vary based
                    on actual site conditions and requirements.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaintingCalculator;
