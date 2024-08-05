import dotenv from 'dotenv/config'
import mysql from 'mysql2/promise'

export const conn = await mysql.createConnection({

  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME, })