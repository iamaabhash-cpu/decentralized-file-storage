const express = require("express");
const router = express.Router();

const {
  uploadFile,
  getFiles,
  deleteFile,
} = require("../controllers/fileController");

const upload = require("../middleware/upload");

// Upload file
router.post("/upload", upload.single("file"), uploadFile);

// Get all files
router.get("/files", getFiles);

// Delete file
router.delete("/delete/:filename", deleteFile);

module.exports = router;