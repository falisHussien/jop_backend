const multer = require("multer");
const path = require("path");

// Configure storage
const uploadFile = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "resumes"); // Ensure this folder exists
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    }
});

const saveFile = multer({
    storage: uploadFile
});

module.exports = saveFile;
