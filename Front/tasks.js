document.addEventListener("DOMContentLoaded", () => {
    const lists = ["todo-list", "in-progress-list", "done-list"];

    lists.forEach(listId => {
        const listElement = document.getElementById(listId);

        new Sortable(listElement, {
            group: "tasks",
            animation: 150,
            onEnd: async (evt) => {
                const taskId = evt.item.dataset.id; //id
                const newStatus = evt.to.id.split("-")[0]; // Status ('todo', 'in-progress', 'done')

                console.log(`Task ${taskId} moved to ${newStatus}`);
                
                // envois versl e back
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
