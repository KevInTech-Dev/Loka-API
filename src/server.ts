/**
 * Server Entry Point
 * Starts the HTTP server and initializes database connection
 */

import http from "http";
import app from "./app";

// Server instance
let server: http.Server;

/**
 * Start the server
 */
const startServer = async (): Promise<void> => {
  try {
    // Create HTTP server
    server = http.createServer(app);

    // Start listening
    server.listen(process.env.PORT || 3000, () =>
      console.log(`Server running on port ${process.env.PORT || 3000}`),
    );
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
};

// Start the server
startServer();

export { server };
