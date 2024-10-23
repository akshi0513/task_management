const express = require('express');
const mongoose= require('mongoose');
const cors=require('cors');

const app=express();
app.use(express.json());
app.use(cors());

const port = 9003;
const mongoUrl ="mongodb+srv://akshitha99:aksh99@cluster0.zqyel.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

mongoose.connect(mongoUrl, {});
mongoose.connection.on('connected',() => {
    console.log("connected to mongoDB sucessfully");
})

// Task model
const Task = mongoose.model('Task', new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
}));

// Routes
// GET /tasks: Fetch all tasks
app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks' });
  }
});

// POST /tasks: Add a new task
app.post('/tasks', async (req, res) => {
  const { title, description } = req.body;
  if (!title) {
    return res.status(400).json({ message: 'Title is required' });
  }

  const newTask = new Task({ title, description });
  try {
    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (error) {
    res.status(500).json({ message: 'Error adding task' });
  }
});

// DELETE /tasks/:id: Delete a task by ID
app.delete('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await Task.findByIdAndDelete(id);
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting task' });
  }
});

// Start server
app.listen(port, ()=> {
    console.log("server has started on the port" + port);
})
