const axios = require("axios");

const templateModel = require("../models/template.model");
const PizZip = require("pizzip");
const path = require("path");
const fs = require("fs");
const fsExtra = require("fs-extra");
const { putObjectURL } = require("../config/aws-setup");
const Docxtemplater = require("docxtemplater");
const imageModule = require("docxtemplater-image-module-free");
const { v4: uuidv4 } = require("uuid");

const { getImageBase64 } = require("../utils/getImageData");

const { imageSize } = require("image-size");
const { imageOpts } = require("../utils/imageOpts");
// const { getImageData } = require("../utils/getImageData");

module.exports.docGenerate = async (req, res) => {
  const template = await templateModel.findOne({
    name: "doc-template-99ded46e-f870-4ab0-b7e1-c9220fd2ebf3",
  });

  // HTTP request se template fetch karega
  const response = await axios.get(template.fileUrl, {
    responseType: "arraybuffer",
  });
  const templateFile = response.data;

  const zip = new PizZip(templateFile);
  const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });

  const data = req.body;

  try {
    doc.render(data);
  } catch (error) {
    console.error("Error rendering document:", error);
    return res.status(500).send({ error: "Template rendering failed" });
  }

  const output = doc.getZip().generate({ type: "nodebuffer" });

  const uniqueFileName = `doc-${uuidv4()}.docx`;
  const key = `generated/${uniqueFileName}`;

  const { fileUrl, uploadUrl } = await putObjectURL(
    key,
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  );

  console.log({ fileUrl, uploadUrl });

  // Uploading the generated file using presigned URL
  await axios.put(uploadUrl, output, {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    },
  });

  res.status(200).send({ fileUrl });
};

module.exports.imgGenerate = async (req, res) => {
  try {
    const templateFile = fs.readFileSync(
      "./templates/image-template.docx",
      "binary"
    );
    const zip = new PizZip(templateFile);

    const imageOpts = {
      centered: false,
      fileType: "docx",
      getImage: (tagValue) =>
        Buffer.from(tagValue.replace(/^data:image\/\w+;base64,/, ""), "base64"),
      getSize: () => [250, 150], // Fixed size for better layout
    };

    const doc = new Docxtemplater(zip, {
      modules: [new imageModule(imageOpts)],
    });

    const { images } = req.body;
    if (!images || images.length === 0) {
      return res.status(400).json({ error: "No images provided" });
    }

    const imagePairs = [];
    for (let i = 0; i < images.length; i += 2) {
      imagePairs.push({
        imageTag: (await getImageData(images[i].url)).trim(), // Trim whitespace
        imageTag2: images[i + 1]
          ? (await getImageData(images[i + 1].url)).trim()
          : "", // Trim second image if exists
      });
    }

    doc.render({ images: imagePairs });

    const outputPath = "./generated/image.docx";
    const output = doc.getZip().generate({ type: "nodebuffer" });
    fs.writeFileSync(outputPath, output);

    res.json({ message: "Document generated successfully!", file: outputPath });
  } catch (error) {
    console.error("Error processing document:", error);
    res.status(500).json({ error: "Error generating document" });
  }
};

module.exports.iicActivityReportGenerate = async (req, res) => {
  try {
    // console.log(req.body);
    // Load the template file
    // const templateFile = fs.readFileSync(
    //   "./templates/workshop-template.docx",
    //   "binary"
    // );
    const template = await templateModel.findOne({
      _id: "67f427e4bc6fbb4601c19c6c",
    });

    const response = await axios.get(template.fileUrl, {
      responseType: "arraybuffer",
    });
    const templateFile = response.data;

    const zip = new PizZip(templateFile);

    // Image processing options
    const imageOpts = {
      centered: true,
      fileType: "docx",
      getImage: (tagValue) =>
        Buffer.from(tagValue.replace(/^data:image\/\w+;base64,/, ""), "base64"),
      getSize: (tagName) => {
        if (tagName.includes("poster")) {
          return [600, 400];
        } // Half-page
        if (tagName.includes("attendance")) return [800, 1000]; // Full-page
        if (tagName.includes("glimpse")) return [250, 150]; // Two per row
        return [500, 400]; // Default fallback
      },
    };

    const doc = new Docxtemplater(zip, {
      modules: [new imageModule(imageOpts)],
    });

    // console.log(req.body);
    let { poster, glimpses, attendances } = req.body;

    // Ensure poster is correctly formatted
    poster = await getImageData(poster);

    // Process glimpses (grouping into pairs for rows)
    const glimpseImgs = [];
    for (let i = 0; i < glimpses.length; i++) {
      glimpseImgs.push({
        glimpseImg: await getImageData(glimpses[i]),
      });
    }

    // Process attendances
    const attendanceImgs = [];
    for (let i = 0; i < attendances.length; i++) {
      attendanceImgs.push({
        attendanceImg: await getImageData(attendances[i]),
      });
    }

    // console.log({ Glimpses: glimpseImgs, Attendances: attendanceImgs });

    // Render the document with updated data
    doc.render({
      ...req.body,
      poster: poster, // Poster image
      glimpses: glimpseImgs, // Glimpses in rows
      attendances: attendanceImgs, // Attendance images
    });

    const output = doc.getZip().generate({ type: "nodebuffer" });
    // Generate and save the output document
    // const outputPath = "./generated/workshop.docx";

    const fileName = "IIC_Activity_Report.docx";
    const key = `generated/${fileName}`;

    // fs.writeFileSync(outputPath, output);

    const { fileUrl, uploadUrl } = await putObjectURL(
      key,
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );

    await axios.put(uploadUrl, output, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      },
    });

    res.status(200).send({ fileUrl });
    // res.status(200).send("generated");
  } catch (error) {
    console.error("Error processing document:", error);
    res.status(500).json({ error: "Document generation failed" });
  }
};

