const multer = require("multer");
const path = require("path");

// creating path to temporary saving
const tempDir = path.join(__dirname, "../", "temp");

// creating storage
const storage = multer.diskStorage({
  destination: tempDir,
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: storage,
});

module.exports = upload;
