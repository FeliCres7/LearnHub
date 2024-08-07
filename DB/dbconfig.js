import dotenv from 'dotenv/config'
import pg from "pg"; 

const { Client } = pg;

export const client = new Client({
    user: "default",
    host: "ep-plain-hill-a48wmywp-pooler.us-east-1.aws.neon.tech",
    database: "verceldb",
    password: "lkZJHo6fLO0t",
    port: 5432,
    ssl: true
});

client.connect(); 