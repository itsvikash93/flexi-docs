const { imageSize } = require("image-size");

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
    return tagValue;
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

      // Dimensions from the actual image
      const { width: originalWidth, height: originalHeight } = imageSize(buffer);
      let width = originalWidth;
      let height = originalHeight;

      // Default size (for any unmatched tags)
      let maxWidth = 500;
      let maxHeight = 400;

      // Poster (medium size)
      if (tagName.includes("poster")) {
        maxWidth = 600;
        maxHeight = 400;
      }
      // Attendance / Feedback Analysis / Participant List (multiple tall images)
      else if (
        tagName.includes("attendance") ||
        tagName.includes("feedback") ||
        tagName.includes("participant")
      ) {
        maxWidth = 800;
        maxHeight = 1000;
      }
      // Glimpses (small thumbnails)
      else if (tagName.includes("glimpse")) {
        maxWidth = 250;
        maxHeight = 150;
      }
      // Notice (almost full page!)
      else if (tagName.includes("notice")) {
        maxWidth = 600; // Usable A4 width inside margins
        maxHeight = 900; // Almost full page height
      }

      // Maintain aspect ratio - no crop, no stretch
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
