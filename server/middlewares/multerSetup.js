const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Create local upload folders (if not exist)
const uploadBase = path.join(__dirname, "../uploads");
const folders = ["templates", "images", "generated"];

folders.forEach((folder) => {
  const dir = path.join(uploadBase, folder);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let dest = path.join(uploadBase, "images");

    // Agar user template upload kar raha hai
    if (file.fieldname === "templateFile")
      dest = path.join(uploadBase, "templates");

    cb(null, dest);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

module.exports = upload;
