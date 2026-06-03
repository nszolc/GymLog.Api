"use strict";

// API serwowane z tego samego origin co frontend.
const API_URL = "/api/exercises";

// Mapowania enumów (wartości muszą odpowiadać GymLog.Domain.Enums).
const MUSCLE_GROUPS = {
    1: "Klatka",
    2: "Plecy",
    3: "Barki",
    4: "Biceps",
    5: "Triceps",
    6: "Nogi",
    7: "Pośladki",
    8: "Brzuch",
    9: "Przedramiona",
    10: "Łydki",
};

const EXERCISE_TYPES = {
    1: "Złożone",
    2: "Izolowane",
};

// --- Klasy Tailwind (dla elementów tworzonych dynamicznie) ---
const TD = "border-b border-slate-700 px-3 py-2.5 text-left align-middle";
const TAG = "inline-block rounded-full border border-slate-700 bg-slate-800 px-2 py-0.5 text-xs";
const BTN_SM = "inline-flex cursor-pointer items-center justify-center rounded-lg px-2.5 py-1 text-xs transition-colors";
const BTN_GHOST = `${BTN_SM} border border-slate-700 bg-transparent text-slate-100 hover:bg-slate-800`;
const BTN_DANGER = `${BTN_SM} border border-slate-700 bg-transparent text-red-400 hover:bg-red-500/10`;
const STATUS_BASE = "mb-3 rounded-lg px-3.5 py-2.5 text-sm";
const STATUS_VARIANTS = {
    error: "border border-red-500 bg-red-500/10 text-red-400",
    success: "border border-emerald-500 bg-emerald-500/10 text-emerald-400",
};

// --- Elementy DOM ---
const form = document.getElementById("exercise-form");
const idInput = document.getElementById("exercise-id");
const nameInput = document.getElementById("name");
const descInput = document.getElementById("description");
const muscleSelect = document.getElementById("muscleGroup");
const typeSelect = document.getElementById("exerciseType");
const submitBtn = document.getElementById("submit-btn");
const cancelBtn = document.getElementById("cancel-btn");
const refreshBtn = document.getElementById("refresh-btn");
const formTitleText = document.getElementById("form-title-text");
const formTitleIcon = document.getElementById("form-title-icon");
const tbody = document.getElementById("exercise-tbody");
const emptyState = document.getElementById("empty-state");
const statusBox = document.getElementById("status");

// --- Inicjalizacja ---
function populateSelect(select, map) {
    select.innerHTML = "";
    for (const [value, label] of Object.entries(map)) {
        const opt = document.createElement("option");
        opt.value = value;
        opt.textContent = label;
        select.appendChild(opt);
    }
}

function showStatus(message, type) {
    statusBox.textContent = message;
    statusBox.className = `${STATUS_BASE} ${STATUS_VARIANTS[type] || ""}`;
    statusBox.hidden = false;
    if (type === "success") {
        setTimeout(() => { statusBox.hidden = true; }, 3000);
    }
}

function clearStatus() {
    statusBox.hidden = true;
}

// --- Wczytywanie listy ---
async function loadExercises() {
    clearStatus();
    try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const exercises = await res.json();
        renderExercises(exercises);
    } catch (err) {
        showStatus(`Nie udało się wczytać listy: ${err.message}`, "error");
    }
}

function renderExercises(exercises) {
    tbody.innerHTML = "";
    if (!exercises.length) {
        emptyState.hidden = false;
        return;
    }
    emptyState.hidden = true;

    for (const ex of exercises) {
        const tr = document.createElement("tr");
        tr.className = "hover:bg-slate-800";
        tr.innerHTML = `
            <td class="${TD}">${ex.id}</td>
            <td class="${TD}">${escapeHtml(ex.name)}</td>
            <td class="${TD}">${escapeHtml(ex.description || "—")}</td>
            <td class="${TD}"><span class="${TAG}">${MUSCLE_GROUPS[ex.muscleGroup] || ex.muscleGroup}</span></td>
            <td class="${TD}"><span class="${TAG}">${EXERCISE_TYPES[ex.exerciseType] || ex.exerciseType}</span></td>
            <td class="${TD}">${ex.isCustom ? "✓" : "—"}</td>
        `;

        const actions = document.createElement("td");
        actions.className = `${TD} whitespace-nowrap`;

        const wrap = document.createElement("div");
        wrap.className = "flex gap-1.5";

        const editBtn = document.createElement("button");
        editBtn.className = BTN_GHOST;
        editBtn.textContent = "Edytuj";
        editBtn.addEventListener("click", () => startEdit(ex));

        const delBtn = document.createElement("button");
        delBtn.className = BTN_DANGER;
        delBtn.textContent = "Usuń";
        delBtn.addEventListener("click", () => deleteExercise(ex.id, ex.name));

        wrap.append(editBtn, delBtn);
        actions.appendChild(wrap);
        tr.appendChild(actions);
        tbody.appendChild(tr);
    }
}

function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
}

// --- Tworzenie / aktualizacja ---
form.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearStatus();

    const payload = {
        name: nameInput.value.trim(),
        description: descInput.value.trim() || null,
        muscleGroup: parseInt(muscleSelect.value, 10),
        exerciseType: parseInt(typeSelect.value, 10),
    };

    const id = idInput.value;
    const isEdit = Boolean(id);

    try {
        const res = await fetch(isEdit ? `${API_URL}/${id}` : API_URL, {
            method: isEdit ? "PUT" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            const detail = await res.text();
            throw new Error(detail || `HTTP ${res.status}`);
        }

        showStatus(isEdit ? "Zaktualizowano ćwiczenie." : "Dodano ćwiczenie.", "success");
        resetForm();
        await loadExercises();
    } catch (err) {
        showStatus(`Błąd zapisu: ${err.message}`, "error");
    }
});

function startEdit(ex) {
    idInput.value = ex.id;
    nameInput.value = ex.name;
    descInput.value = ex.description || "";
    muscleSelect.value = ex.muscleGroup;
    typeSelect.value = ex.exerciseType;

    formTitleText.textContent = `Edytuj ćwiczenie #${ex.id}`;
    formTitleIcon.hidden = true;
    submitBtn.textContent = "Zapisz zmiany";
    cancelBtn.hidden = false;
    window.scrollTo({ top: 0, behavior: "smooth" });
}

function resetForm() {
    form.reset();
    idInput.value = "";
    formTitleText.textContent = "Dodaj ćwiczenie";
    formTitleIcon.hidden = false;
    submitBtn.textContent = "Dodaj";
    cancelBtn.hidden = true;
}

cancelBtn.addEventListener("click", resetForm);
refreshBtn.addEventListener("click", loadExercises);

// --- Usuwanie ---
async function deleteExercise(id, name) {
    if (!confirm(`Usunąć ćwiczenie „${name}"?`)) return;
    clearStatus();
    try {
        const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        showStatus("Usunięto ćwiczenie.", "success");
        await loadExercises();
    } catch (err) {
        showStatus(`Błąd usuwania: ${err.message}`, "error");
    }
}

// --- Start ---
populateSelect(muscleSelect, MUSCLE_GROUPS);
populateSelect(typeSelect, EXERCISE_TYPES);
loadExercises();