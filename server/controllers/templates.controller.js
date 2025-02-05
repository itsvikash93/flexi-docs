const templateModel = require('../models/template.model');
const { v4: uuidv4 } = require('uuid');
const { putObjectURL } = require('../config/aws-setup');


module.exports.uploadTemplate = async (req, res) => {
    const { name, description } = req.body;
    console.log(req.body)
    // const file = req.file

    try {
        const uniqueFileName = `${name}-${uuidv4()}`;
        const key = `templates/${uniqueFileName}`;
        const { fileUrl, uploadUrl } = await putObjectURL(key, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        // console.log(presignedUrl)

        const newTemplate = new templateModel({
            name: uniqueFileName,
            description,
            fileUrl: fileUrl
        });

        await newTemplate.save();
        res.status(201).send({ message: 'Template uploaded successfully', template: newTemplate, uploadUrl });
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
        console.error(error)
    }
}