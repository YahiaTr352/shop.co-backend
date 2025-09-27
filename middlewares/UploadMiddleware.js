const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "upload/"),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(file.mimetype);
    if (extname) {
      cb(null, true);
    } else {
      cb(new Error("This file type is not supported"));
    }
  },
});

const uploadFields = upload.fields([
  { name: "mainImage", maxCount: 1 },
  { name: "images-0", maxCount: 5 },
  { name: "images-1", maxCount: 5 },
  { name: "images-2", maxCount: 5 }, 
]);

module.exports = {
  uploadFields,
};
