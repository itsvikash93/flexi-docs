const axios = require("axios");
const templateModel = require("../models/template.model");
const PizZip = require("pizzip");
const { putObjectURL } = require("../config/aws-setup");
const Docxtemplater = require("docxtemplater");
const { v4: uuidv4 } = require("uuid");

module.exports.docGenerate = async (req, res) => {
    const template = await templateModel.findOne({ name: "doc-template-99ded46e-f870-4ab0-b7e1-c9220fd2ebf3" });

    // HTTP request se template fetch karega
    const response = await axios.get(template.fileUrl, { responseType: "arraybuffer" });
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
        headers: { "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document" }
    });

    res.status(200).send({ fileUrl });
};