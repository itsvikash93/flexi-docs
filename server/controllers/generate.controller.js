const axios = require("axios");
const templateModel = require("../models/template.model");
const PizZip = require("pizzip");
const fs = require("fs");
const { putObjectURL } = require("../config/aws-setup");
const Docxtemplater = require("docxtemplater");
const imageModule = require("docxtemplater-image-module-free");
const { v4: uuidv4 } = require("uuid");
const { getImageData } = require("../utils/getImageData");

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

module.exports.workshopGenerate = async (req, res) => {
  try {
    // Load the template file
    // const templateFile = fs.readFileSync(
    //   "./templates/workshop-template.docx",
    //   "binary"
    // );
    const template = await templateModel.findOne({
      _id: "67a88ce89c413228bd4c7c81",
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

    // Generate and save the output document
    // const outputPath = "./generated/workshop.docx";
    const output = doc.getZip().generate({ type: "nodebuffer" });

    const fileName = `workshop on entrepreneurship and innovation as career opportunity.docs`;
    const key = `generated/${fileName}`;

    const { fileUrl, uploadUrl } = await putObjectURL(
      key,
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );

    // console.log({ fileUrl, uploadUrl });

    // Uploading the generated file using presigned URL
    await axios.put(uploadUrl, output, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      },
    });

    res.status(200).send({ fileUrl });
  } catch (error) {
    console.error("Error processing document:", error);
    res.status(500).json({ error: "Document generation failed" });
  }
};
