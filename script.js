const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");
const navButtons = document.querySelectorAll(".nav-btn");
const todoContainer = document.querySelector(".container");
const notesApp = document.getElementById("notes-app");
const notesBox = document.getElementById("notes-box");
const pageTitle = document.getElementById("page-title");
const titles = {
  all: "All Tasks",
  active: "To Do",
  done: "Done",
};

let undoStack = [];
let currentFilter = "all";

function addTask() {
  if (inputBox.value.trim() === "") {
    alert("You must write something before adding your list :)");
    inputBox.value = "";
    return;
  }
  saveSnapShot();
  let li = document.createElement("li");
  li.innerHTML = inputBox.value;
  listContainer.appendChild(li);

  let span = document.createElement("span");
  span.innerHTML = "\u00d7";
  li.appendChild(span);

  inputBox.value = "";
  saveData();
  applyFilter();
}

inputBox.addEventListener("keydown", function (event) {
  if (event.code === "Enter") {
    addTask();
  }
});

inputBox.addEventListener("keydown", function (event) {
  if (event.code === " ") {
    if (inputBox.value.trim() === "") {
      event.preventDefault();
      alert("You can't start your list with a space!");
    }
  }
});

listContainer.addEventListener(
  "click",
  function (event) {
    if (event.target.tagName === "LI") {
      saveSnapShot();
      event.target.classList.toggle("checked");
      saveData();
      applyFilter();
    } else if (event.target.tagName === "SPAN") {
      saveSnapShot();
      event.target.parentElement.remove();
      saveData();
    }
  },
  false,
);

navButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    currentFilter = button.dataset.filter;

    navButtons.forEach(function (b) {
      b.classList.remove("active");
    });
    button.classList.add("active");

    if (currentFilter === "notes") {
      todoContainer.classList.add("hidden");
      notesApp.classList.remove("hidden");
    } else {
      notesApp.classList.add("hidden");
      todoContainer.classList.remove("hidden");
      pageTitle.textContent = titles[currentFilter];
      applyFilter();
    }
  });
});

function applyFilter() {
  const items = listContainer.querySelectorAll("li");
  items.forEach(function (li) {
    const isDone = li.classList.contains("checked");
    if (currentFilter === "all") {
      li.style.display = "";
    } else if (currentFilter === "done") {
      li.style.display = isDone ? "" : "none";
    } else {
      li.style.display = isDone ? "none" : "";
    }
  });
}

function saveData() {
  localStorage.setItem("list-data", listContainer.innerHTML);
}

function saveSnapShot() {
  undoStack.push(listContainer.innerHTML);
}

function undo() {
  if (undoStack.length === 0) {
    return;
  }
  listContainer.innerHTML = undoStack.pop();
  saveData();
  applyFilter();
}

document.addEventListener("keydown", function (event) {
  if (
    event.target === notesBox ||
    (event.target === inputBox && inputBox.value !== "")
  ) {
    return;
  }

  if (
    (event.ctrlKey || event.metaKey) &&
    !event.shiftKey &&
    event.key.toLowerCase() === "z"
  ) {
    event.preventDefault();
    undo();
  }
});

function showTask() {
  listContainer.innerHTML = localStorage.getItem("list-data");
  applyFilter();
}

showTask();

notesApp.addEventListener("input", function () {
  localStorage.setItem("notes-data", notesBox.value);
});

function showNotes() {
  const saved = localStorage.getItem("notes-data");
  if (saved) {
    notesBox.value = saved;
  }
}

showNotes();
