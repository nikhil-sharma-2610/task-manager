import { Model, DataTypes } from "sequelize";
import sequelize from "../db.js";
// Define the Task model class
class Task extends Model {
}
// Initialize the model
Task.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
        unique: true,
    },
    title: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    dueDate: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
            isDate: true,
        }
    },
    priority: {
        type: DataTypes.ENUM("low", "medium", "high"),
        allowNull: false,
        defaultValue: "medium",
    },
    status: {
        type: DataTypes.ENUM("todo", "completed"),
        allowNull: false,
        defaultValue: "todo",
    },
}, {
    sequelize,
    tableName: "tasks",
    timestamps: true,
    paranoid: true, // Enables soft deletes
});
export default Task;
