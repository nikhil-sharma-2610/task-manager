"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sequelize_1 = require("sequelize");
// SQLite connection does not require a username or password
var sequelize = new sequelize_1.Sequelize({
    dialect: "sqlite",
    storage: "./database.sqlite", // Path to SQLite file
});
sequelize
    .authenticate()
    .then(function () {
    console.log("SQLite connection established successfully.");
})
    .catch(function (error) {
    console.error("Unable to connect to the SQLite database:", error);
});
exports.default = sequelize;
