const API_URL = "http://127.0.0.1:3000/items";

const form = document.getElementById("item-form");
const nameInput = document.getElementById("name");
const categoryInput = document.getElementById("category");
const colorInput = document.getElementById("color");
const list = document.getElementById("item-list");
const submitBtn = form.querySelector("button");

let editId = null;

// Hämta och visa items
async function fetchItems() {
  const response = await fetch(API_URL);
  const items = await response.json();

  list.innerHTML = "";

  // 🟢 Tomt-läge
  if (items.length === 0) {
    list.innerHTML = `<p style="color:#666;font-style:italic;">
      Inga items ännu – lägg till ett ovan 👆
    </p>`;
    return;
  }

  items.forEach(item => {
    const div = document.createElement("div");
    div.classList.add("item-card");

    div.innerHTML = `
      <div class="color-bar" style="background:${item.color}"></div>

      <div class="item-content">
        <h3>${item.name}</h3>
        <p class="category">Kategori: <strong>${item.category}</strong></p>

        <div class="buttons">
          <button data-id="${item.id}" class="edit edit-btn">Ändra</button>
          <button data-id="${item.id}" class="delete delete-btn">Ta bort</button>
        </div>
      </div>
    `;

    list.appendChild(div);
  });
}

// Skapa / uppdatera item
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    name: nameInput.value,
    category: categoryInput.value,
    color: colorInput.value
  };

  if (editId) {
    // ✏️ UPDATE
    await fetch(`${API_URL}/${editId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    editId = null;
    submitBtn.textContent = "Spara";
  } else {
    // ➕ CREATE
    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
  }

  form.reset();
  fetchItems();
});

// Klick på Ändra / Ta bort
list.addEventListener("click", async (e) => {
  const id = e.target.dataset.id;

  // 🗑️ DELETE med bekräftelse
  if (e.target.classList.contains("delete")) {
    const confirmed = confirm("Är du säker på att du vill ta bort detta item?");
    if (!confirmed) return;

    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    fetchItems();
  }

  // ✏️ EDIT
  if (e.target.classList.contains("edit")) {
    const res = await fetch(API_URL);
    const items = await res.json();
    const item = items.find(i => i.id == id);

    nameInput.value = item.name;
    categoryInput.value = item.category;
    colorInput.value = item.color;

    editId = item.id;
    submitBtn.textContent = "Uppdatera";
  }
});

// Kör vid start
fetchItems();
