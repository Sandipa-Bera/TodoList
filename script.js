let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

const taskForm = document.getElementById('task-form');
const taskList = document.getElementById('task-list');
const searchInput = document.getElementById('search');
const filterPriority = document.getElementById('filter-priority');

// Save tasks to localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Render tasks
function renderTasks() {
    const search = searchInput.value.toLowerCase();
    const priorityFilter = filterPriority.value;
    taskList.innerHTML = '';
    tasks.forEach((task, index) => {
        if (
            (task.title.toLowerCase().includes(search) || task.tags.join(',').toLowerCase().includes(search)) &&
            (!priorityFilter || task.priority === priorityFilter)
        ) {
            const li = document.createElement('li');
            li.className = `task ${task.priority}`;
            li.draggable = true;
            li.dataset.index = index;
            li.innerHTML = `
                <div class="task-info">
                    <strong>${task.title}</strong>
                    <span class="task-tags">Tags: ${task.tags.join(', ')}</span>
                    <small>Due: ${task.due || 'N/A'}</small>
                </div>
                <button onclick="deleteTask(${index})">❌</button>
            `;
            taskList.appendChild(li);
        }
    });
    addDragEvents();
}

// Add new task
taskForm.addEventListener('submit', e => {
    e.preventDefault();
    const title = document.getElementById('task-title').value.trim();
    const tags = document.getElementById('task-tags').value.split(',').map(t => t.trim()).filter(t => t);
    const due = document.getElementById('task-due').value;
    const priority = document.getElementById('task-priority').value;
    tasks.push({ title, tags, due, priority });
    saveTasks();
    renderTasks();
    taskForm.reset();
});

// Delete task
function deleteTask(index) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
}

// Search and filter
searchInput.addEventListener('input', renderTasks);
filterPriority.addEventListener('change', renderTasks);

// Drag & Drop
function addDragEvents() {
    let draggedIndex = null;

    taskList.querySelectorAll('.task').forEach(task => {
        task.addEventListener('dragstart', e => {
            draggedIndex = e.target.dataset.index;
            e.target.style.opacity = '0.5';
        });

        task.addEventListener('dragend', e => {
            e.target.style.opacity = '1';
        });

        task.addEventListener('dragover', e => {
            e.preventDefault();
        });

        task.addEventListener('drop', e => {
            const targetIndex = e.target.closest('.task').dataset.index;
            const draggedTask = tasks[draggedIndex];
            tasks.splice(draggedIndex, 1);
            tasks.splice(targetIndex, 0, draggedTask);
            saveTasks();
            renderTasks();
        });
    });
}

// Initial render
renderTasks();
