import {LogModel} from "../model/logModel.js";

document.addEventListener("DOMContentLoaded", () => {
    console.log("Logs loaded");
    const jwtToken = getCookie("token");
    console.log("JWTToken: ", `Bearer ${jwtToken}`);
    loadTable(jwtToken);

    const logSaveButton = document.getElementById("log-save-btn");
    if (logSaveButton) {
        logSaveButton.addEventListener('click', () => saveLog(jwtToken));
    }

    const searchInput = document.getElementById("log-search-input");
    if (searchInput) {
        searchInput.addEventListener("keyup", searchLog);
    }

    let btnSearchLogsByDate = document.getElementById("btn-search-logs-by-date");
    if (btnSearchLogsByDate) {
        btnSearchLogsByDate.addEventListener('click', () => searchLogsByDate(jwtToken));
    }
});


const loadTable = (jwtToken) => {
    const logTableBody = document.getElementById('log-table-body');
    if (!logTableBody) return;

    $.ajax({
        url: "http://127.0.0.1:8082/api/v1/log",
        method: "GET",
        headers: {
            "Authorization": `Bearer ${jwtToken}`
        },
        success: (data) => {
            data.forEach(({logCode, logDetails, logDate, observedImage}) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${logCode}</td>
                    <td>${logDetails}</td>
                    <td>${logDate}</td>
                    <td>
                        <button class="btn btn-primary view-btn" data-image="${observedImage}" data-bs-toggle="modal" data-bs-target="#observedImageModal">View</button>
                    </td>
                `;
                logTableBody.appendChild(row);

                row.addEventListener('click', () => populateFormFields(logDate, logCode, logDetails));
            });

            new DataTable("#log-table", {paging: true, pageLength: 10, destroy: true});

            document.querySelectorAll('.view-btn').forEach(button => {
                button.addEventListener('click', (event) => {
                    const base64Image = event.target.getAttribute('data-image');
                    showImageModal(base64Image);
                });
            });
        },
        error: (error) => {
            console.error(error);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong!',
            });
        }
    });
};


const saveLog = (jwtToken) => {
    const date = document.getElementById("log-date-input")?.value;
    const description = document.getElementById("log-description-input")?.value;
    const image = document.getElementById("observed-image-input")?.value;

    const logModel = new LogModel(date, description, null);
    const saveLogURL = "http://localhost:8082/api/v1/log";

    let formData = new FormData();
    formData.append("logCode", logModel.logCode);
    formData.append("observedImage", image);
    if (!date || !description) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'At least date and description are required!',
        });
        return;
    }

    try {
        $.ajax({
            url: "http://localhost:8082/api/v1/log",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${jwtToken}`
            },
            data: JSON.stringify(logModel),
            success: (response) => {
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Log saved successfully!',
                });
                loadTable(jwtToken);
            },
            error: (error) => {
                console.error(error);
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong!',
                });
            }
        });
    } catch (error) {
        console.error(error);
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong!',
        });
    }

};

const uploadObservedImage = (jwtToken) => {
    const observedImageInput = document.getElementById("observed-image-input");
}

const searchLog = (event) => {
    let searchedLog = document.getElementById("log-search-input");

    if (searchedLog) {
        try {
            $.ajax({
                url: "http://localhost:8082/api/v1/log",
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${jwtToken}`
                },
                success: (data) => {
                    console.log(data);
                },
                error: (error) => {
                    console.error(error);
                }
            });
        } catch (error) {
            console.error(error);

            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong!',
            });
        }

    }
}

const searchLogsByDate = (jwtToken) => {
    const logTableBody = document.getElementById('log-table-body');
    if (!logTableBody) return;

    let logSearchStartingDate = document.getElementById("log-start-date")?.value;
    let logSearchEndingDate = document.getElementById("log-end-date")?.value;
    if(!logSearchStartingDate || !logSearchEndingDate) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Please enter both dates!',
        });
        return;
    }

    if (logSearchStartingDate && logSearchEndingDate) {
        try {
            $.ajax({
                url: `http://localhost:8082/api/v1/log/dates?start=${encodeURIComponent(logSearchStartingDate)}&end=${encodeURIComponent(logSearchEndingDate)}`,
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${jwtToken}`
                },
                success: (data) => {
                    console.log(data);

                    refreshLogsTable(jwtToken);

                    data.forEach(({logCode, logDetails, logDate, observedImage}) => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${logCode}</td>
                            <td>${logDetails}</td>
                            <td>${logDate}</td>
                            <td>
                                <button class="btn btn-primary view-btn" data-image="${observedImage}" data-bs-toggle="modal" data-bs-target="#observedImageModal">View</button>
                            </td>
                        `;
                        logTableBody.appendChild(row);

                        row.addEventListener('click', () => populateFormFields(logDate, logCode, logDetails));

                    })
                    new DataTable("#log-table", {paging: true, pageLength: 10, destroy: true});

                    document.querySelectorAll('.view-btn').forEach(button => {
                        button.addEventListener('click', (event) => {
                            const base64Image = event.target.getAttribute('data-image');
                            showImageModal(base64Image);
                        });
                    });
                },
                error: (error) => {
                    const errorMessage = error.responseJSON?.message || "An error occurred";
                    Swal.fire({
                        title: 'Something went wrong',
                        text: errorMessage,
                        icon: 'error',
                        showCancelButton: true,
                        confirmButtonColor: '#d33',
                        cancelButtonColor: '#0D9F4F',
                        confirmButtonText: 'OK'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            loadTable(jwtToken);
                        }
                    })
                }
            });
        } catch (error) {
            Swal.fire({
                title: 'Something went wrong',
                text: "An error occurred , please try again",
                icon: 'error',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#0D9F4F',
                confirmButtonText: 'OK'
            }).then((result) => {
                if (result.isConfirmed) {
                    loadTable(jwtToken);
                }
            })
        }
    }
}

const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    return parts.length === 2 ? parts.pop().split(';').shift() : null;
};

const populateFormFields = (logDate, logCode, logDetails) => {
    document.getElementById("log-code").innerText = logCode;

    const logDateField = document.getElementById("log-date-input");
    const logCodeText = document.getElementById("log-code").value = logCode;
    const logDetailsField = document.getElementById("log-description-input");

    if (logDateField) logDateField.value = logDate;
    if (logDetailsField) logDetailsField.value = logDetails;

    if (logDateField) {
        const formattedDate = new Date(logDate).toISOString().split("T")[0];
        logDateField.value = formattedDate;
    }
};

const showImageModal = (base64Image) => {
    const modalImage = document.getElementById("modalImage");
    modalImage.src = `data:image/png;base64,${base64Image}`;
};

const refreshLogsTable = (jwtToken) => {
    const logTableBody = document.getElementById('log-table-body');
    if (!logTableBody) return;

    if ($.fn.DataTable.isDataTable('#log-table')) {
        $('#log-table').DataTable().destroy();
    }
    logTableBody.innerHTML = '';
    loadTable(jwtToken);
};

