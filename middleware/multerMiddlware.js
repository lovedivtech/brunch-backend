import multer from "multer";
import { memoryStorage } from "multer";

const MAX_SIZE = 5 * 1024 * 1024;
const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/svg+xml"];

const fileFilter = (req, file, cb) => {
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true); // Accept the file
  } else {
    cb(new Error("Only JPG, JPEG, PNG, and SVG files are allowed"), false); // Reject the file
  }
};

const upload = multer({
  storage: memoryStorage(),
  limits: { fileSize: MAX_SIZE },
  fileFilter,
});

export default upload;
