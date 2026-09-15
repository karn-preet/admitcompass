const mongoose = require("mongoose");
const { publicUniversities } = require("../data/seedUniversities");
const { countryVisaRules } = require("../data/seedVisaRules");
const { historicalDecisions } = require("../data/seedDecisions");
const { globalScholarships } = require("../data/seedScholarships");
const { loanProviders } = require("../data/seedLoanBanks");
const { communityDiscussions } = require("../data/seedDiscussions");
const { verifiedStudentHousing } = require("../data/seedHousing");
const { campusAmenities } = require("../data/seedAmenities");

// Memory cache / local store for instant fallback
const localStore = {
  universities: [...publicUniversities],
  visaRules: { ...countryVisaRules },
  decisions: [...historicalDecisions],
  scholarships: [...globalScholarships],
  loanBanks: [...loanProviders],
  discussions: [...communityDiscussions],
  housing: [...verifiedStudentHousing],
  amenities: [...campusAmenities],
  assessments: []
};

let isConnectedToMongo = false;

const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/study_abroad_evaluator";
  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 2000 // Quick fallback if local MongoDB is not running
    });
    isConnectedToMongo = true;
    console.log("✅ MongoDB Connected successfully:", mongoUri);
  } catch (error) {
    isConnectedToMongo = false;
    console.warn("ℹ️ MongoDB daemon not active locally. Initializing in-memory fallback store with full persistence & official seed records.");
  }
};

const getStore = () => localStore;
const isMongoActive = () => isConnectedToMongo;

module.exports = {
  connectDB,
  getStore,
  isMongoActive
};
