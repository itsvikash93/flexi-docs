const templateModel = require("../models/template.model");
// const { v4: uuidv4 } = require("uuid");
const { putObjectURL } = require("../config/aws-setup");

module.exports.uploadTemplate = async (req, res) => {
  try {
    const { name, description, formUrl } = req.body;
    console.log(req.body);

    // const uniqueFileName = `${name}-${uuidv4()}`;
    const key = `templates/${name}`;
    const templateUrl = await putObjectURL(
      key,
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );

    const key2 = `templates-preview/${name}`;
    const previewImgUrl = await putObjectURL(
      key2,
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );
    // console.log(presignedUrl)

    const newTemplate = await templateModel.create({
      name: name,
      description,
      fileUrl: templateUrl.fileUrl,
      previewImage: previewImgUrl.fileUrl,
      formUrl,
    });

    // await newTemplate.save();
    res.status(201).send({
      message: "Template uploaded successfully",
      templateUrl: templateUrl.fileUrl,
      previewImgUrl: previewImgUrl.fileUrl,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
};

module.exports.getTemplates = async (req, res) => {
  try {
    const templates = await templateModel.find();
    res.status(200).send(templates);
  } catch (error) {
    console.error(error);
  }
};

module.exports.getPresignedURL = async (req, res) => {
  try {
    const files = req.body.files;

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
  } catch (error) {
    console.error("Error generating signed URLs:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
