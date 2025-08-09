const taskTime = document.getElementById("task-time");
const taskText = document.getElementById("task-text");
const addTaskBtn = document.getElementById("add-task");
const floatingAddBtn = document.getElementById("floating-add");
const taskList = document.getElementById("task-list");
const toggleThemeBtn = document.getElementById("toggle-theme");
const taskCount = document.getElementById("task-count");

// Load from local storage
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Format 24h time to 12h AM/PM
function formatTime(time) {
  let [hour, minute] = time.split(":");
  hour = parseInt(hour);
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;
  return `${hour}:${minute} ${ampm}`;
}
// Show current date
function displayCurrentDate() {
  const dateEl = document.getElementById("current-date");
  const today = new Date();
  const options = { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' };
  dateEl.textContent = today.toLocaleDateString(undefined, options);
}

displayCurrentDate(); // Call on load


// Render Tasks
function renderTasks() {
  taskList.innerHTML = "";
  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = `task-item ${task.completed ? "completed" : ""}`;

    if (task.editing) {
      li.innerHTML = `
        <input type="time" id="edit-time-${index}" value="${task.timeRaw}" />
        <input type="text" id="edit-text-${index}" value="${task.text}" />
        <div class="task-actions">
          <button class="save-btn" onclick="saveTask(${index})"><i class="fas fa-save"></i></button>
          <button class="delete-btn" onclick="deleteTask(${index})"><i class="fas fa-trash"></i></button>
        </div>
      `;
    } else {
      li.innerHTML = `
        <span><strong>${task.time}</strong> - ${task.text}</span>
        <div class="task-actions">
          <button class="complete-btn" onclick="toggleComplete(${index})"><i class="fas fa-check"></i></button>
          <button class="edit-btn" onclick="editTask(${index})"><i class="fas fa-edit"></i></button>
          <button class="delete-btn" onclick="deleteTask(${index})"><i class="fas fa-trash"></i></button>
        </div>
      `;
    }

    taskList.appendChild(li);
  });

  taskCount.textContent = tasks.length;
}

// Save to local storage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
}

// Add Task
function addTask() {
  const time = taskTime.value;
  const text = taskText.value.trim();

  if (!time || !text) {
    alert("Please enter both time or task missing!");
    return;
  }

  const formattedTime = formatTime(time);
  tasks.push({ time: formattedTime, timeRaw: time, text, completed: false, editing: false });

  saveTasks();
  taskTime.value = "";
  taskText.value = "";
}

// Edit Task
function editTask(index) {
  tasks[index].editing = true;
  renderTasks();
}

// Save Edited Task
function saveTask(index) {
  const timeInput = document.getElementById(`edit-time-${index}`);
  const textInput = document.getElementById(`edit-text-${index}`);

  const time = timeInput.value;
  const text = textInput.value.trim();

  if (!time || !text) {
    alert("Please enter both time or task missing.");
    return;
  }

  tasks[index].time = formatTime(time);
  tasks[index].timeRaw = time;
  tasks[index].text = text;
  tasks[index].editing = false;

  saveTasks();
}

// Toggle Complete
function toggleComplete(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
}

// Delete Task
function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
}

// Add task from buttons
addTaskBtn.addEventListener("click", addTask);
floatingAddBtn.addEventListener("click", addTask);

// Theme Toggle
toggleThemeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  toggleThemeBtn.innerHTML = document.body.classList.contains("dark-mode")
    ? '<i class="fas fa-sun"></i>'
    : '<i class="fas fa-moon"></i>';
});

// Initial render
renderTasks(); 