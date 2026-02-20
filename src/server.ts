import http from "http";
import app from "./app";
import env from "./config/env";

let server: http.Server;

const startServer = () => {
  try {
    server = http.createServer(app);
    const PORT = env.PORT || 3000;
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error creating server:", error);
    process.exit(1);
  }
};

startServer();
