const express = require("express");
const fs = require("fs");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Root route for testing backend live
app.get("/", (req, res) => {
  res.send("Shoe Ecommerce Backend is Running ✅");
});

// API to get all products from local JSON file
app.get("/api/products", (req, res) => {
  fs.readFile("./products.json", "utf8", (err, data) => {
    if (err) {
      console.error("Error reading JSON file:", err);
      return res.status(500).json({ error: "Server error" });
    }
    res.json(JSON.parse(data));
  });
});

// Server listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
