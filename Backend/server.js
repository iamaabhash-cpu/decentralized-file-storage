console.log("Backend file loaded");
console.log("Server starting");

require("dotenv").config();

const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");
const uploadToIPFS = require("./utils/ipfs");

const app = express();
app.use(cors());

// Ensure uploads folder exists
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

app.get("/", (req, res) => {
  res.send("Backend running");
});

app.post("/upload", upload.single("file"), async (req, res) => {
 console.log("🔥 UPLOAD ROUTE EXECUTING");

  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const result = await uploadToIPFS(req.file.path);

    fs.unlinkSync(req.file.path);

    res.json({
      message: "Uploaded successfully",
      cid: result.cid,
      url: result.url,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});