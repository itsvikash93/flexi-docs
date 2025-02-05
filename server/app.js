const express = require("express");
const app = express();
const cors = require("cors");
const { getObjectURL, putObjectURL } = require("./config/aws-setup");
const path = require("path")

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

require("dotenv").config();
app.use(cors());

const fs = require("fs");
const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");
const ImageModule = require("docxtemplater-image-module-free");
// const fetch = (await import("node-fetch")).default;
const connectToDB = require("./config/mongodb");
const templatesRouter = require("./routes/templates.routes");
const generateRouter = require("./routes/generate.routes");

connectToDB()
app.get("/", (req, res) => { 
  res.send("FlexiDocs API is running!")
})
app.use("/api/templates", templatesRouter)
app.use("/api/generate", generateRouter)

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

// app.post("/generate-doc", (req, res) => {
//   const templateFile = fs.readFileSync(
//     "./templates/doc-template.docx",
//     "binary"
//   );

//   // Create a PizZip instance with the template
//   const zip = new PizZip(templateFile);

//   // Create Docxtemplater instance
//   const doc = new Docxtemplater(zip, {
//     paragraphLoop: true, // To support loops in paragraphs
//     linebreaks: true, // To support line breaks
//   });

//   const data = req.body;
//   console.log(data);

//   // doc.setData(data);

//   // Try rendering the document
//   try {
//     doc.render(data); // Replace placeholders with data
//   } catch (error) {
//     console.error("Error rendering document:", error);
//   }

//   // Generate the final Word file
//   const output = doc.getZip().generate({ type: "nodebuffer" });

//   // Save the output file
//   fs.writeFileSync("./outputs/doc.docx", output);

//   res.json("Table generated successfully!");
// });

app.post("/api/upload/generate-presigned-urls", async (req, res) => {
  try {
    const files = req.body.files;
    // console.log(files);

    if (!files || !Array.isArray(files)) {
      return res.status(400).json({ message: "Invalid files data" });
    }

    const urls = await Promise.all(
      files.map(async ({ name, type }) => {
        const key = `uploads/${name}`;
        return await putObjectURL(key, type);
      })
    );

    res.json({ urls });
    // res.json(files);
  } catch (error) {
    console.error("Error generating signed URLs:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// const fetch = (await import('node-fetch')).default;

app.post("/api/process-doc", (req, res) => {
  const templateFile = fs.readFileSync("./templates/image-template.docx", "binary");
  const zip = new PizZip(templateFile);

  // Initialize Docxtemplater with the template and data
  const doc = new Docxtemplater(zip);

  // Data passed from the frontend
  const data = req.body; // Images and other details from frontend
  console.log(data)

  try {
    doc.render(data); // Render data into the template
  } catch (error) {
    console.error("Error rendering document:", error);
    return res.status(500).send("Error processing document.");
  }

  // Generate the output document
  const output = doc.getZip().generate({ type: "nodebuffer" });
  fs.writeFileSync("./outputs/image.docx", output);

  res.json("Document generated successfully!");
});

app.listen(3000 || process.env.PORT);
