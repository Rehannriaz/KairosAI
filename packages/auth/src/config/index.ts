require('dotenv').config();

const USERNAME = process.env.DB_USERNAME;

const PASSWORD = process.env.DB_PASSWORD;
const HOST = process.env.DB_HOST;
const DB = process.env.DB_NAME;
const DB_PORT = parseInt(process.env.DB_PORT || '');
const PORT = parseInt(process.env.PORT || '');
const JWT_SECRET = process.env.JWT_SECRET;
const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS || '10');

export { USERNAME, PASSWORD, HOST, DB, PORT, DB_PORT, JWT_SECRET, SALT_ROUNDS };
