const ENDPOINT = "http://127.0.0.1:5000"; // Adresse de l'API
let currentProject = null;

// Chargement des projets depuis l'API
async function loadProjects() {
    try {
        const response = await fetch(`${ENDPOINT}/project/all`);
        const projects = await response.json();
        const projectList = document.getElementById("project-list");
        projectList.innerHTML = "";

        projects.forEach(project => {
            const listItem = document.createElement("li");
            listItem.textContent = project.name;
            listItem.dataset.id = project.id;

            // Gestion du clic pour afficher les tâches du projet
            listItem.addEventListener("click", () => {
                currentProject = project;
                loadTasks(project.id);
                document.getElementById("board-section").classList.remove("hidden");
                document.getElementById("project-title").textContent = `Projet : ${project.name}`;
            });

            projectList.appendChild(listItem);
        });
    } catch (error) {
        console.error("Erreur lors du chargement des projets :", error);
    }
}

// Création d'un projet
async function addProject(projectName) {
    try {
        await fetch(`${ENDPOINT}/project/create`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: projectName }),
        });
        loadProjects();
    } catch (error) {
        console.error("Erreur lors de la création du projet :", error);
    }
}

// Suppression d'un projet
async function deleteProject(projectId) {
    try {
        await fetch(`${ENDPOINT}/project/delete`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: projectId }),
        });
        loadProjects();
    } catch (error) {
        console.error("Erreur lors de la suppression du projet :", error);
    }
}

// Chargement des tâches d'un projet
async function loadTasks(projectId) {
    try {
        const response = await fetch(`${ENDPOINT}/project/${projectId}/tasks`);
        const tasks = await response.json();

        // Réinitialisation des listes
        ["todo", "in-progress", "done"].forEach(status => {
            document.getElementById(`${status}-list`).innerHTML = "";
        });

        tasks.forEach(task => {
            const taskElement = createTaskElement(task);
            document.getElementById(`${task.status}-list`).appendChild(taskElement);
        });
    } catch (error) {
        console.error("Erreur lors du chargement des tâches :", error);
    }
}

// Création d'une tâche
async function addTask(taskName) {
    try {
        const response = await fetch(`${ENDPOINT}/project/${currentProject.id}/task/create`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: taskName }),
        });
        const newTask = await response.json();
        const taskElement = createTaskElement(newTask);
        document.getElementById("todo-list").appendChild(taskElement);
    } catch (error) {
        console.error("Erreur lors de l'ajout de la tâche :", error);
    }
}

// Création d'un élément de tâche
function createTaskElement(task) {
    const taskElement = document.createElement("li");
    taskElement.classList.add("task");
    taskElement.dataset.id = task.id;
    taskElement.textContent = task.name;
    return taskElement;
}

// Gestion de la déconnexion
document.getElementById("logout-btn").addEventListener("click", async () => {
    try {
        await fetch(`${ENDPOINT}/auth/logout`, { method: "POST" });
        window.location.href = "login.html"; // Redirige vers la page de connexion
    } catch (error) {
        console.error("Erreur lors de la déconnexion :", error);
    }
});

// Initialisation
document.addEventListener("DOMContentLoaded", () => {
    loadProjects();

    // Gestion des modals
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

    // Gestion des formulaires
    document.getElementById("add-project-form").addEventListener("submit", async (e) => {
        e.preventDefault();
        const projectName = document.getElementById("project-name").value;
        await addProject(projectName);
        document.getElementById("project-modal").classList.add("hidden");
    });

    document.getElementById("add-task-form").addEventListener("submit", async (e) => {
        e.preventDefault();
        const taskName = document.getElementById("task-name").value;
        await addTask(taskName);
        document.getElementById("task-modal").classList.add("hidden");
    });
});
