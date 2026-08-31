import "dotenv/config";
import app from "./app.js";
import db from "./db/connection.js";

db();

export default app;


