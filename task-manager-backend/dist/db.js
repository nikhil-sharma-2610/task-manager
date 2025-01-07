import { Sequelize } from "sequelize";
// SQLite connection does not require a username or password
const sequelize = new Sequelize("task_manager", "root", "Meganikx@0", {
    host: "localhost",
    dialect: "mysql",
    logging: false, // Disable logging, can be set to true for debugging
});
sequelize
    .authenticate()
    .then(() => {
    console.log("SQLite connection established successfully.");
})
    .catch((error) => {
    console.error("Unable to connect to the SQLite database:", error);
});
export default sequelize;
