export const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    return parts.length === 2 ? parts.pop().split(';').shift() : null;
};

export const showErrorAlert = (error) => {
    const errorMessage = error.responseText || "An unexpected error occurred.";
    Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: `${errorMessage}`,
    });
};