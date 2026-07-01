const fs = require("fs");

exports.uploadFile = (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      error: "No file uploaded",
    });
  }

  res.json({
    message: "File uploaded successfully",
    file: req.file.filename,
  });
};

exports.getFiles = (req, res) => {
  fs.readdir("uploads", (err, files) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.json(files);
  });
};

exports.deleteFile = (req, res) => {
  const filePath = `uploads/${req.params.filename}`;

  fs.unlink(filePath, (err) => {
    if (err) {
      return res.status(404).json({
        error: "File not found",
      });
    }

    res.json({
      message: "File deleted successfully",
    });
  });
};