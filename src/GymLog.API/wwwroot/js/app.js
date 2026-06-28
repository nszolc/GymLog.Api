"use strict";

const EXERCISES_API_URL = "/api/exercises";
const WORKOUTS_API_URL = "/api/workouts";

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

const TD = "border-b border-zinc-200 px-3 py-2.5 text-left align-middle text-zinc-700";
const TAG = "inline-block rounded-full border border-cyan-100 bg-cyan-100 px-2 py-0.5 text-xs font-medium text-zinc-800";
const BTN_SM = "inline-flex cursor-pointer items-center justify-center rounded-full px-3 py-1.5 text-xs font-semibold transition-colors";
const BTN_GHOST = `${BTN_SM} border border-zinc-200 bg-white text-zinc-800 hover:bg-zinc-50`;
const BTN_DANGER = `${BTN_SM} border border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100`;
const STATUS_BASE = "mb-3 rounded-lg px-3.5 py-2.5 text-sm";
const STATUS_VARIANTS = {
    error: "border border-orange-200 bg-orange-50 text-orange-800",
    success: "border border-lime-200 bg-lime-50 text-lime-800",
};
const NAV_ACTIVE = "bg-zinc-950 text-white shadow-sm";
const NAV_IDLE = "bg-transparent text-zinc-700 hover:bg-white";
const ICON_X = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 shrink-0" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>';
const ICON_ARROW_LEFT = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 shrink-0" aria-hidden="true"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>';

const homeLogoBtn = document.getElementById("home-logo-btn");
const navButtons = document.querySelectorAll(".nav-btn");
const exercisesView = document.getElementById("exercises-view");
const workoutsView = document.getElementById("workouts-view");
const exerciseFormPanel = document.getElementById("exercise-form-panel");
const exerciseListPanel = document.getElementById("exercise-list-panel");
const workoutFormPanel = document.getElementById("workout-form-panel");
const workoutListPanel = document.getElementById("workout-list-panel");
const workoutDetailPanel = document.getElementById("workout-detail-panel");

const form = document.getElementById("exercise-form");
const idInput = document.getElementById("exercise-id");
const nameInput = document.getElementById("name");
const descInput = document.getElementById("description");
const muscleSelect = document.getElementById("muscleGroup");
const typeSelect = document.getElementById("exerciseType");
const submitBtn = document.getElementById("submit-btn");
const cancelBtn = document.getElementById("cancel-btn");
const addExerciseBtn = document.getElementById("add-exercise-btn");
const refreshBtn = document.getElementById("refresh-btn");
const exerciseSearchInput = document.getElementById("exercise-search");
const formTitleText = document.getElementById("form-title-text");
const formTitleIcon = document.getElementById("form-title-icon");
const tbody = document.getElementById("exercise-tbody");
const emptyState = document.getElementById("empty-state");
const statusBox = document.getElementById("status");

const workoutForm = document.getElementById("workout-form");
const workoutIdInput = document.getElementById("workout-id");
const workoutNameInput = document.getElementById("workout-name");
const workoutDateInput = document.getElementById("workout-date");
const workoutNotesInput = document.getElementById("workout-notes");
const workoutSubmitBtn = document.getElementById("workout-submit-btn");
const workoutCancelBtn = document.getElementById("workout-cancel-btn");
const addWorkoutBtn = document.getElementById("add-workout-btn");
const workoutRefreshBtn = document.getElementById("workout-refresh-btn");
const workoutSearchInput = document.getElementById("workout-search");
const workoutFormTitle = document.getElementById("workout-form-title");
const workoutTbody = document.getElementById("workout-tbody");
const workoutEmptyState = document.getElementById("workout-empty-state");
const workoutStatusBox = document.getElementById("workout-status");
const workoutBackBtn = document.getElementById("workout-back-btn");
const workoutDetailRefreshBtn = document.getElementById("workout-detail-refresh-btn");
const workoutDetailTitle = document.getElementById("workout-detail-title");
const workoutDetailNotes = document.getElementById("workout-detail-notes");
const workoutExerciseForm = document.getElementById("workout-exercise-form");
const workoutExerciseSelect = document.getElementById("workout-exercise-select");
const workoutExerciseList = document.getElementById("workout-exercise-list");
const workoutExerciseEmptyState = document.getElementById("workout-exercise-empty-state");

