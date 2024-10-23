const taskForm = document.getElementById('task-form');
const taskList = document.getElementById('task-list');
const feedback = document.getElementById('feedback');

// Fetch all tasks
async function fetchTasks() {
  try {
    const response = await fetch('http://localhost:9003/tasks');
    const tasks = await response.json();
    taskList.innerHTML = '';
    tasks.forEach(task => {
      const li = document.createElement('li');
      li.innerHTML = `
        <span>${task.title}</span>
        <button class="delete-btn" data-id="${task._id}">Delete</button>
      `;
      taskList.appendChild(li);
    });
  } catch (error) {
    feedback.textContent = 'Error fetching tasks';
  }
}

// Add a new task
taskForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = document.getElementById('title').value;
  const description = document.getElementById('description').value;

  if (!title) {
    feedback.textContent = 'Title is required';
    return;
  }

  try {
    const response = await fetch('http://localhost:9003/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, description }),
    });

    if (response.ok) {
      feedback.textContent = 'Task added successfully';
      taskForm.reset();
      fetchTasks();
    } else {
      feedback.textContent = 'Error adding task';
    }
  } catch (error) {
    feedback.textContent = 'Error adding task';
  }
});

// Delete a task
taskList.addEventListener('click', async (e) => {
  if (e.target.classList.contains('delete-btn')) {
    const taskId = e.target.getAttribute('data-id');
    try {
      const response = await fetch(`http://localhost:9003/tasks/${taskId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        feedback.textContent = 'Task deleted successfully';
        fetchTasks();
      } else {
        feedback.textContent = 'Error deleting task';
      }
    } catch (error) {
      feedback.textContent = 'Error deleting task';
    }
  }
});

// Initial fetch of tasks
fetchTasks();