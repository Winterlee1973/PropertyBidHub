import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { insertBidSchema, insertVisitSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes
  setupAuth(app);

  // API routes
  // Get all properties
  app.get("/api/properties", async (req, res) => {
    try {
      const zipCode = req.query.zipCode as string | undefined;
      const properties = await storage.getAllProperties(zipCode);
      return res.json(properties);
    } catch (error) {
      console.error("Error fetching properties:", error);
      return res.status(500).json({ message: "Failed to fetch properties" });
    }
  });

  // Get a specific property
  app.get("/api/properties/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid property ID" });
      }

      // Increment view count
      await storage.incrementPropertyViewCount(id);

      const property = await storage.getPropertyById(id);
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }

      // Get the top bid for this property
      const topBid = await storage.getTopBidForProperty(id);
      
      // Get all bids for this property (for stock market-like display)
      const bids = await storage.getPropertyBids(id);

      // If the user is logged in, check if they've favorited this property
      let isFavorite = false;
      if (req.isAuthenticated()) {
        isFavorite = await storage.isPropertyFavorited(req.user.id, id);
      }

      return res.json({
        ...property,
        topBid: topBid ? topBid.amount : null,
        bids: bids.map(bid => ({
          id: bid.id,
          amount: bid.amount,
          createdAt: bid.createdAt,
          // Don't include user details for privacy
        })),
        isFavorite
      });
    } catch (error) {
      console.error("Error fetching property:", error);
      return res.status(500).json({ message: "Failed to fetch property" });
    }
  });

  // Get bids for a property
  app.get("/api/properties/:id/bids", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid property ID" });
      }

      const bids = await storage.getPropertyBids(id);
      return res.json(bids);
    } catch (error) {
      console.error("Error fetching property bids:", error);
      return res.status(500).json({ message: "Failed to fetch bids" });
    }
  });

  // Place a bid on a property
  app.post("/api/properties/:id/bids", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "You must be logged in to place a bid" });
    }

    try {
      const propertyId = parseInt(req.params.id);
      if (isNaN(propertyId)) {
        return res.status(400).json({ message: "Invalid property ID" });
      }

      const property = await storage.getPropertyById(propertyId);
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }

      // Validate the bid amount
      const validatedData = insertBidSchema.parse({
        ...req.body,
        userId: req.user.id,
        propertyId,
      });

      // Get the current top bid
      const topBid = await storage.getTopBidForProperty(propertyId);
      
      // Check if the bid is higher than the current top bid and asking price
      const askingPrice = Number(property.askingPrice);
      const bidAmount = Number(validatedData.amount);

      if (bidAmount <= askingPrice) {
        return res.status(400).json({ 
          message: "Bid must be higher than the asking price" 
        });
      }

      if (topBid && bidAmount <= Number(topBid.amount)) {
        return res.status(400).json({ 
          message: "Bid must be higher than the current top bid" 
        });
      }

      const newBid = await storage.createBid(validatedData);
      return res.status(201).json(newBid);
    } catch (error) {
      console.error("Error placing bid:", error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      
      return res.status(500).json({ message: "Failed to place bid" });
    }
  });

  // Schedule a visit
  app.post("/api/properties/:id/visits", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "You must be logged in to schedule a visit" });
    }

    try {
      const propertyId = parseInt(req.params.id);
      if (isNaN(propertyId)) {
        return res.status(400).json({ message: "Invalid property ID" });
      }

      const property = await storage.getPropertyById(propertyId);
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }

      // Validate the visit data
      const validatedData = insertVisitSchema.parse({
        ...req.body,
        userId: req.user.id,
        propertyId,
      });

      const visit = await storage.scheduleVisit(validatedData);
      return res.status(201).json(visit);
    } catch (error) {
      console.error("Error scheduling visit:", error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      
      return res.status(500).json({ message: "Failed to schedule visit" });
    }
  });

  // Get user bids
  app.get("/api/user/bids", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "You must be logged in to view your bids" });
    }

    try {
      const bids = await storage.getUserBids(req.user.id);
      return res.json(bids);
    } catch (error) {
      console.error("Error fetching user bids:", error);
      return res.status(500).json({ message: "Failed to fetch bids" });
    }
  });

  // Get user visits
  app.get("/api/user/visits", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "You must be logged in to view your visits" });
    }

    try {
      const visits = await storage.getUserVisits(req.user.id);
      return res.json(visits);
    } catch (error) {
      console.error("Error fetching user visits:", error);
      return res.status(500).json({ message: "Failed to fetch visits" });
    }
  });

  // Get user favorites
  app.get("/api/user/favorites", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "You must be logged in to view your favorites" });
    }

    try {
      const favorites = await storage.getUserFavorites(req.user.id);
      return res.json(favorites);
    } catch (error) {
      console.error("Error fetching user favorites:", error);
      return res.status(500).json({ message: "Failed to fetch favorites" });
    }
  });

  // Add property to favorites
  app.post("/api/properties/:id/favorite", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "You must be logged in to save properties" });
    }

    try {
      const propertyId = parseInt(req.params.id);
      if (isNaN(propertyId)) {
        return res.status(400).json({ message: "Invalid property ID" });
      }

      const property = await storage.getPropertyById(propertyId);
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }

      const favorite = await storage.addPropertyToFavorites(req.user.id, propertyId);
      return res.status(201).json(favorite);
    } catch (error) {
      console.error("Error adding to favorites:", error);
      return res.status(500).json({ message: "Failed to add to favorites" });
    }
  });

  // Remove property from favorites
  app.delete("/api/properties/:id/favorite", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "You must be logged in to manage favorites" });
    }

    try {
      const propertyId = parseInt(req.params.id);
      if (isNaN(propertyId)) {
        return res.status(400).json({ message: "Invalid property ID" });
      }

      const removed = await storage.removePropertyFromFavorites(req.user.id, propertyId);
      if (removed) {
        return res.status(200).json({ success: true });
      } else {
        return res.status(404).json({ message: "Favorite not found" });
      }
    } catch (error) {
      console.error("Error removing from favorites:", error);
      return res.status(500).json({ message: "Failed to remove from favorites" });
    }
  });

  // Increment property view count
  app.post("/api/properties/:id/view", async (req, res) => {
    try {
      const propertyId = parseInt(req.params.id);
      if (isNaN(propertyId)) {
        return res.status(400).json({ message: "Invalid property ID" });
      }

      const property = await storage.getPropertyById(propertyId);
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }

      await storage.incrementPropertyViewCount(propertyId);
      return res.status(200).json({ success: true });
    } catch (error) {
      console.error("Error incrementing view count:", error);
      return res.status(500).json({ message: "Failed to increment view count" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
