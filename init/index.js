const mongoose = require("mongoose");
const initData = require("./data.js");
const listing = require("../models/listing.js");

// Use your Atlas connection string from .env
const DB_URL = process.env.ATLASDB_URL;

async function main() {
    await mongoose.connect(DB_URL);
}

main().then(() => {
    console.log("connection OK");
}).catch((err) => {
    console.log(err);
});

const initDB = async () => {
    try {
        // Delete all existing data
        await listing.deleteMany({});
        console.log("Data Deleted");

        // Add owner and category to each listing
        // First, you need to create a user or use an existing user ID
        // For now, we'll use a placeholder - you'll need to replace this with a real user ID
        const ownerId = "698cdc60b1c8b76ba1185add"; // Replace with actual user ID from your database

        // Add category based on location/title patterns
        initData.data = initData.data.map((obj) => {
            let category = "Rooms"; // default category

            // Assign categories based on keywords in title/location
            if (obj.title.toLowerCase().includes("beach") || obj.location.includes("Malibu") || obj.location.includes("Cancun") || obj.location.includes("Bali") || obj.location.includes("Phuket") || obj.location.includes("Mykonos") || obj.location.includes("Maldives") || obj.location.includes("Fiji")) {
                category = "Amazing Pools";
            } else if (obj.title.toLowerCase().includes("mountain") || obj.location.includes("Aspen") || obj.location.includes("Banff") || obj.location.includes("Montana") || obj.location.includes("Verbier")) {
                category = "Mountains";
            } else if (obj.title.toLowerCase().includes("city") || obj.title.toLowerCase().includes("loft") || obj.title.toLowerCase().includes("penthouse") || obj.location.includes("New York") || obj.location.includes("Los Angeles") || obj.location.includes("Miami") || obj.location.includes("Tokyo") || obj.location.includes("Dubai")) {
                category = "Iconic Cities";
            } else if (obj.title.toLowerCase().includes("castle") || obj.title.toLowerCase().includes("villa")) {
                category = "Castles";
            } else if (obj.title.toLowerCase().includes("treehouse") || obj.title.toLowerCase().includes("eco-friendly")) {
                category = "Camping";
            } else if (obj.title.toLowerCase().includes("cabin") || obj.title.toLowerCase().includes("cottage") || obj.title.toLowerCase().includes("lodge")) {
                category = "Rooms";
            } else if (obj.title.toLowerCase().includes("safari") || obj.title.toLowerCase().includes("farm")) {
                category = "Farms";
            } else if (obj.title.toLowerCase().includes("ski") || obj.location.includes("Arctic") || obj.location.includes("Swiss Alps")) {
                category = "Arctic";
            } else if (obj.title.toLowerCase().includes("island") || obj.title.toLowerCase().includes("boat")) {
                category = "Boats";
            }

            // Add geometry for map display (approximate coordinates based on location)
            const coordinates = getCoordinates(obj.location);

            return {
                ...obj,
                owner: ownerId,
                category: category,
                geometry: {
                    type: "Point",
                    coordinates: coordinates
                }
            };
        });

        await listing.insertMany(initData.data);
        console.log("Data was initialized successfully!");

        // Disconnect after seeding
        await mongoose.disconnect();
        console.log("Database disconnected");

    } catch (err) {
        console.error("Error initializing data:", err);
    }
};

// Helper function to get approximate coordinates for locations
function getCoordinates(location) {
    const coordinatesMap = {
        "Malibu": [-118.7798, 34.0259],
        "New York City": [-74.0060, 40.7128],
        "Aspen": [-106.8175, 39.1911],
        "Florence": [11.2558, 43.7696],
        "Portland": [-122.6765, 45.5152],
        "Cancun": [-86.8515, 21.1619],
        "Lake Tahoe": [-120.0324, 39.0968],
        "Los Angeles": [-118.2437, 34.0522],
        "Verbier": [7.2283, 46.0984],
        "Serengeti National Park": [34.8888, -2.3333],
        "Amsterdam": [4.9041, 52.3676],
        "Fiji": [178.0650, -17.7134],
        "Cotswolds": [-1.8369, 51.8300],
        "Boston": [-71.0589, 42.3601],
        "Bali": [115.1889, -8.4095],
        "Banff": [-115.5728, 51.1784],
        "Miami": [-80.1918, 25.7617],
        "Phuket": [98.3923, 7.8804],
        "Scottish Highlands": [-4.4257, 57.4778],
        "Dubai": [55.2708, 25.2048],
        "Montana": [-110.3626, 46.8797],
        "Mykonos": [25.3289, 37.4467],
        "Costa Rica": [-84.0907, 9.7489],
        "Charleston": [-79.9311, 32.7765],
        "Tokyo": [139.6917, 35.6762],
        "New Hampshire": [-71.5724, 43.1939],
        "Maldives": [73.2207, 3.2028]
    };

    return coordinatesMap[location] || [0, 0]; // Default coordinates if location not found
}

initDB();