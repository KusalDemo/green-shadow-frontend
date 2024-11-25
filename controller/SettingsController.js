import {UserModel} from "../model/UserModel.js";

document.addEventListener("DOMContentLoaded", () => {
    const jwtToken = getCookie("token");
    const loggedUser = getCookie("greenShadowUser");


    let btnChangePassword = document.getElementById("btn-change-password");
    if (btnChangePassword) {
        btnChangePassword.addEventListener('click', () => changePassword(jwtToken, loggedUser));
    }

    const btnChangeRole = document.getElementById("btn-change-role");
    if (btnChangeRole) {
        btnChangeRole.addEventListener('click', () => changeRole(jwtToken, loggedUser));
    }

    const btnDeleteAccount = document.getElementById("btn-delete-account");
    if (btnDeleteAccount) {
        btnDeleteAccount.addEventListener('click', () => deleteAccount(jwtToken, loggedUser));
    }
})

const changePassword = (jwtToken, loggedUser) => {
    const oldPassword = document.getElementById("old-password-input-1").value;
    let password = document.getElementById("password-input").value;
    let rePassword = document.getElementById("re-password-input").value;

    if (!oldPassword) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Old Password is required',
        })
        return;
    }
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

    try {
        $.ajax({
            url: "http://localhost:8082/api/v1/users/password",
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${jwtToken}`
            },
            data: JSON.stringify({
                userDTO: {
                    email: loggedUser,
                    password: oldPassword
                },
                newPassword: password
            }),
            contentType: "application/json",
            success: (data) => {
                Swal.fire({
                    title: 'Re-login required',
                    text: "After changing password, please re-login",
                    icon: 'success',
                    showCancelButton: false,
                    confirmButtonColor: '#d33',
                    confirmButtonText: 'OK'
                }).then((result) => {
                    if (result.isConfirmed) {
                        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                        document.cookie = "greenShadowUser=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                        window.location.href = 'index.html';
                    }
                })
            },
            error: (error) => {
                const errorMessage = error.responseText || "An unexpected error occurred.";
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: `${errorMessage}`,
                })
            }
        })
    } catch (error) {
        console.error(error);
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong!',
        })
    }
}

const changeRole = (jwtToken, loggedUser) => {
    const password = document.getElementById("old-password-input-2").value;
    const role = document.getElementById("role-type-select").value;
    const roleClarificationCode = document.getElementById("clarification-code-input").value;

    const userModel = new UserModel();
    userModel.setEmail(loggedUser);
    userModel.setPassword(password);
    userModel.setRole(role);
    userModel.setRoleClarificationCode(roleClarificationCode);

    if (!password) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Password is required',
        })
        return;
    }
    if (!role) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Role is required',
        })
        return;
    }
    if (!roleClarificationCode) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Clarification code is required',
        })
        return;
    }

    $.ajax({
        url: "http://localhost:8082/api/v1/users/role",
        method: "PUT",
        headers: {
            "Authorization": `Bearer ${jwtToken}`
        },
        data: JSON.stringify(userModel),
        contentType: "application/json",
        success: (data) => {
            Swal.fire({
                title: 'Re-login required',
                text: "After changing role, please re-login",
                icon: 'success',
                showCancelButton: false,
                confirmButtonColor: '#d33',
                confirmButtonText: 'OK'
            }).then((result) => {
                if (result.isConfirmed) {
                    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                    document.cookie = "greenShadowUser=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                    window.location.href = 'index.html';
                }
            })
        },
        error: (error) => {
            const errorMessage = error.responseText || "An unexpected error occurred.";
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: `${errorMessage}`,
            })
        }
    })
}

const deleteAccount = (jwtToken, loggedUser) => {
    const password = document.getElementById("old-password-input-3").value;
    if (!password) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Password is required',
        })
        return;
    }

    const userModel = new UserModel();
    userModel.setEmail(loggedUser);
    userModel.setPassword(password);

    Swal.fire({
        title: 'High risk action',
        text: "Are you sure you want to delete your account? This action cannot be undone.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        confirmButtonText: 'I accept the risk and delete my account',
        cancelButtonText: 'Cancel'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: "http://localhost:8082/api/v1/users/delete",
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${jwtToken}`
                },
                data: JSON.stringify(userModel),
                contentType: "application/json",
                success: (data) => {
                    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                    document.cookie = "greenShadowUser=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                    window.location.href = 'index.html';
                },
                error: (error) => {
                    const errorMessage = error.responseText || "An unexpected error occurred.";
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: `${errorMessage}`,
                    })
                }
            })
        }
    })
}


const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    return parts.length === 2 ? parts.pop().split(';').shift() : null;
};