// Select DOM elements
const form = document.getElementById("groceryForm");
const submitButton = document.getElementById("submit");
const groceryInput = document.getElementById("inputItem");
const groceryList = document.getElementById("groceryList");
const clearButton = document.getElementById("clear");

let editFlag = false; // Flag to check if we're editing
let editID = ""; // Variable to hold the ID of the item being edited

// Load items from localStorage on page load
document.addEventListener("DOMContentLoaded", loadItems);

// Add Item function (for adding new items only)
function addItem(e) {
  e.preventDefault(); // Prevent form submission behavior
  const value = groceryInput.value.trim(); // Get input value and remove extra spaces

  if (value && !editFlag) {
    // If not in edit mode, add a new item
    const id = new Date().getTime().toString(); // Generate a unique ID
    let li = createListItem(id, value);
    groceryList.appendChild(li); // Add the new item to the list
    saveToLocalStorage(id, value); // Save the item to localStorage
    setBackToDefault(); // Reset form for next item
    displayAlert("Item added successfully", "green");
  } else {
    // displayAlert("Please enter a valid item", "red"); // Alert for empty input
  }
}

// Edit Item function (for updating an existing item)
function editItem(e) {
  const li = e.target.closest("li"); // Find the closest <li> to the clicked edit button
  if (li) {
    editFlag = true; // Enable edit mode
    editID = li.getAttribute("data-id"); // Get the ID of the item to edit
    groceryInput.value = li.querySelector(".title").textContent; // Populate the input field with the current item's text
    submitButton.textContent = "done"; // Change the button text to "Update"

    // Handle the actual update when clicking submit while in edit mode
    submitButton.onclick = function () {
      const updatedValue = groceryInput.value.trim();
      if (updatedValue) {
        li.querySelector(".title").textContent = updatedValue; // Update the item's text content
        updateLocalStorage(editID, updatedValue); // Update the item in localStorage
        setBackToDefault(); // Reset form after update
        displayAlert("Item updated successfully", "green");
      } else {
        displayAlert("Please enter a valid item", "red"); // Alert for empty input
      }
    };
  }
}

// Delete Item function
function deleteItem(e) {
  const li = e.target.closest("li"); // Find the closest <li> to the clicked delete button
  if (li) {
    const id = li.getAttribute("data-id"); // Get the item's ID
    groceryList.removeChild(li); // Remove the item from the list
    removeFromLocalStorage(id); // Remove the item from localStorage
    setBackToDefault(); // Reset form
    displayAlert("Item removed", "red"); // Deletion alert
  }
}

// Clear Items function
function clearItems() {
  groceryList.innerHTML = ""; // Clear the entire list
  localStorage.removeItem("groceryItems"); // Clear items from localStorage
  setBackToDefault(); // Reset form
  displayAlert("All items cleared", "red"); // Clear all alert
}

// Reset Default function (clear input and reset state)
function setBackToDefault() {
  groceryInput.value = ""; // Clear the input field
  editFlag = false; // Reset the edit flag
  editID = ""; // Clear the edit ID
  submitButton.textContent = "Add"; // Reset the submit button text to "Add"
  submitButton.onclick = addItem; // Reset the submit button's click action to addItem
}

// Display Alert function
function displayAlert(message, color) {
  const alert = document.getElementById("alert");
  alert.textContent = message;
  alert.className = color;

  // Clear the alert after 1 second
  setTimeout(() => {
    alert.textContent = "";
    alert.className = "";
  }, 1000);
}

// Utility function to create a list item
function createListItem(id, value) {
  let li = document.createElement("li");
  li.classList.add("x");
  li.setAttribute("data-id", id); // Set the data-id attribute
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

// LocalStorage: Save item
function saveToLocalStorage(id, value) {
  const items = getFromLocalStorage();
  items.push({ id, value });
  localStorage.setItem("groceryItems", JSON.stringify(items));
}

// LocalStorage: Get items
function getFromLocalStorage() {
  return localStorage.getItem("groceryItems")
    ? JSON.parse(localStorage.getItem("groceryItems"))
    : [];
}

// LocalStorage: Update item
function updateLocalStorage(id, updatedValue) {
  const items = getFromLocalStorage();
  const updatedItems = items.map((item) =>
    item.id === id ? { ...item, value: updatedValue } : item
  );
  localStorage.setItem("groceryItems", JSON.stringify(updatedItems));
}

// LocalStorage: Remove item
function removeFromLocalStorage(id) {
  const items = getFromLocalStorage();
  const filteredItems = items.filter((item) => item.id !== id);
  localStorage.setItem("groceryItems", JSON.stringify(filteredItems));
}

// Load items from localStorage
function loadItems() {
  const items = getFromLocalStorage();
  items.forEach((item) => {
    let li = createListItem(item.id, item.value);
    groceryList.appendChild(li);
  });
}

// Event delegation for edit and delete actions
groceryList.addEventListener("click", (e) => {
  if (e.target.classList.contains("edit")) {
    editItem(e); // Edit button click
  } else if (e.target.classList.contains("delete")) {
    deleteItem(e); // Delete button click
  }
});

// Event listener for form submission (for adding new items)
form.addEventListener("submit", addItem);

// Event listener for clearing all items
clearButton.addEventListener("click", clearItems);
