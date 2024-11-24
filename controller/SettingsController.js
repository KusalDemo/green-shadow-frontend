document.addEventListener("DOMContentLoaded", () => {

    let btnChangePassword = document.getElementById("btn-change-password");
    if (btnChangePassword) {
        btnChangePassword.addEventListener('click', () => changePassword());
    }
})

const changePassword = () => {
    let password = document.getElementById("password-input").value;
    let rePassword = document.getElementById("re-password-input").value;

    if (!password || !rePassword) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Please fill all the fields',
        })
        return;
    }
    if (password !== rePassword) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Passwords do not match',
        })
        return;
    }
}