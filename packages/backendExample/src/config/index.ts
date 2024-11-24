require('dotenv').config();

const USERNAME = process.env.DB_USERNAME;

const PASSWORD = process.env.DB_PASSWORD;
const HOST = process.env.DB_HOST;
const DB = process.env.DB_NAME;
const DB_PORT = parseInt(process.env.DB_PORT || '');
const PORT = parseInt(process.env.PORT || '');

export { USERNAME, PASSWORD, HOST, DB, PORT, DB_PORT };
