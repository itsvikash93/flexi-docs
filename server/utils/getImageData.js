const axios = require("axios");
const fs = require("fs");
const path = require("path");

// module.exports.getImageData = async (imageUrl) => {
//   try {
//     const response = await axios.get(imageUrl, { responseType: "arraybuffer" });

//     // Get the actual MIME type from AWS S3 response
//     const contentType = response.headers["content-type"];
//     const base64Image = Buffer.from(response.data, "binary").toString("base64");

//     return `data:${contentType};base64,${base64Image}`;
//   } catch (error) {
//     console.error("Error fetching image:", error);
//     return null;
//   }
// };

module.exports.getImageBase64 = (filePath) => {
  const file = fs.readFileSync(filePath);
  const ext = path.extname(filePath).substring(1);
  return `data:image/${ext};base64,${file.toString("base64")}`;
};
