document.addEventListener("DOMContentLoaded", () => {
    // function for requests from utils.js
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

    const ENDPOINT = "http://127.0.0.1:8000"; // localhost:8000

    // login form manegement
    const loginForm = document.getElementById("login-form");
    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            try {
                const response = await fetch(`${ENDPOINT}/api/authentication_token`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email, password }),
                });

                if (response.ok) {
                    const data = await response.json();
                    localStorage.setItem("token", data.token); // store token in local storage
                    window.location.href = "board.html"; // go to board.html
                } else {
                    alert("Échec de la connexion. Vérifiez vos informations.");
                }
            } catch (error) {
                console.error("Erreur lors de la connexion :", error);
            }
        });
    }

    // Gestion de l'inscription
    const registerForm = document.getElementById("register-form");
    if (registerForm) {
        registerForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const name = document.getElementById("name").value;
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            try {
                const response = await fetch(`${ENDPOINT}/api/users`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ name, email, password }),
                });

                if (response.ok) {
                    alert("Compte créé avec succès. Vous pouvez maintenant vous connecter.");
                    window.location.href = "login.html"; // go to login.html
                } else {
                    alert("Erreur lors de l'inscription. Veuillez réessayer.");
                }
            } catch (error) {
                console.error("Erreur lors de l'inscription :", error);
            }
        });
    }
});
