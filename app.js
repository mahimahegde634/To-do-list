const addTodoBtn = document.getElementById("addTodoBtn");
const inputTag = document.getElementById("todoInput");
const todoListUl = document.getElementById("todoList");
const remaining = document.getElementById("remaining-count");
const clearCompletedBtn = document.getElementById("clearCompletedBtn");
const filterBtns = document.querySelectorAll(".filter-btn");

let todoText;
let todos = [];
let todosString = localStorage.getItem("todos");

// Read from localStorage
if (todosString) {
    todos = JSON.parse(todosString);
}

let currentFilter = "all"; // default filter

// Function to update footer counter based on filter
const updateRemaining = () => {
    let count;
    if (currentFilter === "active") {
        count = todos.filter(todo => !todo.isCompleted).length;
    } else if (currentFilter === "completed") {
        count = todos.filter(todo => todo.isCompleted).length;
    } else {
        // All section → show only active (not completed) items left
        count = todos.filter(todo => !todo.isCompleted).length;
    }
    remaining.innerHTML = count;
};

// Populate todos based on filter
const populateTodos = () => {
    let filteredTodos = [];

    if (currentFilter === "active") {
        filteredTodos = todos.filter(todo => !todo.isCompleted);
    } else if (currentFilter === "completed") {
        filteredTodos = todos.filter(todo => todo.isCompleted);
    } else {
        filteredTodos = todos;
    }

    let string = "";
    for (const todo of filteredTodos) {
        string += `<li id="${todo.id}" class="todo-item ${todo.isCompleted ? "completed" : ""}">
            <input type="checkbox" class="todo-checkbox" ${todo.isCompleted ? "checked" : ""} >
            <span class="todo-text">${todo.title}</span>
            <button class="delete-btn">×</button>
        </li>`;
    }
    todoListUl.innerHTML = string;

    // Checkbox toggle logic
    const todoCheckboxes = document.querySelectorAll(".todo-checkbox");
    todoCheckboxes.forEach((element) => {
        element.addEventListener("click", (e) => {
            const id = element.parentNode.id;
            todos = todos.map(todo =>
                todo.id === id ? { ...todo, isCompleted: e.target.checked } : todo
            );
            localStorage.setItem("todos", JSON.stringify(todos));
            populateTodos();
        });
    });

    // Clear completed
    clearCompletedBtn.addEventListener("click", () => {
        todos = todos.filter(todo => !todo.isCompleted);
        localStorage.setItem("todos", JSON.stringify(todos));
        populateTodos();
    });

    // Delete buttons
    let deleteBtns = document.querySelectorAll(".delete-btn");
    deleteBtns.forEach((element) => {
        element.addEventListener("click", (e) => {
            const confirmation = confirm("Do you want to delete this todo");
            if (confirmation) {
                todos = todos.filter(todo => todo.id !== e.target.parentNode.id);
                localStorage.setItem("todos", JSON.stringify(todos));
                populateTodos();
            }
        });
    });

    // update footer counter
    updateRemaining();
};

// Handle filter buttons
filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        // Remove active class from all filter buttons
        filterBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        // Update current filter
        currentFilter = btn.dataset.filter;
        populateTodos();
    });
});

// Add todo
addTodoBtn.addEventListener("click", () => {
    todoText = inputTag.value;
    if (todoText.trim().length < 4) {
        alert("You cannot add a todo that small!");
        return;
    }
    inputTag.value = "";
    let todo = {
        id: "todo-" + Date.now(),
        title: todoText,
        isCompleted: false
    };
    todos.push(todo);
    localStorage.setItem("todos", JSON.stringify(todos));
    populateTodos();
});

populateTodos();
