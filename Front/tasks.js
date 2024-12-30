const ENDPOINT = "http://127.0.0.1:8000"; // localhost:8000
let currentProject = null;

// make request to api
async function apiFetch(endpoint, options = {}) {
    const token = localStorage.getItem("token");
    const headers = {
        "Content-Type": "application/json",
        ...options.headers,
    };
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }
    const response = await fetch(`${ENDPOINT}${endpoint}`, { ...options, headers });
    if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
    }
    return response.json();
}

// load a project from api
async function loadProjects() {
    try {
        const user = await apiFetch("/api/users/me");
        const projectUrls = user.projects;

        const projects = await Promise.all(projectUrls.map((url) => apiFetch(url)));

        const projectList = document.getElementById("project-list");
        projectList.innerHTML = "";
        projects.forEach((project) => {
            const li = document.createElement("li");
            li.textContent = project.name;
            li.dataset.id = project["@id"];
            li.addEventListener("click", () => loadProjectTasks(project));
            projectList.appendChild(li);
        });
    } catch (err) {
        console.error("Failed to load projects:", err);
    }
}

// creare
async function addProject(projectName) {
    try {
        await apiFetch("/api/projects", {
            method: "POST",
            body: JSON.stringify({ name: projectName }),
        });
        loadProjects();
    } catch (error) {
        console.error("Erreur lors de la création du projet :", error);
    }
}

// delete
async function deleteProject(projectId) {
    try {
        await apiFetch(`/api/projects/${projectId}`, {
            method: "DELETE",
        });
        loadProjects();
    } catch (error) {
        console.error("Erreur lors de la suppression du projet :", error);
    }
}

// cload tasks for a project
async function loadTasks(projectId) {
    try {
        const project = await apiFetch(`/api/projects/${projectId}`);
        const tasks = project.categories.flatMap((category) => category.tasks);

        ["todo", "in-progress", "done"].forEach((status) => {
            document.getElementById(`${status}-list`).innerHTML = "";
        });

        tasks.forEach((task) => {
            const taskElement = createTaskElement(task);
            document.getElementById(`${task.completed ? "done" : "todo"}-list`).appendChild(taskElement);
        });
    } catch (error) {
        console.error("Erreur lors du chargement des tâches :", error);
    }
}

// create a new task
async function addTask(taskName, categoryId) {
    try {
        const response = await apiFetch("/api/tasks", {
            method: "POST",
            body: JSON.stringify({
                title: taskName,
                completed: false,
                category: categoryId, // "/api/categories/1"
            }),
        });
        const newTask = response;
        const taskElement = createTaskElement(newTask);
        document.getElementById("todo-list").appendChild(taskElement);
    } catch (error) {
        console.error("Erreur lors de l'ajout de la tâche :", error);
    }
}

// create a new task
function createTaskElement(task) {
    const taskElement = document.createElement("li");
    taskElement.classList.add("task");
    taskElement.dataset.id = task.id;
    taskElement.textContent = task.title;
    return taskElement;
}

// Gestion de la déconnexion
document.getElementById("logout-btn").addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "login.html"; // logout page
});

// Initialisation
document.addEventListener("DOMContentLoaded", () => {
    // check auth
    if (!localStorage.getItem("token")) {
        window.location.href = "login.html";
    }

    loadProjects();

    // modals
    document.getElementById("add-project-btn").addEventListener("click", () => {
        document.getElementById("project-modal").classList.remove("hidden");
    });

    document.getElementById("close-project-modal-btn").addEventListener("click", () => {
        document.getElementById("project-modal").classList.add("hidden");
    });

    document.getElementById("add-task-btn").addEventListener("click", () => {
        document.getElementById("task-modal").classList.remove("hidden");
    });

    document.getElementById("close-task-modal-btn").addEventListener("click", () => {
        document.getElementById("task-modal").classList.add("hidden");
    });

    document.getElementById("add-project-form").addEventListener("submit", async (e) => {
        e.preventDefault();
        const projectName = document.getElementById("project-name").value;
        await addProject(projectName);
        document.getElementById("project-modal").classList.add("hidden");
    });

    document.getElementById("add-task-form").addEventListener("submit", async (e) => {
        e.preventDefault();
        const taskName = document.getElementById("task-name").value;
        const categoryId = document.getElementById("category-id").value; // get the category id
        await addTask(taskName, categoryId);
        document.getElementById("task-modal").classList.add("hidden");
    });
});
