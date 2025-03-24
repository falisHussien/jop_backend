const mongoose = require("mongoose");

const JobApplicationSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    jobTitle: {
      type: String,
      required: true
    },
    resume: {
      type: String, // This will store the filename of the uploaded resume
      required: true
    },
    coverLetter: {
      type: String, // Optional, if you want to store a cover letter
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("JobApplication", JobApplicationSchema);
