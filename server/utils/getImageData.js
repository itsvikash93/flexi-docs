const axios = require("axios");

module.exports.getImageData = async (imageUrl) => {
  try {
    const response = await axios.get(imageUrl, { responseType: "arraybuffer" });

    // Get the actual MIME type from AWS S3 response
    const contentType = response.headers["content-type"];
    const base64Image = Buffer.from(response.data, "binary").toString("base64");

    return `data:${contentType};base64,${base64Image}`;
  } catch (error) {
    console.error("Error fetching image:", error);
    return null;
  }
};
