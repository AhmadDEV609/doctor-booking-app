import "dotenv/config";
import app from "./app.js";
import db from "./db/connection.js";

db();
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});




