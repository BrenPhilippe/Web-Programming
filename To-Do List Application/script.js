// Select elements from the page
const form = document.getElementById("taskForm");
const input = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const searchInput = document.getElementById("searchInput");
const charCount = document.getElementById("charCount");
const errorMessage = document.getElementById("errorMessage");
const taskList = document.getElementById("taskList");
const emptyMessage = document.getElementById("emptyMessage");
const totalCount = document.getElementById("totalCount");
const doneCount = document.getElementById("doneCount");
const clearCompletedBtn = document.getElementById("clearCompleted");
const clearAllBtn = document.getElementById("clearAll");
const filterButtons = document.querySelectorAll(".filters .btn");

// App data
let tasks = [];
let currentFilter = "all";
let currentSearch = "";

// Storage key for localStorage
const STORAGE_KEY = "portfolio_todo_tasks";

// Save tasks
function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

// Load tasks
function loadTasks() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) tasks = JSON.parse(saved);
}

// Show error message
function showError(msg) {
  errorMessage.textContent = msg;
}

// Clear error message
function clearError() {
  errorMessage.textContent = "";
}

// Clean input text
function normalize(text) {
  return text.trim().replace(/\s+/g, " ");
}

// Check for duplicate tasks
function taskExists(text, ignoreId = null) {
  const t = normalize(text).toLowerCase();
  return tasks.some(task =>
    normalize(task.text).toLowerCase() === t && task.id !== ignoreId
  );
}

// Format timestamp  
function formatTime(date) {
  return new Date(date).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit"
  });
}

// Update task counts
function updateCounts() {
  totalCount.textContent = `Total: ${tasks.length}`;
  doneCount.textContent = `Completed: ${tasks.filter(t => t.done).length}`;
}

// Character counter  
function updateCharCount() {
  charCount.textContent = `Characters: ${input.value.length}`;
}

// Enable/disable Add button  
function updateAddButton() {
  addBtn.disabled = normalize(input.value) === "";
}

// Show or hide empty message  
function updateEmptyMessage(count) {
  emptyMessage.style.display = count === 0 ? "block" : "none";
}

// Filter tasks
function passesFilter(task) {
  if (currentFilter === "active") return !task.done;
  if (currentFilter === "completed") return task.done;
  return true;
}

// Search tasks  
function passesSearch(task) {
  if (!currentSearch) return true;
  return task.text.toLowerCase().includes(currentSearch);
}

// Create task item
function createTaskElement(task) {
  const li = document.createElement("li");
  li.className = "task-item";

  const main = document.createElement("div");
  main.className = "task-main";

  const text = document.createElement("span");
  text.className = "task-text";
  text.textContent = task.text;

  if (task.done) text.classList.add("done");

  // Toggle complete
  text.addEventListener("click", () => {
    task.done = !task.done;
    saveTasks();
    renderTasks();
  });

  // Timestamp display  
  const time = document.createElement("span");
  time.className = "task-time";
  time.textContent = `Added at ${formatTime(task.createdAt)}`;

  const btnBox = document.createElement("div");
  btnBox.className = "task-buttons";

  // Edit button 
  const editBtn = document.createElement("button");
  editBtn.textContent = "Edit";
  editBtn.className = "btn ghost small";

  editBtn.addEventListener("click", () => {
    const newText = prompt("Edit task:", task.text);
    if (newText === null) return;

    const cleaned = normalize(newText);

    if (cleaned === "") {
      showError("Task cannot be empty.");
      return;
    }

    if (taskExists(cleaned, task.id)) {
      showError("Task already exists.");
      return;
    }

    task.text = cleaned;
    clearError();
    saveTasks();
    renderTasks();
  });

  // Delete button
  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.className = "btn danger small";

  deleteBtn.addEventListener("click", () => {
    tasks = tasks.filter(t => t.id !== task.id);
    saveTasks();
    renderTasks();
  });

  btnBox.append(editBtn, deleteBtn);
  main.append(text, time);
  li.append(main, btnBox);

  return li;
}

// Render tasks
function renderTasks() {
  taskList.innerHTML = "";

  let visible = 0;

  tasks.forEach(task => {
    if (passesFilter(task) && passesSearch(task)) {
      taskList.appendChild(createTaskElement(task));
      visible++;
    }
  });

  updateCounts();
  updateEmptyMessage(visible); 
}

// Add task
form.addEventListener("submit", e => {
  e.preventDefault();

  const text = normalize(input.value);

  if (!text) {
    showError("Task cannot be empty.");
    return;
  }

  if (taskExists(text)) {
    showError("Task already exists."); 
    return;
  }

  tasks.push({
    id: Date.now(),
    text,
    done: false,
    createdAt: new Date().toISOString() 
  });

  saveTasks();
  clearError();

  input.value = "";
  updateCharCount(); 
  updateAddButton(); 
  renderTasks();
});

// Input typing
input.addEventListener("input", () => {
  if (normalize(input.value)) clearError();
  updateCharCount(); 
  updateAddButton(); 
});

// Search input  
searchInput.addEventListener("input", () => {
  currentSearch = searchInput.value.trim().toLowerCase();
  renderTasks();
});

// Filter buttons
filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    currentFilter = btn.dataset.filter;

    filterButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    renderTasks();
  });
});

// Clear completed
clearCompletedBtn.addEventListener("click", () => {
  tasks = tasks.filter(t => !t.done);
  saveTasks();
  renderTasks();
});

// Clear all with confirmation  
clearAllBtn.addEventListener("click", () => {
  if (confirm("Are you sure you want to delete all tasks?")) {
    tasks = [];
    saveTasks();
    renderTasks();
  }
});

// Initialize app
loadTasks();

// Add timestamp to old tasks  
tasks.forEach(task => {
  if (!task.createdAt) {
    task.createdAt = new Date(task.id).toISOString();
  }
});

saveTasks();
updateCharCount(); 
updateAddButton(); 
renderTasks();