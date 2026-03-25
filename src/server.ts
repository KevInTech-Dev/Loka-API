import http from 'http';
import app from './app';
import env from './config/env';
import { syncDatabase, testConnection } from '@database/sequelize';
import { RunAllCron } from './cron';


let server: http.Server;

const startServer = async () => {
    const dbConnect = await testConnection();
    if (!dbConnect) {
        console.error("Failed to connect to the database. Server will not start.");
        process.exit(1);
    }

    await syncDatabase(false, false); // Set force to false and alter to true for safer schema updates

    // cron
    try {
        RunAllCron()
    } catch (e) {
        console.log(e, "error run cron");
        process.exit(1);
    }
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
