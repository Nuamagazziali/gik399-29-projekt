const API_URL = "http://localhost:3000/items";

const form = document.getElementById("item-form");
const nameInput = document.getElementById("name");
const categoryInput = document.getElementById("category");
const colorInput = document.getElementById("color");
const list = document.getElementById("item-list");

let editId = null;

// Hämta och rendera alla items
async function fetchItems() {
  const response = await fetch(API_URL);
  const items = await response.json();

  list.innerHTML = "";

  items.forEach((item) => {
    const card = document.createElement("div");
    card.className = "item-card";
    card.style.borderLeft = `8px solid ${item.color}`;

    card.innerHTML = `
      <h3>${item.name}</h3>
      <p>Kategori: ${item.category}</p>
      <button data-id="${item.id}" class="edit-btn">Ändra</button>
      <button data-id="${item.id}" class="delete-btn">Ta bort</button>
    `;

    list.appendChild(card);
  });
}

// Skapa eller uppdatera item
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const itemData = {
    name: nameInput.value,
    category: categoryInput.value,
    color: colorInput.value,
  };

  if (editId) {
    // UPDATE
    await fetch(API_URL, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...itemData, id: editId }),
    });
    editId = null;
  } else {
    // CREATE
    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(itemData),
    });
  }

  form.reset();
  fetchItems();
});

// Klick på Ändra / Ta bort
list.addEventListener("click", async (e) => {
  const id = e.target.dataset.id;

  if (e.target.classList.contains("delete-btn")) {
    // DELETE
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    fetchItems();
  }

  if (e.target.classList.contains("edit-btn")) {
    // EDIT MODE
    const response = await fetch(API_URL);
    const items = await response.json();
    const item = items.find((i) => i.id == id);

    nameInput.value = item.name;
    categoryInput.value = item.category;
    colorInput.value = item.color;
    editId = item.id;
  }
});

// Start
fetchItems();
