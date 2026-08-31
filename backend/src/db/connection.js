import mongoose from "mongoose";

const dbconnection = async () => {
    try {
        if (mongoose.connection.readyState === 1) {
            return;
        }

        await mongoose.connect(process.env.MONGODB_URL);

        console.log("DB is connected");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        throw error;
    }
};

export default dbconnection;
