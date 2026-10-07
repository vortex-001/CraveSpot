// ========================================
// CraveSpot REGISTRATION
// ========================================

const API_BASE =
    "http://127.0.0.1:5000/api";


const registerForm =
    document.getElementById("registerForm");


const registerMessage =
    document.getElementById("registerMessage");


if (registerForm) {

    registerForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const name =
                document
                    .getElementById("name")
                    .value
                    .trim();


            const email =
                document
                    .getElementById("email")
                    .value
                    .trim();


            const phone =
                document
                    .getElementById("phone")
                    .value
                    .trim();


            const password =
                document
                    .getElementById("password")
                    .value;


            const confirmPassword =
                document
                    .getElementById("confirmPassword")
                    .value;


            // -------------------------------
            // VALIDATION
            // -------------------------------

            if (
                name === "" ||
                email === "" ||
                password === "" ||
                confirmPassword === ""
            ) {

                showMessage(
                    "Please fill in all required fields.",
                    "red"
                );

                return;
            }


            if (password !== confirmPassword) {

                showMessage(
                    "Passwords do not match.",
                    "red"
                );

                return;
            }


            if (password.length < 6) {

                showMessage(
                    "Password must be at least 6 characters.",
                    "red"
                );

                return;
            }


            // -------------------------------
            // SEND TO FLASK
            // -------------------------------

            showMessage(
                "Creating your account...",
                "#777"
            );


            try {

                const response =
                    await fetch(
                        `${API_BASE}/register`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({

                                name: name,

                                email: email,

                                password: password,

                                phone: phone

                            })
                        }
                    );


                const data =
                    await response.json();


                // -------------------------------
                // SUCCESS
                // -------------------------------

                if (
                    response.ok &&
                    data.success
                ) {

                    showMessage(
                        "Account created successfully! Redirecting...",
                        "green"
                    );


                    setTimeout(
                        function () {

                            window.location.href =
                                "login.html";

                        },
                        1200
                    );


                } else {

                    showMessage(
                        data.message ||
                        "Unable to create account.",
                        "red"
                    );

                }


            } catch (error) {

                console.error(
                    "Registration error:",
                    error
                );


                showMessage(
                    "Unable to connect to server. Make sure Flask is running.",
                    "red"
                );

            }

        }
    );

}


// ========================================
// MESSAGE FUNCTION
// ========================================

function showMessage(message, color) {

    if (!registerMessage) {
        return;
    }

    registerMessage.textContent =
        message;

    registerMessage.style.color =
        color;
}