// custom-express-server.js
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import fs from "fs";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Resolve __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, "public")));

// API endpoints for testing
app.get("/api/properties", (req, res) => {
  res.json([
    {
      id: 1,
      title: "Modern Apartment in Downtown",
      address: "123 Main St",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      description: "A beautiful apartment in the heart of the city",
      askingPrice: 650000,
      bedrooms: 3,
      bathrooms: 2,
      squareFeet: 2100,
      images: ["https://source.unsplash.com/random/800x600/?apartment"],
      topBid: 655000
    },
    {
      id: 2,
      title: "Suburban Family Home",
      address: "456 Oak Lane",
      city: "Huntington",
      state: "NY",
      zipCode: "11743",
      description: "Perfect family home with large backyard",
      askingPrice: 525000,
      bedrooms: 4,
      bathrooms: 2.5,
      squareFeet: 2400,
      images: ["https://source.unsplash.com/random/800x600/?house"],
      topBid: 530000
    }
  ]);
});

app.get("/api/properties/:id", (req, res) => {
  const id = parseInt(req.params.id);
  if (id === 1) {
    res.json({
      id: 1,
      title: "Modern Apartment in Downtown",
      address: "123 Main St",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      description: "A beautiful apartment in the heart of the city",
      askingPrice: 650000,
      bedrooms: 3,
      bathrooms: 2,
      squareFeet: 2100,
      images: ["https://source.unsplash.com/random/800x600/?apartment"],
      topBid: 655000
    });
  } else {
    res.status(404).json({ message: "Property not found" });
  }
});

app.get("/api/user", (req, res) => {
  res.status(401).json({ message: "Not authenticated" });
});

// Main HTML route
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Custom Express server running at http://localhost:${PORT}`);
});