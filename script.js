const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");

let undoStack = [];

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
    } else if (event.target.tagName === "SPAN") {
      saveSnapShot();
      event.target.parentElement.remove();
      saveData();
    }
  },
  false,
);

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
}

document.addEventListener("keydown", function (event) {
  if (event.target === inputBox && inputBox.value !== "") {
    return;
  }
  if ((event.ctrlKey || event.metaKey) && !event.shiftKey) {
    if (event.key === "z" || event.key === "Z") {
      event.preventDefault();
      undo();
    }
  }
});

function showTask() {
  listContainer.innerHTML = localStorage.getItem("list-data");
}

showTask();
