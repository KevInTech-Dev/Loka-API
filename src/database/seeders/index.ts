import {seedUsers} from "@database/seeders/user.seed";
import {testConnection} from "@database/sequelize";


const runAllSeeders = async () => {
    // Test database connection
    console.log('🔌 Connecting to database...');
    const dbConnected = await testConnection();

    if (!dbConnected) {
        console.error('❌ Failed to connect to database. Exiting...');
        process.exit(1);
    }

    await seedUsers()
}

runAllSeeders()
    .then(() => console.log('✅ All seeders executed successfully!'))
    .catch((error) => {
    console.error('❌ Error running seeders:', error);
    process.exit(1);
})

export {seedUsers};
