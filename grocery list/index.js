const form = document.getElementById("groceryForm");
const submitButton = document.getElementById("submit");
const groceryInput = document.getElementById("inputItem");
const groceryList = document.getElementById("groceryList");
const clearButton = document.getElementById("clear");

let editFlag = false;
let editID = "";

document.addEventListener("DOMContentLoaded", loadItems);

function addItem(e) {
  e.preventDefault();
  const value = groceryInput.value.trim();

  if (value && !editFlag) {
    const id = new Date().getTime().toString();
    let li = createListItem(id, value);
    groceryList.appendChild(li);
    saveToLocalStorage(id, value);
    setBackToDefault();
    displayAlert("Item added successfully", "green");
  } else {
  }
}

function editItem(e) {
  const li = e.target.closest("li");
  if (li) {
    editFlag = true;
    editID = li.getAttribute("data-id");
    groceryInput.value = li.querySelector(".title").textContent;
    submitButton.textContent = "done";

    submitButton.onclick = function () {
      const updatedValue = groceryInput.value.trim();
      if (updatedValue) {
        li.querySelector(".title").textContent = updatedValue;
        updateLocalStorage(editID, updatedValue);
        setBackToDefault();
        displayAlert("Item updated successfully", "green");
      } else {
        displayAlert("Please enter a valid item", "red");
      }
    };
  }
}

function deleteItem(e) {
  const li = e.target.closest("li");
  if (li) {
    const id = li.getAttribute("data-id");
    groceryList.removeChild(li);
    removeFromLocalStorage(id);
    setBackToDefault();
    displayAlert("Item removed", "red");
  }
}

function clearItems() {
  groceryList.innerHTML = "";
  localStorage.removeItem("groceryItems");
  setBackToDefault();
  displayAlert("All items cleared", "red");
}

function setBackToDefault() {
  groceryInput.value = "";
  editFlag = false;
  editID = "";
  submitButton.textContent = "Add";
  submitButton.onclick = addItem;
}

function displayAlert(message, color) {
  const alert = document.getElementById("alert");
  alert.textContent = message;
  alert.className = color;

  setTimeout(() => {
    alert.textContent = "";
    alert.className = "";
  }, 1000);
}

function createListItem(id, value) {
  let li = document.createElement("li");
  li.classList.add("x");
  li.setAttribute("data-id", id);
  li.innerHTML = `
    <div class="flex justify-between">
      <p class="text-sm title">${value}</p>
      <div>
        <button class="edit">
          <i class=" edit fa-regular fa-pen-to-square text-xs text-green-500"></i>
        </button>
        <button class="delete">
          <i class=" delete fa-solid fa-trash text-xs text-red-700"></i>
        </button>
      </div>
    </div>
  `;
  return li;
}

function saveToLocalStorage(id, value) {
  const items = getFromLocalStorage();
  items.push({ id, value });
  localStorage.setItem("groceryItems", JSON.stringify(items));
}

function getFromLocalStorage() {
  return localStorage.getItem("groceryItems")
    ? JSON.parse(localStorage.getItem("groceryItems"))
    : [];
}

function updateLocalStorage(id, updatedValue) {
  const items = getFromLocalStorage();
  const updatedItems = items.map((item) =>
    item.id === id ? { ...item, value: updatedValue } : item
  );
  localStorage.setItem("groceryItems", JSON.stringify(updatedItems));
}

function removeFromLocalStorage(id) {
  const items = getFromLocalStorage();
  const filteredItems = items.filter((item) => item.id !== id);
  localStorage.setItem("groceryItems", JSON.stringify(filteredItems));
}

function loadItems() {
  const items = getFromLocalStorage();
  items.forEach((item) => {
    let li = createListItem(item.id, item.value);
    groceryList.appendChild(li);
  });
}

groceryList.addEventListener("click", (e) => {
  if (e.target.classList.contains("edit")) {
    editItem(e); // Edit button click
  } else if (e.target.classList.contains("delete")) {
    deleteItem(e); // Delete button click
  }
});

form.addEventListener("submit", addItem);

clearButton.addEventListener("click", clearItems);
