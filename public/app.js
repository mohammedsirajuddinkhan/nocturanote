const noteForm = document.getElementById("noteForm");
const titleInput = document.getElementById("titleInput");
const descriptionInput = document.getElementById("descriptionInput");
const notesList = document.getElementById("notesList");
const statusBar = document.getElementById("statusBar");
const noteCount = document.getElementById("noteCount");
const themeToggle = document.getElementById("themeToggle");
const themeLabel = document.getElementById("themeLabel");
const submitBtn = document.getElementById("submitBtn");
const cancelEdit = document.getElementById("cancelEdit");
const formTitle = document.getElementById("formTitle");
const noteTemplate = document.getElementById("noteTemplate");

let notes = [];
let editId = null;

const themeKey = "notes-theme";

function setStatus(message, isError = false) {
  statusBar.textContent = message;
  statusBar.style.color = isError ? "var(--danger)" : "var(--muted)";
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem(themeKey, theme);
  themeLabel.textContent = theme === "dark" ? "Light mode" : "Dark mode";
}

function toggleTheme() {
  const currentTheme =
    document.documentElement.dataset.theme === "dark" ? "dark" : "light";
  applyTheme(currentTheme === "dark" ? "light" : "dark");
}

function startEdit(note) {
  editId = note._id;
  titleInput.value = note.title ?? "";
  descriptionInput.value = note.description ?? "";
  submitBtn.textContent = "Update note";
  formTitle.textContent = "Refine this note";
  cancelEdit.classList.remove("hidden");
  titleInput.focus();
}

function resetForm() {
  editId = null;
  noteForm.reset();
  submitBtn.textContent = "Add note";
  formTitle.textContent = "Write something vivid";
  cancelEdit.classList.add("hidden");
}

function renderNotes() {
  notesList.innerHTML = "";
  noteCount.textContent = `${notes.length} ${notes.length === 1 ? "note" : "notes"}`;

  if (notes.length === 0) {
    notesList.innerHTML = `
      <article class="note-card">
        <h3 class="note-title">No notes yet</h3>
        <p class="note-description">Create the first one using the form on the left. It will appear here instantly.</p>
      </article>
    `;
    return;
  }

  notes.forEach((note) => {
    const noteNode = noteTemplate.content.cloneNode(true);
    noteNode.querySelector(".note-title").textContent = note.title;
    noteNode.querySelector(".note-description").textContent = note.description;

    noteNode
      .querySelector(".edit-btn")
      .addEventListener("click", () => startEdit(note));
    noteNode
      .querySelector(".delete-btn")
      .addEventListener("click", () => deleteNote(note._id));

    notesList.appendChild(noteNode);
  });
}

async function fetchNotes() {
  setStatus("Loading notes...");

  try {
    const response = await fetch("/api/notes");
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to load notes");
    }

    notes = data.notes ?? [];
    renderNotes();
    setStatus(
      notes.length
        ? "Notes synced successfully."
        : "Ready for your first note.",
    );
  } catch (error) {
    setStatus(error.message, true);
  }
}

async function deleteNote(id) {
  try {
    const response = await fetch(`/api/notes/${id}`, { method: "DELETE" });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to delete note");
    }

    notes = notes.filter((note) => note._id !== id);
    if (editId === id) {
      resetForm();
    }
    renderNotes();
    setStatus(data.message || "Note removed.");
  } catch (error) {
    setStatus(error.message, true);
  }
}

noteForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const payload = {
    title: titleInput.value.trim(),
    description: descriptionInput.value.trim(),
  };

  if (!payload.title || !payload.description) {
    setStatus("Both title and description are required.", true);
    return;
  }

  const isEditing = Boolean(editId);
  const endpoint = isEditing ? `/api/notes/${editId}` : "/api/notes";
  const method = isEditing ? "PATCH" : "POST";

  try {
    const response = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to save note");
    }

    if (isEditing) {
      notes = notes.map((note) =>
        note._id === editId ? { ...note, ...payload } : note,
      );
      setStatus(data.message || "Note updated.");
    } else {
      await fetchNotes();
      setStatus(data.message || "Note created.");
    }

    resetForm();
    renderNotes();
  } catch (error) {
    setStatus(error.message, true);
  }
});

cancelEdit.addEventListener("click", () => {
  resetForm();
  setStatus("Edit cancelled.");
});

themeToggle.addEventListener("click", toggleTheme);

const savedTheme = localStorage.getItem(themeKey) || "light";
applyTheme(savedTheme);

fetchNotes();
