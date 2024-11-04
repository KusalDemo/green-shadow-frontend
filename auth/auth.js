document.addEventListener('DOMContentLoaded', () => {
    // Toggle password visibility
    const togglePasswordButtons = document.querySelectorAll('.toggle-password');
    togglePasswordButtons.forEach(button => {
        button.addEventListener('click', function() {
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

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            // Basic validation
            if (!validateEmail(email)) {
                showError('email', 'Please enter a valid email address');
                return;
            }

            if (password.length < 6) {
                showError('password', 'Password must be at least 6 characters');
                return;
            }

            // Simulate login
            simulateAuth('Logging in...', () => {
                window.location.href = 'home.html';
            });
        });
    }

    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const fullName = document.getElementById('fullName').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            // Basic validation
            if (fullName.length < 2) {
                showError('fullName', 'Please enter your full name');
                return;
            }

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

            // Simulate signup
            simulateAuth('Creating your account...', () => {
                window.location.href = 'home.html';
            });
        });
    }

    // Social auth buttons
    const socialButtons = document.querySelectorAll('.social-button');
    socialButtons.forEach(button => {
        button.addEventListener('click', function() {
            const provider = this.classList.contains('google') ? 'Google' : 'Microsoft';
            simulateAuth(`Connecting to ${provider}...`, () => {
                window.location.href = 'home.html';
            });
        });
    });
});

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