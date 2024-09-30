// DOM Elements
const taskInput = document.getElementById('task-input');
const addTaskBtn = document.getElementById('add-task-btn');
const taskList = document.getElementById('task-list');

// Load tasks from local storage when the page loads
window.onload = loadTasks;

// Add event listener for the "Add Task" button
addTaskBtn.addEventListener('click', addTask);

// Add task function
function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText === '') return;

    const task = {
        id: Date.now(),
        text: taskText
    };

    addTaskToDOM(task);
    saveTaskToLocalStorage(task);
    taskInput.value = ''; // Clear input field
}

// Add task to the DOM
function addTaskToDOM(task) {
    const taskItem = document.createElement('li');
    taskItem.classList.add('task-item');
    taskItem.setAttribute('data-id', task.id);

    taskItem.innerHTML = `
        <input type="text" value="${task.text}" readonly>
        <div>
            <button class="edit-task-btn">Edit</button>
            <button class="delete-task-btn">Delete</button>
        </div>
    `;

    taskList.appendChild(taskItem);

    // Event listeners for edit and delete buttons
    taskItem.querySelector('.edit-task-btn').addEventListener('click', () => editTask(taskItem));
    taskItem.querySelector('.delete-task-btn').addEventListener('click', () => deleteTask(taskItem));
}

// Save task to local storage
function saveTaskToLocalStorage(task) {
    let tasks = getTasksFromLocalStorage();
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Get tasks from local storage
function getTasksFromLocalStorage() {
    const tasks = localStorage.getItem('tasks');
    return tasks ? JSON.parse(tasks) : [];
}

// Load tasks from local storage and display them in the DOM
function loadTasks() {
    const tasks = getTasksFromLocalStorage();
    tasks.forEach(task => addTaskToDOM(task));
}

// Edit task
function editTask(taskItem) {
    const inputField = taskItem.querySelector('input');
    const editBtn = taskItem.querySelector('.edit-task-btn');

    if (editBtn.textContent === 'Edit') {
        inputField.removeAttribute('readonly');
        inputField.focus();
        editBtn.textContent = 'Save';
    } else {
        inputField.setAttribute('readonly', true);
        editBtn.textContent = 'Edit';
        updateTaskInLocalStorage(taskItem.getAttribute('data-id'), inputField.value);
    }
}

// Update task in local storage
function updateTaskInLocalStorage(id, newText) {
    let tasks = getTasksFromLocalStorage();
    tasks = tasks.map(task => task.id == id ? { ...task, text: newText } : task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Delete task
function deleteTask(taskItem) {
    const taskId = taskItem.getAttribute('data-id');
    taskItem.remove();
    deleteTaskFromLocalStorage(taskId);
}

// Delete task from local storage
function deleteTaskFromLocalStorage(id) {
    let tasks = getTasksFromLocalStorage();
    tasks = tasks.filter(task => task.id != id);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}
