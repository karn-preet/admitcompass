const mongoose = require("mongoose");

const LocationSchema = new mongoose.Schema({
  campusName: { type: String, default: "Main Campus" },
  address: { type: String },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  isMain: { type: Boolean, default: true }
});

const UniversitySchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  country: { type: String, required: true },
  region: { type: String, default: "EU" },
  type: { type: String, default: "Public" },
  qsRanking: { type: Number },
  city: { type: String },
  tuitionFeeEUR: { type: Number, default: 0 },
  Tuition_Fee_International: { type: Number, default: 0 },
  Cost_of_Living_Index: { type: Number, default: 60 },
  Application_Fee_Amount: { type: Number, default: 0 },
  Application_Portal_Type: { type: String, default: "Direct" },
  Application_Fee_Details: { type: String },
  Enrollment_Semester_Fee: { type: Number, default: 0 },
  Enrollment_Fee_Breakdown: { type: String },
  Locations: [LocationSchema],
  degreesOffered: [{ type: String }],
  fields: [{ type: String }],
  minCGPA10: { type: Number },
  Official_Min_CGPA: { type: Number, default: 6.5 },
  Historical_Avg_CGPA_India: { type: Number, default: 8.0 },
  Data_Source: {
    type: Object,
    default: () => ({
      official: "University Examination Regulations & Portal Cutoff",
      historical: "Verified Indian Student Admit Registry (2022-2025) & Crowdsourced Decisions",
      sampleSizeIndia: 85,
      lastUpdated: "2025-Q1"
    })
  },
  ieltsMinOverall: { type: Number },
  officialWebsite: { type: String },
  courseCatalogUrl: { type: String },
  Application_Documents: {
    type: Object,
    default: () => ({
      LOR_Requirement: "Mandatory",
      LOR_Count: 2,
      LOR_Type: ["Academic"],
      LOR_Format: "Free-form PDF",
      LOR_Instructions: "Letters must be on official letterhead signed and stamped by the referee."
    })
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("University", UniversitySchema);
