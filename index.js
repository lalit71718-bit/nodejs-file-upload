
const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 8000;

// Create uploads folder if it doesn't exist
const uploadDir = path.join(__dirname, "uploads");
fs.mkdirSync(uploadDir, { recursive: true });

// Configure where uploaded files will be saved
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },

    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        cb(null, `${Date.now()}${ext}`);
    }
});

// Initialize Multer
const upload = multer({ storage });

// Configure EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


app.get("/", (req, res) => {
    res.render("home");
});

// Home page
// app.get("/", (req, res) => {
//     res.send(`
//         <h1>File Uploads</h1>
//         <form action="/upload" method="POST" enctype="multipart/form-data">
//             <input type="file" name="profileImage" required>
//             <button type="submit">Upload</button>
//         </form>
//     `);
// });

// Upload one file
app.post("/upload", upload.single("profileImage"), (req, res) => {
    console.log("Body:", req.body);
    console.log("File:", req.file);

    if (!req.file) {
        return res.status(400).send("Please select a file.");
    }

    return res.send(
        `File uploaded successfully! Saved as: ${req.file.filename}`
    );
});

// Handle upload errors
app.use((err, req, res, next) => {
    console.error("Upload error:", err.message);
    res.status(500).send("File upload failed: " + err.message);
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
