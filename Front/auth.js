document.addEventListener("DOMContentLoaded", () => {
    // connexion
    const loginForm = document.getElementById("login-form");
    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            try {
                const response = await fetch("/auth/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email, password }),
                });

                if (response.ok) {
                    window.location.href = "board.html";
                } else {
                    alert("Erreur 1.");
                }
            } catch (error) {
                console.error("Erreur 2 :", error);
            }
        });
    }

    // register
    const registerForm = document.getElementById("register-form");
    if (registerForm) {
        registerForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const name = document.getElementById("name").value;
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            try {
                const response = await fetch("/auth/register", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ name, email, password }),
                });

                if (response.ok) {
                    alert("Compte créé vous pouvez vous connecter.");
                    window.location.href = "login.html"; 
                } else {
                    alert("Erreur lors de l'inscription. Réessayez.");
                }
            } catch (error) {
                console.error("Erreur :", error);
            }
        });
    }
});
