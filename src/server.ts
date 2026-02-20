/**
 * Server Entry Point
 * Starts the HTTP server and initializes database connection
 */

import dotenv from "dotenv";
dotenv.config();

import http from "http";
import app from "./app";
import { connectDatabase, syncDatabase } from "./database";

// Server instance
let server: http.Server;

/**
 * Start the server
 */
const startServer = async (): Promise<void> => {
  try {
    // Connect to database
    await connectDatabase();

    // Sync models in development (uses migrations in production)
    if (process.env.NODE_ENV !== "production") {
      await syncDatabase();
    }

    // Create HTTP server
    server = http.createServer(app);

    const port = process.env.PORT || 3000;

    // Start listening
    server.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
      console.log(`📚 Swagger docs: http://localhost:${port}/api-docs`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
};

// Start the server
startServer();

export { server };
