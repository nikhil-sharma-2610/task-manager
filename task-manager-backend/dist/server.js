import express from "express";
import cors from "cors";
import Task from "./models/Task.js";
import sequelize from "./db.js";
import dotenv from "dotenv";
dotenv.config();
const app = express();
const port = process.env.PORT || 6001;
// Middleware
app.use(cors());
app.use(express.json());
if (process.env.NODE_ENV !== "production") {
    sequelize
        .sync({ force: true })
        .then(() => {
        console.log("Database synced successfully!");
    })
        .catch((error) => {
        console.error("Error syncing database:", error);
    });
}
// POST /tasks - Create a new task
app.post("/tasks", async (req, res) => {
    const { title, description, dueDate, priority, status } = req.body;
    try {
        // Create a new task
        const newTask = await Task.create({
            title,
            description,
            dueDate,
            priority,
            status,
        });
        // Send back the newly created task
        res.status(201).json(newTask);
    }
    catch (error) {
        console.error("Error creating task:", error);
        res.status(500).json({ message: "Error creating task" });
    }
});
// PUT /tasks/:id - Update a task
app.put("/tasks/:id", async (req, res) => {
    const { id } = req.params;
    const { title, description, dueDate, priority, status } = req.body;
    try {
        const task = await Task.findByPk(id);
        if (!task) {
            res.status(404).json({ message: "Task not found" });
            return;
        }
        // Type-safe updates
        if (title !== undefined)
            task.title = title;
        if (description !== undefined)
            task.description = description;
        if (dueDate !== undefined)
            task.dueDate = dueDate;
        if (priority !== undefined)
            task.priority = priority;
        if (status !== undefined)
            task.status = status;
        await task.save();
        res.json(task);
    }
    catch (error) {
        console.error("Error updating task:", error);
        res.status(500).json({ message: "Error updating task" });
    }
});
// DELETE /tasks/:id - Delete a task
app.delete("/tasks/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const task = await Task.findByPk(id);
        if (!task) {
            res.status(404).json({ message: "Task not found" });
            return;
        }
        await task.destroy();
        res.status(204).end();
    }
    catch (error) {
        console.error("Error deleting task:", error);
        res.status(500).json({ message: "Error deleting task" });
    }
});
// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
