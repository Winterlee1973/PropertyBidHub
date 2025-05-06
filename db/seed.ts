import { db } from "./index";
import * as schema from "@shared/schema";
import { addDays } from "date-fns";

async function seed() {
  try {
    console.log("Seeding database...");
    
    // Check if we already have properties
    const existingProperties = await db.query.properties.findMany({
      limit: 1
    });
    
    if (existingProperties.length > 0) {
      console.log("Database already has properties. Skipping seed.");
      return;
    }

    // Generate properties data
    const properties = [
      {
        title: "Modern Lakefront Villa",
        address: "123 Lake View Dr",
        city: "Seattle",
        state: "WA",
        zipCode: "98101",
        description: "This stunning modern lakefront villa offers breathtaking views and luxurious living. Recently renovated with high-end finishes throughout, this property features an open floor plan, gourmet kitchen, and floor-to-ceiling windows to maximize the lake views.\n\nThe property includes a private dock, smart home technology, and a spacious outdoor entertaining area. The main level features a master suite with a spa-like bathroom, while the lower level includes additional bedrooms, a home theater, and direct access to the lake.",
        askingPrice: "1250000",
        beds: 4,
        baths: "3",
        squareFeet: 2800,
        garageSpaces: 2,
        featuredImage: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        images: [
          "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
          "https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
          "https://images.unsplash.com/photo-1560448075-bb485b067938?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
          "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
        ],
        features: [
          "Central Air",
          "Fireplace",
          "Hardwood Floors",
          "Home Theater",
          "Private Dock",
          "Smart Home",
          "Wine Cellar",
          "Outdoor Kitchen"
        ],
        isNewListing: true,
        endDate: addDays(new Date(), 14),
      },
      {
        title: "Downtown Luxury Condo",
        address: "456 Urban Ave",
        city: "Portland",
        state: "OR",
        zipCode: "97204",
        description: "Experience urban living at its finest with this stylish downtown luxury condo. Located in the heart of the city, this unit offers panoramic skyline views and easy access to restaurants, shopping, and nightlife.\n\nThis contemporary condo features high ceilings, floor-to-ceiling windows, and an open concept living area perfect for entertaining. The chef's kitchen includes premium appliances, quartz countertops, and custom cabinetry.",
        askingPrice: "750000",
        beds: 2,
        baths: "2",
        squareFeet: 1450,
        garageSpaces: 1,
        featuredImage: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        images: [
          "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1505691938895-1758d7feb511?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
          "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
          "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
          "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
        ],
        features: [
          "Building Security",
          "Concierge",
          "Fitness Center",
          "Rooftop Deck",
          "Smart Home",
          "Hardwood Floors",
          "Stainless Appliances",
          "Washer/Dryer"
        ],
        isHotProperty: true,
        endDate: addDays(new Date(), 7),
      },
      {
        title: "Family-Friendly Suburban Home",
        address: "789 Oak St",
        city: "Austin",
        state: "TX",
        zipCode: "78701",
        description: "Welcome to this charming family-friendly suburban home located in a prestigious neighborhood with top-rated schools. This lovingly maintained property offers the perfect balance of comfort, style, and functionality for modern family living.\n\nThe home features a bright and airy open floor plan with formal and casual living spaces. The updated kitchen includes stainless steel appliances, granite countertops, and a large island with breakfast bar seating. The backyard oasis includes a covered patio, swimming pool, and landscaped garden.",
        askingPrice: "875000",
        beds: 4,
        baths: "3",
        squareFeet: 2500,
        garageSpaces: 2,
        featuredImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        images: [
          "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
          "https://images.unsplash.com/photo-1610817352205-f6930e267652?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
          "https://images.unsplash.com/photo-1584622781564-1d987f7333c1?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
          "https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
        ],
        features: [
          "Swimming Pool",
          "Central Air",
          "Home Office",
          "Updated Kitchen",
          "Walk-in Closets",
          "Finished Basement",
          "Fenced Yard",
          "Sprinkler System"
        ],
        isNewListing: true,
        endDate: addDays(new Date(), 21),
      },
      {
        title: "Modern Townhouse",
        address: "101 Park Ave",
        city: "Denver",
        state: "CO",
        zipCode: "80202",
        description: "This modern townhouse offers contemporary living in a convenient location. Perfect for those seeking a low-maintenance lifestyle without sacrificing style or comfort. The thoughtfully designed floor plan maximizes space and light.\n\nThe home features high-end finishes throughout, including custom cabinetry, quartz countertops, and luxury vinyl plank flooring. The primary suite includes a spa-like bathroom with a walk-in shower and dual vanities. The rooftop deck offers stunning mountain views, perfect for entertaining or relaxing.",
        askingPrice: "625000",
        beds: 3,
        baths: "2.5",
        squareFeet: 1850,
        garageSpaces: 2,
        featuredImage: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        images: [
          "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1601084881623-cdf9a8ea242c?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
          "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
          "https://images.unsplash.com/photo-1600489000022-c2086d79f9d4?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
          "https://images.unsplash.com/photo-1600566753191-4c7c759cc5d3?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
        ],
        features: [
          "Rooftop Deck",
          "Mountain Views",
          "Attached Garage",
          "Energy Efficient",
          "Community Park",
          "Smart Home",
          "Central AC",
          "Gas Fireplace"
        ],
        isFeatured: true,
        endDate: addDays(new Date(), 30),
      },
      {
        title: "Historic Victorian Estate",
        address: "1234 Heritage Lane",
        city: "Charleston",
        state: "SC",
        zipCode: "29401",
        description: "Step back in time with this exquisite historic Victorian estate that has been meticulously restored to preserve its original charm while incorporating modern amenities. This architectural masterpiece showcases period details including ornate moldings, soaring ceilings, and hardwood floors.\n\nThe property sits on a large corner lot with mature landscaping, offering privacy and tranquility. The gourmet kitchen has been updated with high-end appliances while maintaining the home's historic character. The primary suite features a sitting area, walk-in closet, and luxurious bathroom.",
        askingPrice: "1850000",
        beds: 5,
        baths: "4.5",
        squareFeet: 4200,
        garageSpaces: 2,
        featuredImage: "https://images.unsplash.com/photo-1568192082720-9223b2f2454f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        images: [
          "https://images.unsplash.com/photo-1568192082720-9223b2f2454f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
          "https://images.unsplash.com/photo-1600476031747-3e3e45fdb8bc?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
          "https://images.unsplash.com/photo-1600566752355-35792bedcfea?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
          "https://images.unsplash.com/photo-1616137422495-01fd45a5c516?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
        ],
        features: [
          "Historic Details",
          "Wrap-around Porch",
          "Garden",
          "Wine Cellar",
          "Custom Millwork",
          "Stained Glass",
          "Formal Dining",
          "Library"
        ],
        isFeatured: true,
        endDate: addDays(new Date(), 45),
      },
      {
        title: "Beachfront Retreat",
        address: "555 Seaside Way",
        city: "San Diego",
        state: "CA",
        zipCode: "92101",
        description: "Escape to this stunning beachfront retreat offering unobstructed ocean views and direct beach access. This contemporary masterpiece seamlessly blends indoor and outdoor living with walls of glass that showcase the spectacular views.\n\nThe open-concept design features a gourmet kitchen, spacious living areas, and a primary suite with a private terrace overlooking the ocean. Additional highlights include a home automation system, infinity pool, and outdoor kitchen perfect for entertaining.",
        askingPrice: "3250000",
        beds: 4,
        baths: "4",
        squareFeet: 3800,
        garageSpaces: 3,
        featuredImage: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        images: [
          "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
          "https://images.unsplash.com/photo-1540518614846-7eded433c457?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
          "https://images.unsplash.com/photo-1564078516393-cf04bd966897?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
          "https://images.unsplash.com/photo-1571843439991-dd2b8e021f5b?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
        ],
        features: [
          "Ocean Views",
          "Infinity Pool",
          "Beach Access",
          "Smart Home",
          "Home Theater",
          "Outdoor Kitchen",
          "Luxury Finishes",
          "Wine Room"
        ],
        isHotProperty: true,
        endDate: addDays(new Date(), 10),
      }
    ];

    // Insert properties
    await db.insert(schema.properties).values(properties);
    console.log(`Added ${properties.length} properties to database`);

    console.log("Seeding completed successfully.");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

seed();
