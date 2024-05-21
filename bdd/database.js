import { MongoClient, ServerApiVersion } from "mongodb";
import dotenv from 'dotenv';

dotenv.config();

const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASS;
const DB_NAME = process.env.DB_NAME;
const DB_URI = `mongodb+srv://${DB_USER}:${DB_PASS}@elearning.exdyomm.mongodb.net/${DB_NAME}?retryWrites=true&w=majority&ssl=true`;

const client = new MongoClient(DB_URI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        await client.connect();
        console.log("Successfully connected to MongoDB");

        const pingResult = await client.db("admin").command({ ping: 1 });
        console.log("Ping to MongoDB:", pingResult);
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        try {
            await client.close();
        } catch (closeError) {
            console.error("Error closing the connection to MongoDB:", closeError);
        }
        throw error;
    }
}

export { client, run, DB_NAME };
