const mongoose = require("mongoose");

const ApplicationDocumentsSchema = new mongoose.Schema({
  LOR_Requirement: {
    type: String,
    enum: ["Mandatory", "Optional", "Not Required"],
    default: "Not Required"
  },
  LOR_Count: {
    type: Number,
    default: 0
  },
  LOR_Type: [{
    type: String,
    enum: ["Academic", "Professional"]
  }],
  LOR_Format: {
    type: String,
    enum: [
      "University Specific Portal Link",
      "Free-form PDF",
      "Institutional Referee Portal Link",
      "Online Evaluation Form",
      "Direct Email to Admissions",
      "Not Applicable"
    ],
    default: "Free-form PDF"
  },
  LOR_Instructions: {
    type: String,
    default: "Letters must be on official letterhead signed and stamped by the professor or employer."
  },
  SOP_Required: {
    type: Boolean,
    default: true
  },
  SOP_Max_Words: {
    type: Number,
    default: 1000
  },
  CV_Resume_Required: {
    type: Boolean,
    default: true
  },
  Transcripts_Required: {
    type: Boolean,
    default: true
  },
  APS_Certificate_Required: {
    type: Boolean,
    default: false
  }
}, { _id: false });

const ProgramSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  universityId: { type: String, required: true },
  universityName: { type: String, required: true },
  programName: { type: String, required: true },
  degreeLevel: { type: String, default: "Master's" },
  field: { type: String, default: "Computer Science" },
  durationSemesters: { type: Number, default: 4 },
  languageOfInstruction: { type: String, default: "English" },
  intakes: [{ type: String }],
  Application_Documents: {
    type: ApplicationDocumentsSchema,
    default: () => ({})
  }
}, {
  timestamps: true
});

module.exports = {
  Program: mongoose.model("Program", ProgramSchema),
  ApplicationDocumentsSchema
};
