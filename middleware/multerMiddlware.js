import multer from "multer";
import { memoryStorage } from "multer";
const MAX_SIZE = 10 * 1024 * 1024; // 10MB
const allowedTypes = [
  "image/jpeg",
  "image/png",
  "image/jpg",
  "image/svg+xml",
  "image/webp",
];
const fileFilter = (req, file, cb) => {
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Only JPG, JPEG, PNG, WEBP, and SVG files are allowed"),
      false
    );
  }
};
const upload = multer({
  storage: memoryStorage(),
  limits: { fileSize: MAX_SIZE },
  fileFilter,
});
export default upload;
