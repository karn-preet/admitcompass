const mongoose = require("mongoose");

const HousingSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  University_ID: { type: String, required: true, index: true },
  Housing_Name: { type: String, required: true },
  Housing_Type: { 
    type: String, 
    enum: ["Dorm", "Studio", "Shared"], 
    required: true 
  },
  Rent_Cost: { type: Number, required: true },
  Currency: { type: String, default: "EUR" },
  Coordinates: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  Distance_Km: { type: Number, default: 0 },
  Walk_Time_Min: { type: Number, default: 0 },
  Cycle_Time_Min: { type: Number, default: 0 },
  Transit_Time_Min: { type: Number, default: 0 },
  Source_URL: { type: String, required: true },
  Housing_Provider: { type: String, required: true },
  Room_Details: { type: String },
  Amenities: [{ type: String }],
  Availability_Status: { type: String, default: "Available" },
  Is_Official_Dorm: { type: Boolean, default: false }
}, {
  timestamps: true
});

module.exports = mongoose.model("Housing", HousingSchema);