module.exports.departmentalActivityReportGenerate = async (req, res) => {
  try {
    // console.log(req.body);
    // Load the template file
    // const templateFile = fs.readFileSync(
    //   "./templates/Departmental_Activity_Report_template.docx",
    //   "binary"
    // );
    const template = await templateModel.findOne({
      _id: "67f42861bc6fbb4601c19c77",
    });
    const response = await axios.get(template.fileUrl, {
      responseType: "arraybuffer",
    });
    const templateFile = response.data;

    const zip = new PizZip(templateFile);

    // Image processing options
    const imageOpts = {
      centered: true,
      fileType: "docx",
      getImage: (tagValue) =>
        Buffer.from(tagValue.replace(/^data:image\/\w+;base64,/, ""), "base64"),
      getSize: (tagName) => {
        if (tagName.includes("poster")) {
          return [600, 400];
        } // Half-page
        if (tagName.includes("attendance")) return [800, 1000]; // Full-page
        if (tagName.includes("glimpse")) return [250, 150]; // Two per row
        return [500, 400]; // Default fallback
      },
    };

    const doc = new Docxtemplater(zip, {
      modules: [new imageModule(imageOpts)],
    });

    // console.log(req.body);
    let { poster, glimpses, attendances, feedbacks } = req.body;

    // Ensure poster is correctly formatted
    poster = await getImageData(poster);

    // Process glimpses (grouping into pairs for rows)
    const glimpseImgs = [];
    for (let i = 0; i < glimpses.length; i++) {
      glimpseImgs.push({
        glimpseImg: await getImageData(glimpses[i]),
      });
    }

    // Process attendances
    const attendanceImgs = [];
    for (let i = 0; i < attendances.length; i++) {
      attendanceImgs.push({
        attendanceImg: await getImageData(attendances[i]),
      });
    }
    // Process feedbacks
    const feedbackImgs = [];
    for (let i = 0; i < feedbacks.length; i++) {
      feedbackImgs.push({
        feedbackImg: await getImageData(feedbacks[i]),
      });
    }

    // console.log({ Feedbacks: feedbackImgs });

    // Render the document with updated data
    doc.render({
      ...req.body,
      poster: poster, // Poster image
      glimpses: glimpseImgs, // Glimpses in rows
      attendances: attendanceImgs,
      feedbacks: feedbackImgs, // Attendance images
    });

    const output = doc.getZip().generate({ type: "nodebuffer" });

    const fileName = "Departmental_Activity_Report.docx";
    const key = `generated/${fileName}`;

    // Generate and save the output document
    // const outputPath = `./generated/${fileName}`;
    // fs.writeFileSync(outputPath, output);

    const { fileUrl, uploadUrl } = await putObjectURL(
      key,
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );

    await axios.put(uploadUrl, output, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      },
    });

    res.status(200).send({ fileUrl });
    // res.status(200).send("generated");
  } catch (error) {
    console.error("Error processing document:", error);
    res.status(500).json({ error: "Document generation failed" });
  }
};

module.exports.nspReportGenerate = async (req, res) => {
  try {
    // console.log(req.body);
    // const templateFile = fs.readFileSync(
    //   "./templates/NSP_III_Year_Guidelines_and_Report_Template.docx",
    //   "binary"
    // );

    const template = await templateModel.findOne({
      _id: "67f428cbbc6fbb4601c19c7e",
    });

    const response = await axios.get(template.fileUrl, {
      responseType: "arraybuffer",
    });

    const templateFile = response.data;

    const zip = new PizZip(templateFile);

    const doc = new Docxtemplater(zip);

    doc.render(req.body);

    const output = doc.getZip().generate({ type: "nodebuffer" });

    const fileName = `NSP_III_Year_Guidelines_and_Report.docx`;
    const key = `generated/${fileName}`;

    // Generate and save the output document
    // const outputPath = `./generated/${fileName}`;
    // fs.writeFileSync(outputPath, output);

    const { fileUrl, uploadUrl } = await putObjectURL(
      key,
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );

    await axios.put(uploadUrl, output, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      },
    });

    res.status(200).send({ fileUrl });
    // res.status(200).send("generated");
  } catch (error) {
    console.error("Error processing document:", error);
    res.status(500).json({ error: "Document generation failed" });
  }
};

