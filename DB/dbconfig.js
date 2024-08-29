import dotenv from 'dotenv/config';
import pg from "pg";

const { Client } = pg;



export const client = new Client({
    user: "default",
    host: "ep-late-dream-a47fp0wv-pooler.us-east-1.aws.neon.tech",
    database: "verceldb",
    password: "ha1HAPemuLj2" ,
    port: 5432,
    ssl: true
});

