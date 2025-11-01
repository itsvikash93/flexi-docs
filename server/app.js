const express = require("express");
const app = express();
const multer = require("multer");

const cors = require("cors");
// const { getObjectURL, putObjectURL } = require("./config/aws-setup");
const path = require("path");

const upload = multer();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

require("dotenv").config();
app.use(cors());

const fs = require("fs");
const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");
const imageModule = require("docxtemplater-image-module-free");
// const fetch = (await import("node-fetch")).default;
const connectToDB = require("./config/mongodb");
const uploadsRouter = require("./routes/uploads.routes");
const generateRouter = require("./routes/generate.routes");

// connectToDB();
app.get("/", (req, res) => {
  res.send("FlexiDocs API is running!");
});
app.use("/api/uploads", uploadsRouter);
app.use("/api/generate", generateRouter);

app.post("/generate", (req, res) => {
  // Load the template file
  const templateFile = fs.readFileSync(
    "./templates/Q-sheet-template.docx",
    "binary"
  );

  // Create a PizZip instance with the template
  const zip = new PizZip(templateFile);

  // Create Docxtemplater instance
  const doc = new Docxtemplater(zip, {
    paragraphLoop: true, // To support loops in paragraphs
    linebreaks: true, // To support line breaks
  });

  const data = req.body;
  console.log(data);

  // doc.setData(data);

  // Try rendering the document
  try {
    doc.render(data); // Replace placeholders with data
  } catch (error) {
    console.error("Error rendering document:", error);
  }

  // Generate the final Word file
  const output = doc.getZip().generate({ type: "nodebuffer" });

  // Save the output file
  fs.writeFileSync("./outputs/Q-sheet.docx", output);

  res.json("Table generated successfully!");
});

app.post("/generate-block", (req, res) => {
  const templateFile = fs.readFileSync(
    "./templates/block-template.docx",
    "binary"
  );

  // Create a PizZip instance with the template
  const zip = new PizZip(templateFile);

  // Create Docxtemplater instance
  const doc = new Docxtemplater(zip, {
    paragraphLoop: true, // To support loops in paragraphs
    linebreaks: true, // To support line breaks
  });

  const data = req.body;
  // console.log(data);

  // doc.setData(data);

  // Try rendering the document
  try {
    doc.render(data); // Replace placeholders with data
  } catch (error) {
    console.error("Error rendering document:", error);
  }

  // Generate the final Word file
  const output = doc.getZip().generate({ type: "nodebuffer" });

  // Save the output file
  fs.writeFileSync("./outputs/block.docx", output);

  res.json("Table generated successfully!");
});

const axios = require("axios");
const { getImageData } = require("./utils/getImageData");

// const imageModule = require("docxtemplater-image-module-free");

// async function getImageData(imageUrl) {
//   try {
//     const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
//     const base64Image = Buffer.from(response.data, "binary").toString("base64");
//     return `data:image/png;base64,${base64Image}`;
//   } catch (error) {
//     console.error("Error fetching image:", error);
//     return null;
//   }
// }

// app.post("/api/process-doc", (req, res) => {
//   const templateFile = fs.readFileSync("./templates/image-template.docx", "binary");
//   const zip = new PizZip(templateFile);

//   // Initialize Docxtemplater with the template and data
//   // const doc = new Docxtemplater(zip);

//   const imageModule = require('docxtemplater-image-module-free');

//   const imageOpts = {
//     centered: false,
//     fileType: "docx",
//     getImage: (tagValue) => Buffer.from(tagValue, 'base64'),  // Base64 ko Buffer me convert kar
//     getSize: () => [200, 200] // Image size set kar
//   };

//   const doc = new Docxtemplater(zip, { modules: [new imageModule(imageOpts)] });

//   // Ab template me `{%imageTag%}` jaha bhi likha hoga, us jagah image render ho jayega.

//   // Data passed from the frontend
//   const data = req.body; // Images and other details from frontend
//   console.log(data)

//   try {
//     doc.render(data); // Render data into the template
//   } catch (error) {
//     console.error("Error rendering document:", error);
//     return res.status(500).send("Error processing document.");
//   }

//   // Generate the output document
//   const output = doc.getZip().generate({ type: "nodebuffer" });
//   fs.writeFileSync("./outputs/image.docx", output);

//   res.json("Document generated successfully!");
// });

app.listen(3000 || process.env.PORT);
