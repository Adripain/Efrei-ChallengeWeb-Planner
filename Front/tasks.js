document.addEventListener("DOMContentLoaded", () => {
    // Sélection des listes
    const lists = ["todo-list", "in-progress-list", "done-list"];
    
    // Initialisation de Sortable pour chaque liste
    lists.forEach(listId => {
        const listElement = document.getElementById(listId);

        new Sortable(listElement, {
            group: "tasks", // Les tâches peuvent être déplacées entre les colonnes
            animation: 150,
            onEnd: async (evt) => {
                const taskId = evt.item.dataset.id; // ID de la tâche
                const newStatus = evt.to.id.split("-")[0]; // Status ('todo', 'in-progress', 'done')

                // Log pour vérification (tu peux le supprimer)
                console.log(`Task ${taskId} moved to ${newStatus}`);
                
                // Envoi des données au back-end
                try {
                    await fetch(`/api/tasks/${taskId}`, {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ status: newStatus }),
                    });
                } catch (error) {
                    console.error("Erreur de mise à jour :", error);
                }
            },
        });
    });
});
