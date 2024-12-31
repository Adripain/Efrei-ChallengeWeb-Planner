document.addEventListener("DOMContentLoaded", () => {
    const saveToken = (token) => {
        localStorage.setItem("authToken", token);
    };

    const getToken = () => {
        return localStorage.getItem("authToken");
    };

    const getAPI = () => {
        return "http://localhost:8000";
    };

    const getCurrentUser = async () => {
        const token = getToken();
        if (!token) return null;

        try {
            const response = await fetch(getAPI() + "/api/user/me", {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (response.ok) {
                return await response.json();
            } else {
                console.error("Impossible de récupérer l'utilisateur connecté.");
                return null;
            }
        } catch (error) {
            console.error("Erreur lors de la récupération de l'utilisateur :", error);
            return null;
        }
    };

    const loginForm = document.getElementById("login-form");
    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            try {
                const response = await fetch(getAPI() + "/api/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ username: email, password }),
                });

                if (response.ok) {
                    const data = await response.json();
                    saveToken(data.token); 
                    window.location.href = "board.html";
                } else {
                    alert("Erreur de connexion. Vérifiez vos identifiants.");
                }
            } catch (error) {
                console.error("Erreur lors de la connexion :", error);
            }
        });
    }

    // Gestion du formulaire d'inscription
    const registerForm = document.getElementById("register-form");
    if (registerForm) {
        registerForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const name = document.getElementById("name").value;
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            try {
                const response = await fetch(getAPI() + "/api/users", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ username: name, password }),
                });

                if (response.ok) {
                    alert("Compte créé avec succès. Vous pouvez vous connecter.");
                    window.location.href = "login.html";
                } else {
                    alert("Erreur lors de l'inscription. Réessayez.");
                }
            } catch (error) {
                console.error("Erreur lors de l'inscription :", error);
            }
        });
    }


    getCurrentUser().then((user) => {
        if (user) {
            console.log("CONNECTED USR:", user);
        } else {
            console.log("No user connected.");
        }
    });
});
