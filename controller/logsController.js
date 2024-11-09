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
    //const image = document.getElementById("observed-image-input")?.value;

    const logModel = new LogModel(date, description, null);
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

const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    return parts.length === 2 ? parts.pop().split(';').shift() : null;
};

const showImageModal = (base64Image) => {
    const modalImage = document.getElementById("modalImage");
    modalImage.src = `data:image/png;base64,${base64Image}`;
};