let selectedWorkout = null;
let exerciseOptions = [];
let exercisesCache = [];
let workoutsCache = [];

function setupNavButton(button) {
    button.className = `nav-btn rounded-full px-4 py-2 text-sm font-semibold transition-colors ${NAV_IDLE}`;
}

function setActiveNav(viewName) {
    for (const button of navButtons) {
        const isActive = button.dataset.view === viewName
            || (viewName === "exercise-form" && button.dataset.view === "exercises")
            || ((viewName === "workout-form" || viewName === "workout-detail") && button.dataset.view === "workouts");

        button.className = `nav-btn rounded-full px-4 py-2 text-sm font-semibold transition-colors ${isActive ? NAV_ACTIVE : NAV_IDLE}`;
    }
}

function showView(viewName) {
    const isWorkoutView = viewName === "workouts" || viewName === "workout-form" || viewName === "workout-detail";
    exercisesView.hidden = isWorkoutView;
    workoutsView.hidden = !isWorkoutView;
    setActiveNav(viewName);

    exerciseFormPanel.hidden = viewName !== "exercise-form";
    exerciseListPanel.hidden = viewName !== "exercises";
    workoutFormPanel.hidden = viewName !== "workout-form" && viewName !== "workout-detail";
    workoutListPanel.hidden = viewName !== "workouts";
    workoutDetailPanel.hidden = viewName !== "workout-detail";

    if (viewName === "exercises") {
        loadExercises();
    }

    if (viewName === "workouts") {
        loadWorkouts();
    }
}

function populateSelect(select, map) {
    select.innerHTML = "";
    for (const [value, label] of Object.entries(map)) {
        const opt = document.createElement("option");
        opt.value = value;
        opt.textContent = label;
        select.appendChild(opt);
    }
}

function showStatus(box, message, type) {
    box.textContent = message;
    box.className = `${STATUS_BASE} ${STATUS_VARIANTS[type] || ""}`;
    box.hidden = false;
    if (type === "success") {
        setTimeout(() => { box.hidden = true; }, 3000);
    }
}

function clearStatus(box) {
    box.hidden = true;
}

function setButtonContent(button, label, icon) {
    button.innerHTML = `${icon}<span>${label}</span>`;
}

function normalizeSearch(value) {
    return String(value || "").trim().toLowerCase();
}

async function getErrorMessage(res) {
    const text = await res.text();
    if (!text) return `HTTP ${res.status}`;

    try {
        const problem = JSON.parse(text);
        return problem.detail || problem.title || `HTTP ${res.status}`;
    } catch {
        return text;
    }
}

async function loadExercises() {
    clearStatus(statusBox);
    try {
        const res = await fetch(EXERCISES_API_URL);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        exercisesCache = await res.json();
        renderExercises(getFilteredExercises());
    } catch (err) {
        showStatus(statusBox, `Nie udało się wczytać listy: ${err.message}`, "error");
    }
}

function getFilteredExercises() {
    const query = normalizeSearch(exerciseSearchInput.value);
    if (!query) return exercisesCache;

    return exercisesCache.filter((ex) => {
        const text = [
            ex.id,
            ex.name,
            ex.description,
            MUSCLE_GROUPS[ex.muscleGroup],
            EXERCISE_TYPES[ex.exerciseType],
            ex.isCustom ? "własne" : "",
        ].map(normalizeSearch).join(" ");

        return text.includes(query);
    });
}

