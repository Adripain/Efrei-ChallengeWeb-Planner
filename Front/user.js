document.addEventListener("DOMContentLoaded", async () => {
    const userTable = document.getElementById("user-table");
    const ENDPOINT = "http://127.0.0.1:8000"; // localhost:8000

    // utils.js
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

    try {
        // get user from api
        const users = await apiFetch("/api/users");

        users.forEach(user => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${user.id}</td>
                <td>${user.username}</td>
                <td>${user.roles.join(", ")}</td>
                <td>
                    <button class="edit" data-id="${user.id}">Modifier</button>
                    <button class="delete" data-id="${user.id}">Supprimer</button>
                </td>
            `;
            userTable.appendChild(row);
        });

        // Gestion des clics sur les boutons Modifier et Supprimer
        userTable.addEventListener("click", async (e) => {
            const userId = e.target.dataset.id;

            if (e.target.classList.contains("delete")) {
                if (confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
                    try {
                        await apiFetch(`/api/users/${userId}`, { method: "DELETE" });
                        e.target.closest("tr").remove();
                        alert("Utilisateur supprimé avec succès.");
                    } catch (error) {
                        console.error("Erreur lors de la suppression :", error);
                        alert("Échec de la suppression de l'utilisateur.");
                    }
                }
            } else if (e.target.classList.contains("edit")) {
                // modification
                const username = prompt("Nouveau nom d'utilisateur :", e.target.closest("tr").children[1].textContent);
                if (username) {
                    try {
                        await apiFetch(`/api/users/${userId}`, {
                            method: "PUT",
                            body: JSON.stringify({ username }),
                        });
                        e.target.closest("tr").children[1].textContent = username;
                        alert("Utilisateur modifié avec succès.");
                    } catch (error) {
                        console.error("Erreur lors de la modification :", error);
                        alert("Échec de la modification de l'utilisateur.");
                    }
                }
            }
        });
    } catch (error) {
        console.error("Erreur lors du chargement des utilisateurs :", error);
        alert("Impossible de charger la liste des utilisateurs.");
    }
});
