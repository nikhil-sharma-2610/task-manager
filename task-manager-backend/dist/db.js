import { Sequelize } from "sequelize";
const sequelize = new Sequelize("task_manager", "root", "Meganikx@0", {
    host: "localhost",
    dialect: "mysql",
    logging: false,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
});
// Test the connection
sequelize
    .authenticate()
    .then(() => {
    console.log("Database connection established successfully.");
})
    .catch((err) => {
    console.error("Unable to connect to the database:", err);
});
export default sequelize;
