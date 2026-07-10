import mongoose from "mongoose";
import dns from "dns";

const connectDB = async () => {
    try {
        mongoose.connection.on("connected", () => {
            console.log("MongoDB connected successfully");
        });

        const mongodbURI = process.env.MONGODB_URI;
        const projectName = "Resume-Builder";

        if (!mongodbURI) {
            throw new Error("MONGODB_URI is not defined in the environment variables.");
        }

        try {
            await mongoose.connect(mongodbURI, { dbName: projectName });
        } catch (connectionError) {
            // Check if it's a DNS resolution failure (ECONNREFUSED) for an SRV connection string
            if (
                mongodbURI.startsWith("mongodb+srv://") &&
                (connectionError.message.includes("querySrv ECONNREFUSED") || connectionError.code === "ECONNREFUSED")
            ) { 
                console.warn("DNS querySrv failed. Attempting fallback to Google DNS (8.8.8.8) and retrying...");
                try {
                    dns.setServers(["8.8.8.8", "1.1.1.1"]);
                    await mongoose.connect(mongodbURI, { dbName: projectName });
                    return;
                } catch (retryError) {
                    throw retryError;
                }
            }
            throw connectionError;
        }

    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message || error);
        if (
            process.env.MONGODB_URI &&
            process.env.MONGODB_URI.startsWith("mongodb+srv://") &&
            (error.message.includes("querySrv ECONNREFUSED") || error.code === "ECONNREFUSED")
        ) {
            console.error(
                "\n========================================================================\n" +
                "ROOT CAUSE DETECTED: DNS SRV resolution failed.\n" +
                "Your local network or DNS server is refusing/blocking SRV record queries.\n" +
                "To fix this issue manually:\n" +
                "1. Change your local DNS settings to Google DNS (8.8.8.8) or Cloudflare DNS (1.1.1.1).\n" +
                "2. Or, use a standard MongoDB connection string (mongodb://...) that directly lists the cluster shard servers.\n" +
                "========================================================================\n"
            );
        }
    }
}
export default connectDB;