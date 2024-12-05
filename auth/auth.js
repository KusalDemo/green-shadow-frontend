const loggedUserName= undefined

document.addEventListener('DOMContentLoaded', () => {
    const token = getCookie('token');
    if (token) {
        window.location.href = 'home.html';
    }

    // Toggle password visibility
    const togglePasswordButtons = document.querySelectorAll('.toggle-password');
    togglePasswordButtons.forEach(button => {
        button.addEventListener('click', function () {
            const input = this.previousElementSibling;
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);

            // Toggle eye icon
            const iconName = type === 'password' ? 'eye' : 'eye-off';
            this.src = `https://api.iconify.design/mdi:${iconName}.svg`;
        });
    });

    // Form validation
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');

    // Updated login submission handler
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch('http://localhost:8082/api/v1/users/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({email, password})
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                // Parse JSON response
                const data = await response.json();

                if (data.token) {
                    document.cookie = `token=${data.token}; path=/; secure;`;
                    document.cookie = `greenShadowUser=${email}; path=/; secure;`;
                    await getRoleOfCurrentUser({email, password}, (data) => {
                        document.cookie = `userRole=${data}; path=/; secure;`;
                    });
                    Swal.fire({
                        icon: 'success',
                        title: 'Logged in successfully',
                        text: 'Welcome to GreenShadow',
                        showConfirmButton: false,
                        timer: 1500
                    });
                    setTimeout(() => {
                        window.location.href = 'home.html';
                    }, 2000);
                } else {
                    showError('email', 'Error logging in. Please try again.');
                }
            } catch (error) {
                console.error('Error:', error);
                showError('email', 'Invalid credentials. Please try again.');
            }
        });
    }

    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            let roleClarificationCode = document.getElementById("code").value;
            let role = document.getElementById("role").value;

            // Basic validation
            if (!validateEmail(email)) {
                showError('email', 'Please enter a valid email address');
                return;
            }

            if (password.length < 6) {
                showError('password', 'Password must be at least 6 characters');
                return;
            }

            if (password !== confirmPassword) {
                showError('confirmPassword', 'Passwords do not match');
                return;
            }
            try {
                let response = await fetch("http://localhost:8082/api/v1/users/register", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({email, password, role, roleClarificationCode}),
                });
                if (response.status !== 201) {
                    showError('email', 'Check your credentials and try again');
                    throw new Error(`HTTP error! status: ${response.status}`);
                }else{
                    Swal.fire({
                        icon: 'success',
                        title: 'Registered successfully',
                        text: 'You can now login',
                    });
                    window.location.href = '../index.html';
                }
            } catch (error) {
                console.error('Error:', error);
                showError('email', 'An error occurred. Please try again later.');
            }
        });
    }

    // Social auth buttons
    const socialButtons = document.querySelectorAll('.social-button');
    socialButtons.forEach(button => {
        button.addEventListener('click', function () {
            const provider = this.classList.contains('google') ? 'Google' : 'Microsoft';
            simulateAuth(`Connecting to ${provider}...`, () => {
                window.location.href = 'home.html';
            });
        });
    });
});

function getRoleOfCurrentUser(userModel, callback) {
    const cookie = getCookie('token');

    fetch("http://localhost:8082/api/v1/users/get-role", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${cookie}`
        },
        body: JSON.stringify(userModel)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            callback(data.userRole);
        })
        .catch(error => {
            console.error("Error fetching role:", error);
        });
}


// Helper functions
function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showError(inputId, message) {
    const input = document.getElementById(inputId);
    const inputGroup = input.parentElement;
    const existingError = inputGroup.parentElement.querySelector('.error-message');

    inputGroup.classList.add('error');

    if (!existingError) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        inputGroup.parentElement.appendChild(errorDiv);
    }

    // Remove error after 3 seconds
    setTimeout(() => {
        inputGroup.classList.remove('error');
        if (existingError) {
            existingError.remove();
        }
    }, 3000);
}

function simulateAuth(message, callback) {
    const button = document.querySelector('.auth-button');
    const originalText = button.textContent;

    button.disabled = true;
    button.textContent = message;

    setTimeout(() => {
        button.disabled = false;
        button.textContent = originalText;
        callback();
    }, 1500);
}

// Get token from cookie if exists
function getCookie(name) {
    console.log("Checking for cookie: " + name);
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}