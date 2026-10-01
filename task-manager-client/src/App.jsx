import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:5065/api/Tasks";

function App() {
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);

    // Get all tasks
    const fetchTasks = async () => {
        try {
            const response = await fetch(API_URL);

            if (!response.ok) {
                throw new Error("Failed to fetch tasks");
            }

            const data = await response.json();
            setTasks(data);
        } catch (error) {
            console.error("Error:", error);
        }
    };

    // Load tasks when page opens
    useEffect(() => {
        fetchTasks();
    }, []);

    // Create a new task
    const addTask = async (e) => {
        e.preventDefault();

        if (!title.trim()) {
            alert("Please enter a task title.");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: title,
                    description: description,
                    iscompleted: false,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to create task");
            }

            setTitle("");
            setDescription("");

            await fetchTasks();
        } catch (error) {
            console.error("Error:", error);
            alert("Could not create task.");
        } finally {
            setLoading(false);
        }
    };

    // Delete a task
    const deleteTask = async (id) => {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Failed to delete task");
            }

            await fetchTasks();
        } catch (error) {
            console.error("Error:", error);
            alert("Could not delete task.");
        }
    };

    // Mark task as completed
    const toggleTask = async (task) => {
        try {
            const response = await fetch(`${API_URL}/${task.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: task.id,
                    title: task.title,
                    description: task.description,
                    iscompleted: !task.iscompleted,
                    created_At: task.created_At,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to update task");
            }

            await fetchTasks();
        } catch (error) {
            console.error("Error:", error);
            alert("Could not update task.");
        }
    };

    return (
        <div className="app">
            <header className="header">
                <div>
                    <h1>Task Manager</h1>
                    <p>Manage your tasks easily</p>
                </div>
            </header>

            <main className="container">
                <section className="add-task-card">
                    <h2>Add New Task</h2>

                    <form onSubmit={addTask}>
                        <input
                            type="text"
                            placeholder="Task title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />

                        <textarea
                            placeholder="Task description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows="4"
                        />

                        <button type="submit" disabled={loading}>
                            {loading ? "Adding..." : "Add Task"}
                        </button>
                    </form>
                </section>

                <section className="tasks-section">
                    <div className="section-heading">
                        <h2>My Tasks</h2>
                        <span>{tasks.length} task(s)</span>
                    </div>

                    {tasks.length === 0 ? (
                        <div className="empty-state">
                            <h3>No tasks yet</h3>
                            <p>Add your first task using the form above.</p>
                        </div>
                    ) : (
                        <div className="task-list">
                            {tasks.map((task) => (
                                <div
                                    className={`task-card ${task.iscompleted ? "completed" : ""
                                        }`}
                                    key={task.id}
                                >
                                    <div className="task-content">
                                        <h3>{task.title}</h3>

                                        <p>
                                            {task.description || "No description provided."}
                                        </p>

                                        <small>
                                            Created:{" "}
                                            {new Date(task.created_At).toLocaleString()}
                                        </small>
                                    </div>

                                    <div className="task-actions">
                                        <button
                                            className="complete-btn"
                                            onClick={() => toggleTask(task)}
                                        >
                                            {task.iscompleted ? "Undo" : "Complete"}
                                        </button>

                                        <button
                                            className="delete-btn"
                                            onClick={() => deleteTask(task.id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}

export default App;