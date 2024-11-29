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

export const getFormattedDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
}

export const destroyDataTable = (tableSelector) => {
    if ($(tableSelector).hasClass('dataTable')) {
        $(tableSelector).DataTable().destroy();
    }
};