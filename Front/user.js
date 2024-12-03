document.addEventListener("DOMContentLoaded", async () => {
    const userTable = document.getElementById("user-table");

    // recupere depuis le back
    const response = await fetch("/api/users");
    const users = await response.json();

    users.forEach(user => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.role}</td>
            <td>
                <button class="edit">Modifier</button>
                <button class="delete">Supprimer</button>
            </td>
        `;
        userTable.appendChild(row);
    });

    userTable.addEventListener("click", async (e) => {
        if (e.target.classList.contains("delete")) {
            const row = e.target.closest("tr");
            const userId = row.firstChild.textContent;

            await fetch(`/api/users/${userId}`, { method: "DELETE" });
            row.remove();
        }

    });
});