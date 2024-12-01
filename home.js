const logout = document.querySelector('#logout');

logout.addEventListener('click', () => {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#0D9F4F',
        confirmButtonText: 'Yes, Logout!'
    }).then((result) => {
        if (result.isConfirmed) {
            // Clear the token & user cookie
            document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            document.cookie = "greenShadowUser=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            document.cookie = "userRole=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            window.location.href = 'index.html';
        }
    })
});
(function () {
    'use strict';
    const forms = document.querySelectorAll('.needs-validation');

    Array.from(forms).forEach(function (form) {
        form.addEventListener('submit', function (event) {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            form.classList.add('was-validated');
        }, false);
    });
})();

document.addEventListener("DOMContentLoaded", initializeApp);

function initializeApp() {
    const sections = ['dashboard-section', 'vehicle-management-section', 'equipment-management-section', 'logs-management-section', 'settings-section','staff-management-section','field-management-section','crop-management-section','user-management-section'];

    setupEventListeners();
    showLastActiveSection();

    function setupEventListeners() {
        document.getElementById('nav-home').addEventListener('click', () => showSection('dashboard-section'));
        document.getElementById('nav-home-2').addEventListener('click', () => showSection('dashboard-section'));
        document.getElementById('nav-user').addEventListener('click', () => showSection('user-management-section'));
        document.getElementById('nav-vehicle').addEventListener('click', () => showSection('vehicle-management-section'));
        document.getElementById('nav-equipment').addEventListener('click', () => showSection('equipment-management-section'));
        document.getElementById('nav-logs').addEventListener('click', () => showSection('logs-management-section'));
        document.getElementById('nav-crop').addEventListener('click', () => showSection('crop-management-section'));
        document.getElementById('nav-staff').addEventListener('click', () => showSection('staff-management-section'));
        document.getElementById('nav-field').addEventListener('click', () => showSection('field-management-section'));
        document.getElementById('nav-settings').addEventListener('click', () => showSection('settings-section'));
    }

    const userRole = getCookie("userRole");
    console.log(userRole);
    uiChangeActionsAccordingToUserRole(userRole);

    function showLastActiveSection() {
        const lastActiveSection = getLastActiveSection();
        if (lastActiveSection && sections.includes(lastActiveSection)) {
            showSection(lastActiveSection);
        } else {
            showSection('dashboard-section'); // Default section
        }
    }

    function showSection(sectionId) {
        sections.forEach(id => document.getElementById(id).style.display = 'none');
        document.getElementById(sectionId).style.display = 'block';
        setLastActiveSection(sectionId);
    }

    function setLastActiveSection(sectionId) {
        localStorage.setItem('lastActiveSection', sectionId);
    }

    function getLastActiveSection() {
        return localStorage.getItem('lastActiveSection');
    }


    let userLoggedIn = getCookie("greenShadowUser");
    const userEmailElements = document.getElementsByClassName("user-email");

    for (let element of userEmailElements) {
        element.innerHTML = userLoggedIn;
    }
}

// Function to get the current time as a string
function getCurrentTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
}

function updateClockPlaceholder() {
    const clockPlaceholders = document.querySelectorAll('.clock-placeholder');
    clockPlaceholders.forEach((clockPlaceholder) => {
        clockPlaceholder.textContent = `Current Time: ${getCurrentTime()}`;
    });
}
setInterval(updateClockPlaceholder, 1000);


const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    return parts.length === 2 ? parts.pop().split(';').shift() : null;
};

const uiChangeActionsAccordingToUserRole = (userRole) => {
    if (userRole === "ADMINISTRATIVE") {
        document.getElementById("crop-manage-form").style.display = "none";
        document.getElementById("field-manage-form").style.display = "none";
        document.getElementById("accordion-update-crop-images").style.display = "none";
        document.getElementById("accordion-update-field-images").style.display = "none";
        document.getElementById("monitor-crop-select-div").style.display = "none";
        document.getElementById("crop-form-badge").innerText = `${userRole} privileges`;
        document.getElementById("field-form-badge").innerText = `${userRole} privileges`;
        document.getElementById("monitor-form-badge").innerText = `${userRole} privileges`;
        document.getElementById("dashboard-role-badge").innerText = `${userRole} mode`;
    }
    if (userRole === "SCIENTIST") {
        document.getElementById("staff-form-badge").innerText = `${userRole} privileges`;
        document.getElementById("vehicle-form-badge").innerText = `${userRole} privileges`;
        document.getElementById("equipment-form-badge").innerText = `${userRole} privileges`;
        document.getElementById("dashboard-role-badge").innerText = `${userRole} mode`;
        document.getElementById("staff-manage-form").style.display = "none";
        document.getElementById("vehicle-manage-form").style.display = "none";
        document.getElementById("equipment-manage-form").style.display = "none";
        document.getElementById("accordionFlush").style.display = "none";
    }
}