// Helper function to get image as base64

module.exports.testingController = async (req, res) => {
  const uploadedImagesDir = path.join(__dirname, "../uploads/images");
  try {
    // console.log(req.body);
    // console.log(req.files);

    // ✅ Get uploaded files from multer
    const posterFile = req.files.poster ? req.files.poster[0] : null;
    const noticeFile = req.files.notice ? req.files.notice[0] : null;
    const qSheetFile = req.files.qSheet ? req.files.qSheet[0] : null;
    const glimpseFiles = req.files.glimpses || [];
    const attendanceFiles = req.files.attendances || [];
    // const participantFiles = req.files.participants || [];
    const feedbackFiles = req.files.feedbackAnalysis || [];

    if (!posterFile) {
      return res.status(400).json({ error: "Poster image is required" });
    }

    // Template path (uploaded earlier)
    const templatePath = path.join(
      __dirname,
      "../uploads/templates/sample-report.docx"
    );
    const templateFile = fs.readFileSync(templatePath, "binary");
    const zip = new PizZip(templateFile);

    const doc = new Docxtemplater(zip, {
      modules: [new imageModule(imageOpts)],
    });

    // ✅ Convert images → base64
    const poster = getImageBase64(posterFile.path);
    const qSheet = getImageBase64(qSheetFile.path);
    const notice = getImageBase64(noticeFile.path);

    const glimpseImgs = glimpseFiles.map((f) => ({
      glimpseImg: getImageBase64(f.path),
    }));

    const attendanceImgs = attendanceFiles.map((f) => ({
      attendanceImg: getImageBase64(f.path),
    }));
    // const participantImgs = participantFiles.map((f) => ({
    //   participantImg: getImageBase64(f.path),
    // }));
    const feedbackAnalysisImgs = feedbackFiles.map((f) => ({
      feedbackImg: getImageBase64(f.path),
    }));

    // ✅ Render document
    doc.render({
      ...req.body,
      poster,
      qSheet,
      glimpses: glimpseImgs,
      attendances: attendanceImgs,
      // participants: participantImgs,
      feedbackAnalysis: feedbackAnalysisImgs,
      notice,
    });

    const buf = doc.getZip().generate({ type: "nodebuffer" });

    // const outputDir = path.join(__dirname, "../uploads/generated");
    const outputDir = "E:FlexiDocs-Generated-Reports";
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

    const outputPath = path.join(outputDir, `Sample_Report_${Date.now()}.docx`);

    fsExtra.writeFileSync(outputPath, buf);

    res.status(200).json({
      message: "Document generated successfully!",
      filePath: outputPath,
    });
  } catch (error) {
    console.error("Error processing document:", error);
    res.status(500).json({ error: "Document generation failed" });
  } finally {
    // ✅ Always clean up uploaded images folder (even if error occurs)
    try {
      if (fs.existsSync(uploadedImagesDir)) {
        fsExtra.emptyDirSync(uploadedImagesDir);
        console.log("🧹 Uploaded images folder cleaned successfully!");
      }
    } catch (cleanupErr) {
      console.error("Error cleaning uploaded folder:", cleanupErr);
    }
  }
};
// module.exports.testingController = async (req, res) => {
//   try {
//     // console.log(req.body);
//     // Load the template file
//     const templateFile = fs.readFileSync(
//       "./templates/testing-template.docx",
//       "binary"
//     );

//     const zip = new PizZip(templateFile);

//     const doc = new Docxtemplater(zip, {
//       paragraphLoop: true, // To support loops in paragraphs
//       linebreaks: true, // To support line breaks
//     });

//     console.log(req.body);

//     // Render the document with updated data
//     doc.render({
//       ...req.body,
//     });

//     // Generate the final Word file
//     const output = doc.getZip().generate({ type: "nodebuffer" });

//     // Generate and save the output document
//     const fileName = "testing.docx";

//     const outputPath = `./generated/${fileName}`;

//     // const key = `generated/${fileName}`;

//     fs.writeFileSync(outputPath, output);

//     res.status(200).send("Ho gya Jiii!");
//     // res.status(200).send("generated");
//   } catch (error) {
//     console.error("Error processing document:", error);
//     res.status(500).json({ error: "Document generation failed" });
//   }
// };
