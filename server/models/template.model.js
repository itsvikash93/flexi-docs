const mongoose = require("mongoose");

const templateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  fileUrl: { type: String, required: true },
  previewImage: { type: String },
  formUrl: { type: String, required: true },
  //   category: { type: String },
  //   createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("template", templateSchema);
