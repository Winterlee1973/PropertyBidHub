import { pgTable, text, serial, integer, timestamp, decimal, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  bids: many(bids),
  visits: many(visits),
}));

// Properties table
export const properties = pgTable("properties", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  description: text("description").notNull(),
  askingPrice: decimal("asking_price", { precision: 10, scale: 2 }).notNull(),
  beds: integer("beds").notNull(),
  baths: decimal("baths", { precision: 3, scale: 1 }).notNull(),
  squareFeet: integer("square_feet").notNull(),
  garageSpaces: integer("garage_spaces").default(0),
  featuredImage: text("featured_image").notNull(),
  images: text("images").array().notNull(),
  features: text("features").array(),
  isFeatured: boolean("is_featured").default(false),
  isNewListing: boolean("is_new_listing").default(false),
  isHotProperty: boolean("is_hot_property").default(false),
  endDate: timestamp("end_date").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const propertiesRelations = relations(properties, ({ many }) => ({
  bids: many(bids),
  visits: many(visits),
}));

// Bids table
export const bids = pgTable("bids", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  propertyId: integer("property_id").references(() => properties.id).notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const bidsRelations = relations(bids, ({ one }) => ({
  user: one(users, {
    fields: [bids.userId],
    references: [users.id],
  }),
  property: one(properties, {
    fields: [bids.propertyId],
    references: [properties.id],
  }),
}));

// Property visits table
export const visits = pgTable("visits", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  propertyId: integer("property_id").references(() => properties.id).notNull(),
  visitDate: timestamp("visit_date").notNull(),
  phone: text("phone"),
  questions: text("questions"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const visitsRelations = relations(visits, ({ one }) => ({
  user: one(users, {
    fields: [visits.userId],
    references: [users.id],
  }),
  property: one(properties, {
    fields: [visits.propertyId],
    references: [properties.id],
  }),
}));

// Zod schemas for validation
export const insertUserSchema = createInsertSchema(users, {
  email: (schema) => schema.email("Please enter a valid email"),
  firstName: (schema) => schema.min(2, "First name must be at least 2 characters"),
  lastName: (schema) => schema.min(2, "Last name must be at least 2 characters"),
  password: (schema) => schema.min(6, "Password must be at least 6 characters"),
}).omit({ id: true, createdAt: true });

export const insertPropertySchema = createInsertSchema(properties).omit({ 
  id: true, 
  createdAt: true 
});

export const insertBidSchema = createInsertSchema(bids, {
  amount: (schema) => schema.refine(val => 
    typeof val === 'number' && val > 0, 
    { message: "Bid amount must be greater than 0" }
  ),
}).omit({ id: true, createdAt: true });

export const insertVisitSchema = createInsertSchema(visits).omit({ 
  id: true, 
  createdAt: true 
});

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type LoginUser = z.infer<typeof loginSchema>;

export type Property = typeof properties.$inferSelect;
export type InsertProperty = z.infer<typeof insertPropertySchema>;

export type Bid = typeof bids.$inferSelect;
export type InsertBid = z.infer<typeof insertBidSchema>;

export type Visit = typeof visits.$inferSelect;
export type InsertVisit = z.infer<typeof insertVisitSchema>;
