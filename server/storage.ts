import { db } from "@db";
import { bids, properties, users, visits, favorites } from "@shared/schema";
import { InsertBid, InsertUser, InsertVisit, User } from "@shared/schema";
import { desc, eq, sql, and } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "@db";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllProperties(): Promise<any[]>;
  getPropertyById(id: number): Promise<any | undefined>;
  getPropertyBids(propertyId: number): Promise<any[]>;
  getTopBidForProperty(propertyId: number): Promise<any | undefined>;
  createBid(bid: InsertBid): Promise<any>;
  scheduleVisit(visit: InsertVisit): Promise<any>;
  getUserBids(userId: number): Promise<any[]>;
  getUserVisits(userId: number): Promise<any[]>;
  incrementPropertyViewCount(propertyId: number): Promise<void>;
  getUserFavorites(userId: number): Promise<any[]>;
  addPropertyToFavorites(userId: number, propertyId: number): Promise<any>;
  removePropertyFromFavorites(userId: number, propertyId: number): Promise<boolean>;
  isPropertyFavorited(userId: number, propertyId: number): Promise<boolean>;
  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool, 
      createTableIfMissing: true 
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    const result = await db.query.users.findFirst({
      where: eq(users.id, id),
    });
    return result;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.query.users.findFirst({
      where: eq(users.email, email),
    });
    return result;
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await db.insert(users).values(user).returning();
    return result[0];
  }

  async getAllProperties(zipCode?: string) {
    let whereClause;
    if (zipCode) {
      if (zipCode.includes('*')) {
        // Handle wildcard search
        const likePattern = zipCode.replace(/\*/g, '%');
        whereClause = sql`${properties.zipCode} LIKE ${likePattern}`;
      } else {
        // Handle exact match
        whereClause = eq(properties.zipCode, zipCode);
      }
    }

    const allProperties = await db.query.properties.findMany({
      where: whereClause,
      orderBy: desc(properties.createdAt),
    });

    // Get the top bid for each property
    const propertiesWithBids = await Promise.all(
      allProperties.map(async (property) => {
        const topBid = await this.getTopBidForProperty(property.id);
        return {
          ...property,
          topBid: topBid?.amount || null,
        };
      })
    );

    return propertiesWithBids;
  }

  async getPropertyById(id: number) {
    const property = await db.query.properties.findFirst({
      where: eq(properties.id, id),
    });

    if (!property) {
      return undefined;
    }

    const topBid = await this.getTopBidForProperty(id);

    return {
      ...property,
      topBid: topBid?.amount || null,
    };
  }

  async getPropertyBids(propertyId: number) {
    const propertyBids = await db.query.bids.findMany({
      where: eq(bids.propertyId, propertyId),
      orderBy: desc(bids.amount),
      with: {
        user: {
          columns: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    return propertyBids;
  }

  async getTopBidForProperty(propertyId: number) {
    const topBid = await db.query.bids.findFirst({
      where: eq(bids.propertyId, propertyId),
      orderBy: desc(bids.amount),
    });

    return topBid;
  }

  async createBid(bid: InsertBid) {
    const result = await db.insert(bids).values(bid).returning();
    return result[0];
  }

  async scheduleVisit(visit: InsertVisit) {
    const result = await db.insert(visits).values(visit).returning();
    return result[0];
  }

  async getUserBids(userId: number) {
    const userBids = await db.query.bids.findMany({
      where: eq(bids.userId, userId),
      orderBy: desc(bids.createdAt),
      with: {
        property: true,
      },
    });

    return userBids;
  }

  async getUserVisits(userId: number) {
    const userVisits = await db.query.visits.findMany({
      where: eq(visits.userId, userId),
      orderBy: desc(visits.createdAt),
      with: {
        property: true,
      },
    });

    return userVisits;
  }

  async incrementPropertyViewCount(propertyId: number): Promise<void> {
    await db
      .update(properties)
      .set({ viewCount: sql`${properties.viewCount} + 1` })
      .where(eq(properties.id, propertyId));
  }

  async getUserFavorites(userId: number): Promise<any[]> {
    const userFavorites = await db.query.favorites.findMany({
      where: eq(favorites.userId, userId),
      orderBy: desc(favorites.createdAt),
      with: {
        property: true,
      },
    });

    return userFavorites;
  }

  async addPropertyToFavorites(userId: number, propertyId: number): Promise<any> {
    // Check if already favorited
    const existing = await db.query.favorites.findFirst({
      where: and(
        eq(favorites.userId, userId),
        eq(favorites.propertyId, propertyId)
      ),
    });

    if (existing) {
      return existing;
    }

    const result = await db
      .insert(favorites)
      .values({
        userId,
        propertyId,
      })
      .returning();

    return result[0];
  }

  async removePropertyFromFavorites(userId: number, propertyId: number): Promise<boolean> {
    const result = await db
      .delete(favorites)
      .where(
        and(
          eq(favorites.userId, userId),
          eq(favorites.propertyId, propertyId)
        )
      )
      .returning();

    return result.length > 0;
  }

  async isPropertyFavorited(userId: number, propertyId: number): Promise<boolean> {
    const favorite = await db.query.favorites.findFirst({
      where: and(
        eq(favorites.userId, userId),
        eq(favorites.propertyId, propertyId)
      ),
    });

    return !!favorite;
  }
}

export const storage = new DatabaseStorage();
