// ================================
// CraveSpot LOGIN
// MySQL + Flask API
// ================================


// ---------- FLASK API ----------

const API_BASE = "http://127.0.0.1:5000/api";


// ---------- SHOW / HIDE PASSWORD ----------

const togglePassword =
    document.getElementById("togglePassword");

const passwordInput =
    document.getElementById("password");


if (togglePassword && passwordInput) {

    togglePassword.addEventListener(
        "click",
        function () {

            if (passwordInput.type === "password") {

                passwordInput.type = "text";

                togglePassword.textContent = "🙈";

            } else {

                passwordInput.type = "password";

                togglePassword.textContent = "👁";

            }

        }
    );

}


// ---------- LOGIN FORM ----------

const loginForm =
    document.getElementById("loginForm");

const loginMessage =
    document.getElementById("loginMessage");


if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const email =
                document
                    .getElementById("email")
                    .value
                    .trim();


            const password =
                document
                    .getElementById("password")
                    .value
                    .trim();


            // ---------- BASIC VALIDATION ----------

            if (email === "" || password === "") {

                loginMessage.textContent =
                    "Please enter your email and password.";

                loginMessage.style.color =
                    "#d93025";

                return;
            }


            // ---------- EMAIL VALIDATION ----------

            const emailPattern =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


            if (!emailPattern.test(email)) {

                loginMessage.textContent =
                    "Please enter a valid email address.";

                loginMessage.style.color =
                    "#d93025";

                return;
            }


            // ---------- SHOW LOADING ----------

            loginMessage.textContent =
                "Logging in...";

            loginMessage.style.color =
                "#777";


            try {

                // ---------- SEND DATA TO FLASK ----------

                const response =
                    await fetch(
                        `${API_BASE}/login`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({
                                email: email,
                                password: password
                            })
                        }
                    );


                const data =
                    await response.json();


                // ---------- LOGIN SUCCESS ----------

                if (response.ok && data.success) {

                    loginMessage.textContent =
                        "Login successful! Welcome to CraveSpot.";

                    loginMessage.style.color =
                        "#188038";


                    // Save login information

                    localStorage.setItem(
                        "CraveSpotLoggedIn",
                        "true"
                    );


                    // Save user information

                    if (data.user) {

                        localStorage.setItem(
                            "CraveSpotUser",
                            JSON.stringify(data.user)
                        );

                    }


                    // Redirect

                    setTimeout(function () {

                        window.location.href =
                            "../index.html";

                    }, 1000);


                } else {

                    // ---------- LOGIN FAILED ----------

                    loginMessage.textContent =
                        data.message ||
                        "Invalid email or password.";

                    loginMessage.style.color =
                        "#d93025";
                }


            } catch (error) {

                console.error(
                    "Login error:",
                    error
                );


                loginMessage.textContent =
                    "Unable to connect to server. Make sure Flask is running.";

                loginMessage.style.color =
                    "#d93025";
            }

        }
    );

}