function renderExercises(exercises) {
    tbody.innerHTML = "";
    if (!exercises.length) {
        emptyState.textContent = exerciseSearchInput.value.trim()
            ? "Brak ćwiczeń pasujących do wyszukiwania."
            : "Brak ćwiczeń. Dodaj pierwsze powyżej.";
        emptyState.hidden = false;
        return;
    }
    emptyState.hidden = true;

    for (const ex of exercises) {
        const tr = document.createElement("tr");
        tr.className = "hover:bg-cyan-50/70";
        tr.innerHTML = `
            <td class="${TD}">${ex.id}</td>
            <td class="${TD}">${escapeHtml(ex.name)}</td>
            <td class="${TD}">${escapeHtml(ex.description || "-")}</td>
            <td class="${TD}"><span class="${TAG}">${MUSCLE_GROUPS[ex.muscleGroup] || ex.muscleGroup}</span></td>
            <td class="${TD}"><span class="${TAG}">${EXERCISE_TYPES[ex.exerciseType] || ex.exerciseType}</span></td>
            <td class="${TD}">${ex.isCustom ? "✓" : "-"}</td>
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

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearStatus(statusBox);

    const payload = {
        name: nameInput.value.trim(),
        description: descInput.value.trim() || null,
        muscleGroup: parseInt(muscleSelect.value, 10),
        exerciseType: parseInt(typeSelect.value, 10),
    };

    const id = idInput.value;
    const isEdit = Boolean(id);

    try {
        const res = await fetch(isEdit ? `${EXERCISES_API_URL}/${id}` : EXERCISES_API_URL, {
            method: isEdit ? "PUT" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            const detail = await res.text();
            throw new Error(detail || `HTTP ${res.status}`);
        }

        showStatus(statusBox, isEdit ? "Zaktualizowano ćwiczenie." : "Dodano ćwiczenie.", "success");
        resetForm();
        await loadExercises();
    } catch (err) {
        showStatus(statusBox, `Błąd zapisu: ${err.message}`, "error");
    }
});

function startEdit(ex) {
    showView("exercise-form");
    idInput.value = ex.id;
    nameInput.value = ex.name;
    descInput.value = ex.description || "";
    muscleSelect.value = ex.muscleGroup;
    typeSelect.value = ex.exerciseType;

    formTitleText.textContent = `Edytuj ćwiczenie #${ex.id}`;
    formTitleIcon.hidden = true;
    submitBtn.textContent = "Zapisz zmiany";
    setButtonContent(cancelBtn, "Wróć do listy", ICON_ARROW_LEFT);
    cancelBtn.hidden = false;
}

function resetForm() {
    form.reset();
    idInput.value = "";
    formTitleText.textContent = "Dodaj ćwiczenie";
    formTitleIcon.hidden = false;
    submitBtn.textContent = "Dodaj";
    setButtonContent(cancelBtn, "Anuluj", ICON_X);
    cancelBtn.hidden = true;
}

function startExerciseCreate() {
    resetForm();
    setButtonContent(cancelBtn, "Anuluj", ICON_X);
    cancelBtn.hidden = false;
    showView("exercise-form");
}

async function deleteExercise(id, name) {
    if (!confirm(`Usunąć ćwiczenie "${name}"?`)) return;
    clearStatus(statusBox);
    try {
        const res = await fetch(`${EXERCISES_API_URL}/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error(await getErrorMessage(res));
        showStatus(statusBox, "Usunięto ćwiczenie.", "success");
        await loadExercises();
    } catch (err) {
        showStatus(statusBox, `Błąd usuwania: ${err.message}`, "error");
    }
}

async function loadWorkouts() {
    clearStatus(workoutStatusBox);
    try {
        const res = await fetch(WORKOUTS_API_URL);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        workoutsCache = await res.json();
        renderWorkouts(getFilteredWorkouts());
    } catch (err) {
        showStatus(workoutStatusBox, `Nie udało się wczytać treningów: ${err.message}`, "error");
    }
}

async function loadExerciseOptions() {
    const res = await fetch(EXERCISES_API_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    exerciseOptions = await res.json();
    workoutExerciseSelect.innerHTML = "";

    for (const exercise of exerciseOptions) {
        const option = document.createElement("option");
        option.value = exercise.id;
        option.textContent = exercise.name;
        workoutExerciseSelect.appendChild(option);
    }
}

function renderWorkouts(workouts) {
    workoutTbody.innerHTML = "";
    if (!workouts.length) {
        workoutEmptyState.textContent = workoutSearchInput.value.trim()
            ? "Brak treningów pasujących do wyszukiwania."
            : "Brak treningów. Dodaj pierwszy powyżej.";
        workoutEmptyState.hidden = false;
        return;
    }
    workoutEmptyState.hidden = true;

    for (const workout of workouts) {
        const tr = document.createElement("tr");
        tr.className = "hover:bg-cyan-50/70";
        tr.innerHTML = `
            <td class="${TD}">${workout.id}</td>
            <td class="${TD}">${escapeHtml(workout.name || "-")}</td>
            <td class="${TD}"><span class="${TAG}">${formatDate(workout.date)}</span></td>
            <td class="${TD}">${escapeHtml(workout.notes || "-")}</td>
        `;

        const actions = document.createElement("td");
        actions.className = `${TD} whitespace-nowrap`;

        const wrap = document.createElement("div");
        wrap.className = "flex gap-1.5";

        const editBtn = document.createElement("button");
        editBtn.className = BTN_GHOST;
        editBtn.textContent = "Edytuj";
        editBtn.addEventListener("click", () => openWorkout(workout));

        const delBtn = document.createElement("button");
        delBtn.className = BTN_DANGER;
        delBtn.textContent = "Usuń";
        delBtn.addEventListener("click", () => deleteWorkout(workout.id));

        wrap.append(editBtn, delBtn);
        actions.appendChild(wrap);
        tr.appendChild(actions);
        workoutTbody.appendChild(tr);
    }
}

function getFilteredWorkouts() {
    const query = normalizeSearch(workoutSearchInput.value);
    if (!query) return workoutsCache;

    return workoutsCache.filter((workout) => {
        const text = [
            workout.id,
            workout.name,
            workout.notes,
            workout.date,
            formatDate(workout.date),
        ].map(normalizeSearch).join(" ");

        return text.includes(query);
    });
}

async function openWorkout(workout) {
    selectedWorkout = workout;
    showView("workout-detail");
    fillWorkoutForm(workout);
    renderWorkoutHeader(workout);

    try {
        await loadExerciseOptions();
        await loadWorkoutExercises(workout.id);
    } catch (err) {
        showStatus(workoutStatusBox, `Nie udało się otworzyć treningu: ${err.message}`, "error");
    }
}

function renderWorkoutHeader(workout) {
    workoutDetailTitle.textContent = workout.name || `Trening ${formatDate(workout.date)}`;
    workoutDetailNotes.textContent = `${formatDate(workout.date)}${workout.notes ? ` · ${workout.notes}` : ""}`;
}

async function loadWorkoutExercises(workoutId, clearStatusBefore = true) {
    if (clearStatusBefore) {
        clearStatus(workoutStatusBox);
    }
    const res = await fetch(`${WORKOUTS_API_URL}/${workoutId}/exercises`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const workoutExercises = await res.json();
    await renderWorkoutExercises(workoutExercises);
}

async function renderWorkoutExercises(workoutExercises) {
    workoutExerciseList.innerHTML = "";
    if (!workoutExercises.length) {
        workoutExerciseEmptyState.hidden = false;
        return;
    }
    workoutExerciseEmptyState.hidden = true;

    for (const workoutExercise of workoutExercises) {
        const sets = await loadWorkoutSets(workoutExercise.id);
        const card = document.createElement("article");
        card.className = "rounded-lg border border-zinc-200 bg-white p-4 shadow-sm";
        card.innerHTML = `
            <div class="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <div class="mb-2"><span class="${TAG}">#${workoutExercise.order}</span></div>
                    <h3 class="text-lg font-semibold">${escapeHtml(workoutExercise.exerciseName)}</h3>
                </div>
            </div>

            <h4 class="mb-2 text-sm font-semibold uppercase text-zinc-500">Serie</h4>
            <form class="set-form mb-4 grid gap-3 rounded-lg border border-orange-100 bg-orange-50/60 p-4 sm:grid-cols-[90px_110px_1fr_auto]" data-workout-exercise-id="${workoutExercise.id}" novalidate>
                <div class="flex flex-col gap-1.5">
                    <label class="text-sm font-medium text-zinc-600">Powt.</label>
                    <input type="number" name="reps" min="1" required
                           class="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-950 shadow-inner shadow-zinc-100 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-100">
                </div>
                <div class="flex flex-col gap-1.5">
                    <label class="text-sm font-medium text-zinc-600">Kg</label>
                    <input type="number" name="weightKg" min="0" step="0.01"
                           class="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-950 shadow-inner shadow-zinc-100 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-100">
                </div>
                <div class="flex flex-col gap-1.5">
                    <label class="text-sm font-medium text-zinc-600">Notatki</label>
                    <input type="text" name="notes" maxlength="500"
                           class="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-950 shadow-inner shadow-zinc-100 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-100">
                </div>
                <div class="flex items-end">
                    <button type="submit"
                            class="inline-flex w-full cursor-pointer items-center justify-center rounded-full bg-zinc-950 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-zinc-800 sm:w-auto">Dodaj serię</button>
                </div>
            </form>
        `;

        const header = card.querySelector("div");
        const removeExerciseBtn = document.createElement("button");
        removeExerciseBtn.className = BTN_DANGER;
        removeExerciseBtn.textContent = "Usuń ćwiczenie";
        removeExerciseBtn.addEventListener("click", () => removeExerciseFromWorkout(workoutExercise));
        header.appendChild(removeExerciseBtn);

        const setsWrap = document.createElement("div");
        setsWrap.className = "grid gap-2";
        renderSetsInto(setsWrap, workoutExercise, sets);

        card.appendChild(setsWrap);
        workoutExerciseList.appendChild(card);
    }
}

async function loadWorkoutSets(workoutExerciseId) {
    if (!selectedWorkout) return [];
    const res = await fetch(`${WORKOUTS_API_URL}/${selectedWorkout.id}/exercises/${workoutExerciseId}/sets`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
}

function renderSetsInto(container, workoutExercise, sets) {
    container.innerHTML = "";
    if (!sets.length) {
        const empty = document.createElement("p");
        empty.className = "rounded-lg border border-dashed border-zinc-200 p-3 text-sm text-zinc-500";
        empty.textContent = "Brak serii dla tego ćwiczenia.";
        container.appendChild(empty);
        return;
    }

    for (const set of sets) {
        const row = document.createElement("div");
        row.className = "flex flex-col gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between";
        row.innerHTML = `
            <div class="flex flex-wrap items-center gap-2 text-sm">
                <span class="${TAG}">Seria ${set.setNumber}</span>
                <span class="font-semibold text-zinc-800">${set.reps} powt.</span>
                <span class="text-zinc-600">${set.weightKg == null ? "bez kg" : `${set.weightKg} kg`}</span>
                <span class="text-zinc-500">${escapeHtml(set.notes || "")}</span>
            </div>
        `;

        const deleteBtn = document.createElement("button");
        deleteBtn.className = BTN_DANGER;
        deleteBtn.textContent = "Usuń serię";
        deleteBtn.addEventListener("click", () => deleteWorkoutSet(workoutExercise, set));
        row.appendChild(deleteBtn);
        container.appendChild(row);
    }
}

workoutForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearStatus(workoutStatusBox);

    const payload = {
        name: workoutNameInput.value.trim(),
        date: workoutDateInput.value,
        notes: workoutNotesInput.value.trim() || null,
    };

    const id = workoutIdInput.value;
    const isEdit = Boolean(id);

    try {
        const res = await fetch(isEdit ? `${WORKOUTS_API_URL}/${id}` : WORKOUTS_API_URL, {
            method: isEdit ? "PUT" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error(await getErrorMessage(res));

        const savedWorkout = isEdit
            ? { id: parseInt(id, 10), ...payload }
            : await res.json();

        showStatus(workoutStatusBox, isEdit ? "Zaktualizowano trening." : "Dodano trening.", "success");
        await openWorkout(savedWorkout);
    } catch (err) {
        showStatus(workoutStatusBox, `Błąd zapisu: ${err.message}`, "error");
    }
});

workoutExerciseForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!selectedWorkout) return;
    clearStatus(workoutStatusBox);

    const exerciseId = parseInt(workoutExerciseSelect.value, 10);

    try {
        const res = await fetch(`${WORKOUTS_API_URL}/${selectedWorkout.id}/exercises`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ exerciseId }),
        });

        if (!res.ok) {
            const detail = await res.text();
            throw new Error(detail || `HTTP ${res.status}`);
        }

        showStatus(workoutStatusBox, "Dodano ćwiczenie do treningu.", "success");
        await loadWorkoutExercises(selectedWorkout.id, false);
    } catch (err) {
        showStatus(workoutStatusBox, `Błąd dodawania ćwiczenia: ${err.message}`, "error");
    }
});

workoutExerciseList.addEventListener("submit", async (e) => {
    const form = e.target.closest(".set-form");
    if (!form || !selectedWorkout) return;
    e.preventDefault();
    clearStatus(workoutStatusBox);

    const workoutExerciseId = parseInt(form.dataset.workoutExerciseId, 10);
    const formData = new FormData(form);
    const weightValue = formData.get("weightKg");
    const notesValue = String(formData.get("notes") || "").trim();
    const payload = {
        reps: parseInt(formData.get("reps"), 10),
        weightKg: weightValue === "" ? null : parseFloat(weightValue),
        notes: notesValue || null,
    };

    try {
        const res = await fetch(`${WORKOUTS_API_URL}/${selectedWorkout.id}/exercises/${workoutExerciseId}/sets`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            const detail = await res.text();
            throw new Error(detail || `HTTP ${res.status}`);
        }

        form.reset();
        showStatus(workoutStatusBox, "Dodano serię.", "success");
        await loadWorkoutExercises(selectedWorkout.id, false);
    } catch (err) {
        showStatus(workoutStatusBox, `Błąd dodawania serii: ${err.message}`, "error");
    }
});

async function removeExerciseFromWorkout(workoutExercise) {
    if (!selectedWorkout) return;
    if (!confirm(`Usunąć "${workoutExercise.exerciseName}" z treningu?`)) return;
    clearStatus(workoutStatusBox);

    try {
        const res = await fetch(`${WORKOUTS_API_URL}/${selectedWorkout.id}/exercises/${workoutExercise.id}`, {
            method: "DELETE",
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        showStatus(workoutStatusBox, "Usunięto ćwiczenie z treningu.", "success");
        await loadWorkoutExercises(selectedWorkout.id, false);
    } catch (err) {
        showStatus(workoutStatusBox, `Błąd usuwania ćwiczenia: ${err.message}`, "error");
    }
}

async function deleteWorkoutSet(workoutExercise, set) {
    if (!selectedWorkout) return;
    if (!confirm(`Usunąć serię ${set.setNumber}?`)) return;
    clearStatus(workoutStatusBox);

    try {
        const res = await fetch(`${WORKOUTS_API_URL}/${selectedWorkout.id}/exercises/${workoutExercise.id}/sets/${set.id}`, {
            method: "DELETE",
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        showStatus(workoutStatusBox, "Usunięto serię.", "success");
        await loadWorkoutExercises(selectedWorkout.id, false);
    } catch (err) {
        showStatus(workoutStatusBox, `Błąd usuwania serii: ${err.message}`, "error");
    }
}

function fillWorkoutForm(workout) {
    workoutIdInput.value = workout.id;
    workoutNameInput.value = workout.name || "";
    workoutDateInput.value = toDateInputValue(workout.date);
    workoutNotesInput.value = workout.notes || "";
    workoutFormTitle.textContent = `Edytuj trening #${workout.id}`;
    workoutSubmitBtn.textContent = "Zapisz zmiany";
    setButtonContent(workoutCancelBtn, "Wróć do listy", ICON_ARROW_LEFT);
    workoutCancelBtn.hidden = false;
}

function resetWorkoutForm() {
    workoutForm.reset();
    selectedWorkout = null;
    workoutIdInput.value = "";
    workoutNameInput.value = "";
    workoutDateInput.value = toDateInputValue(new Date());
    workoutFormTitle.textContent = "Dodaj trening";
    workoutSubmitBtn.textContent = "Dodaj";
    setButtonContent(workoutCancelBtn, "Anuluj", ICON_X);
    workoutCancelBtn.hidden = true;
}

async function deleteWorkout(id) {
    if (!confirm(`Usunąć trening #${id}?`)) return;
    clearStatus(workoutStatusBox);
    try {
        const res = await fetch(`${WORKOUTS_API_URL}/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        showStatus(workoutStatusBox, "Usunięto trening.", "success");
        await loadWorkouts();
    } catch (err) {
        showStatus(workoutStatusBox, `Błąd usuwania: ${err.message}`, "error");
    }
}

function formatDate(value) {
    return new Intl.DateTimeFormat("pl-PL", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).format(new Date(value));
}

function toDateInputValue(value) {
    const date = new Date(value);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

for (const button of navButtons) {
    setupNavButton(button);
    button.addEventListener("click", () => showView(button.dataset.view));
}

homeLogoBtn.addEventListener("click", () => {
    resetForm();
    resetWorkoutForm();
    showView("exercises");
});
cancelBtn.addEventListener("click", () => {
    resetForm();
    showView("exercises");
});
addExerciseBtn.addEventListener("click", startExerciseCreate);
refreshBtn.addEventListener("click", loadExercises);
exerciseSearchInput.addEventListener("input", () => renderExercises(getFilteredExercises()));
workoutCancelBtn.addEventListener("click", () => {
    if (selectedWorkout) {
        resetWorkoutForm();
        showView("workouts");
        return;
    }

    resetWorkoutForm();
    showView("workouts");
});
addWorkoutBtn.addEventListener("click", () => {
    resetWorkoutForm();
    setButtonContent(workoutCancelBtn, "Anuluj", ICON_X);
    workoutCancelBtn.hidden = false;
    showView("workout-form");
});
workoutRefreshBtn.addEventListener("click", loadWorkouts);
workoutSearchInput.addEventListener("input", () => renderWorkouts(getFilteredWorkouts()));
workoutBackBtn.addEventListener("click", () => {
    resetWorkoutForm();
    showView("workouts");
});
workoutDetailRefreshBtn.addEventListener("click", async () => {
    if (!selectedWorkout) return;
    try {
        await loadWorkoutExercises(selectedWorkout.id);
    } catch (err) {
        showStatus(workoutStatusBox, `Nie udało się odświeżyć treningu: ${err.message}`, "error");
    }
});

populateSelect(muscleSelect, MUSCLE_GROUPS);
populateSelect(typeSelect, EXERCISE_TYPES);
setButtonContent(cancelBtn, "Anuluj", ICON_X);
setButtonContent(workoutCancelBtn, "Anuluj", ICON_X);
setButtonContent(workoutBackBtn, "Wróć do listy", ICON_ARROW_LEFT);
resetWorkoutForm();
showView("exercises");
