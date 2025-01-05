import { Sequelize } from "sequelize";

// SQLite connection does not require a username or password
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./database.sqlite", // Path to SQLite file
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
