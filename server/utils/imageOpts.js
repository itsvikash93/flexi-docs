const { imageSize } = require("image-size");

// Image options for docxtemplater
module.exports.imageOpts = {
  centered: true,
  fileType: "docx",

  getImage: (tagValue) => {
    if (typeof tagValue === "string") {
      return Buffer.from(
        tagValue.replace(/^data:image\/\w+;base64,/, ""),
        "base64"
      );
    }
    return tagValue; // if already buffer
  },

  getSize: (tagValue, tagName) => {
    try {
      const buffer =
        typeof tagValue === "string"
          ? Buffer.from(
              tagValue.replace(/^data:image\/\w+;base64,/, ""),
              "base64"
            )
          : tagValue;

      const dimensions = imageSize(buffer);
      let { width, height } = dimensions;

      // default max size
      let maxWidth = 500;
      let maxHeight = 400;

      if (tagName.includes("poster")) {
        maxWidth = 600;
        maxHeight = 400;
      } else if (tagName.includes("attendance")) {
        maxWidth = 800;
        maxHeight = 1000;
      } else if (tagName.includes("glimpse")) {
        maxWidth = 250;
        maxHeight = 150;
      }

      // maintain aspect ratio
      const ratio = Math.min(maxWidth / width, maxHeight / height);
      width = width * ratio;
      height = height * ratio;

      return [width, height];
    } catch (err) {
      console.error("Image size error:", err);
      return [500, 400]; // fallback
    }
  },
};
