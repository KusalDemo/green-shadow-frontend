import {LogModel} from "../model/logModel.js";
import {getCookie, showErrorAlert ,getFormattedDate,destroyDataTable} from "../utils/utils.js";

document.addEventListener("DOMContentLoaded", () => {
    const jwtToken = getCookie("token");
    loadTable(jwtToken);


    let btnNavigateToLog = document.getElementById("nav-logs");
    if (btnNavigateToLog) {
        btnNavigateToLog.addEventListener('click', () => {
            loadCropsList(jwtToken);
            loadAllLogs(jwtToken);
        });
    }

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

    let btnUploadObservedImageCustom = document.getElementById("btn-upload-observed-image-custom");
    if (btnUploadObservedImageCustom) {
        btnUploadObservedImageCustom.addEventListener('click', () => uploadObservedImageCustom(jwtToken));
    }

    let btnMergeLogsAndCrops = document.getElementById("btn-merge-log-for-crop");
    if (btnMergeLogsAndCrops) {
        btnMergeLogsAndCrops.addEventListener('click', () => mergeLogsAndCrops(jwtToken));
    }

    let btnDeleteMergedLogsAndCrop = document.getElementById("btn-delete-log-for-crop");
    if (btnDeleteMergedLogsAndCrop) {
        btnDeleteMergedLogsAndCrop.addEventListener('click', () => deleteMergedLogs(jwtToken));
    }

    const btnDeleteLog = document.getElementById("log-delete-btn");
    if (btnDeleteLog) {
        btnDeleteLog.addEventListener('click', () => deleteLog(jwtToken));
    }
});


const loadTable = (jwtToken) => {
    const logTableBody = document.getElementById('log-table-body');
    if (!logTableBody) return;

    destroyDataTable('#log-table');

    $.ajax({
        url: "http://127.0.0.1:8082/api/v1/log",
        method: "GET",
        headers: {
            "Authorization": `Bearer ${jwtToken}`
        },
        success: (data) => {
            logTableBody.innerHTML = '';
            data.forEach(({logCode, logDetails, logDate, observedImage}) => {
                const formattedDate = getFormattedDate(logDate);

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${logCode}</td>
                    <td>${logDetails}</td>
                    <td>${formattedDate}</td>
                    <td>
                       <button class="btn btn-primary view-btn" data-image="${observedImage}" data-bs-toggle="modal" data-bs-target="#observedImageModal">
                        <img src="https://api.iconify.design/mdi:eye.svg?color=white" alt="View" class="btn-icon"> View
                       </button>
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
        }
    });
};

const loadCropsList = (jwtToken) => {
    let cropsSelectorInMergeCrops = document.getElementById("crops-select-2");
    if (!cropsSelectorInMergeCrops) return;

    cropsSelectorInMergeCrops.innerHTML = '';

    $.ajax({
        url: "http://localhost:8082/api/v1/crop",
        method: "GET",
        headers: {
            "Authorization": `Bearer ${jwtToken}`
        },
        success: (data) => {
            data.forEach(({cropCode, cropCommonName}) => {
                let option = document.createElement("option");
                option.value = cropCode;
                option.text = cropCommonName;
                cropsSelectorInMergeCrops.appendChild(option);
            });
        },
        error: (error) => showErrorAlert(error)
    });
}

const loadAllLogs = (jwtToken) => {
    let logSelectorInObservedImage = document.getElementById("logs-select-1");
    let logSelectorInMergeCrops = document.getElementById("logs-select-2");
    if (!logSelectorInObservedImage || !logSelectorInMergeCrops) return;

    logSelectorInObservedImage.innerHTML = '';
    logSelectorInMergeCrops.innerHTML = '';

    $.ajax({
        url: "http://localhost:8082/api/v1/log",
        method: "GET",
        headers: {
            "Authorization": `Bearer ${jwtToken}`
        },
        success: (data) => {
            data.forEach(({logCode, logDetails}) => {
                let option = document.createElement("option");
                option.value = logCode;
                option.text = logDetails;
                logSelectorInObservedImage.appendChild(option);

                let option2 = document.createElement("option");
                option2.value = logCode;
                option2.text = logDetails;
                logSelectorInMergeCrops.appendChild(option2);
            });
        },
    });
}

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
            success: (data) => {
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Log saved successfully',
                });
                clearLogForm();
                loadTable(jwtToken);
                refreshLogsRelatedSelectors(jwtToken);
            },
            error: (error) => showErrorAlert(error)
        });
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong!',
        });
    }
};
const deleteLog = (jwtToken) => {
    const logCode = document.getElementById("log-code").innerText;
    if (!logCode) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Please select a log to delete!',
        });
        return;
    }
    Swal.fire({
        title: 'Are you sure?',
        text: "Deleting logs is not reversible. Are you sure you want to delete this log?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#0D9F4F',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: "http://localhost:8082/api/v1/log/" + logCode,
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${jwtToken}`
                },
                success: () => {
                    Swal.fire({
                        icon: 'success',
                        title: 'Log deleted successfully',
                        text: 'selected log deleted successfully',
                    })
                    clearLogForm();
                    loadTable(jwtToken);
                    refreshLogsRelatedSelectors(jwtToken);
                },
                error: (error) => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Log is not eligible to delete! It contains related data that could be sensitive.',
                    })
                }
            })
        }
    })
}

const uploadObservedImageCustom = (jwtToken) => {
    console.log("uploadObservedImageCustom calling..");

    const logSelect = document.getElementById("logs-select-1");
    const selectedValue = logSelect.value;
    const observedImageInput = document.getElementById("observed-image-input-2");

    if (!observedImageInput) return;

    if (!selectedValue) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Please select a log!',
        });
        return;
    }

    const selectedFile = observedImageInput.files[0];
    if (selectedFile.type !== "image/jpeg" && selectedFile.type !== "image/png" && selectedFile.type !== "image/jpg") {
        Swal.fire({
            icon: 'error',
            title: 'Invalid File Type',
            text: 'Please upload a JPEG, JPG or PNG image!',
        });
        return;
    }

    let formData = new FormData();
    formData.append("logCode", selectedValue);
    if (observedImageInput.files.length > 0) {
        formData.append("observedImage", observedImageInput.files[0]);
    } else {
        console.error("No file selected");
    }


    $.ajax({
        url: "http://localhost:8082/api/v1/log",
        method: "POST",
        headers: {
            "Authorization": `Bearer ${jwtToken}`
        },
        contentType: false,
        processData: false,
        data: formData,
        success: (data) => {
            loadTable(jwtToken);
            Swal.fire({
                icon: 'success',
                title: 'Uploaded successfully',
                text: 'Observed image uploaded successfully!'
            })
        },
        error: (error) => showErrorAlert(error)
    });
}
const searchLogsByDate = (jwtToken) => {
    const logTableBody = document.getElementById('log-table-body');
    if (!logTableBody) return;

    let logSearchStartingDate = document.getElementById("log-start-date")?.value;
    let logSearchEndingDate = document.getElementById("log-end-date")?.value;
    if (!logSearchStartingDate || !logSearchEndingDate) {
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

const mergeLogsAndCrops = (jwtToken) => {
    let logSelect2 = document.getElementById("logs-select-2");
    let selectedLogForCropMerge = logSelect2.value;

    let cropSelect2 = document.getElementById("crops-select-2");
    let selectedCropForCropMerge = cropSelect2.value;

    if(selectedLogForCropMerge && selectedCropForCropMerge){
        let formData = new FormData();
        formData.append("logCode", selectedLogForCropMerge);
        formData.append("cropCode", selectedCropForCropMerge);

        try {
            $.ajax({
                url: "http://localhost:8082/api/v1/log/crop",
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${jwtToken}`
                },
                contentType: false,
                processData: false,
                data: formData,
                success: (data) => {
                    Swal.fire({
                        title: 'Successfully assigned',
                        text: 'Crop added to the log you selected',
                        icon: 'success',
                    })
                },
                error: (error) => showErrorAlert(error)
            });
        }catch (error) {
            console.log(error);
        }
    }
}

const deleteMergedLogs = (jwtToken) => {
    let logSelect2 = document.getElementById("logs-select-2");
    let selectedLogForCropMerge = logSelect2.value;

    let cropSelect2 = document.getElementById("crops-select-2");
    let selectedCropForCropMerge = cropSelect2.value;

    if(selectedLogForCropMerge && selectedCropForCropMerge){
        let formData = new FormData();
        formData.append("logCode", selectedLogForCropMerge);
        formData.append("cropCode", selectedCropForCropMerge);

        try {
            $.ajax({
                url: "http://localhost:8082/api/v1/log/crop",
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${jwtToken}`
                },
                contentType: false,
                processData: false,
                data: formData,
                success: (data) => {
                    Swal.fire({
                        title: 'Are you sure?',
                        text: "Deleting merged logs, you won't be able to revert this!",
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#d33',
                        cancelButtonColor: '#0D9F4F',
                        confirmButtonText: 'Yes, delete it!'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            Swal.fire(
                                'Deleted!',
                                'Merge between log and crop has been deleted.',
                                'success'
                            )
                            loadTable(jwtToken);
                        }
                    })
                },
                error: (error) => showErrorAlert(error)
            });
        }catch (error) {
            console.log(error);
        }
    }
}
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
    modalImage.src = `data:image/jpeg;base64,${base64Image}`;
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
const refreshLogsRelatedSelectors = (jwtToken) => {
    loadAllLogs(jwtToken);
}
const clearLogForm = () => {
    document.getElementById("log-code").innerText = "";
    document.getElementById("log-date-input").value = "";
    document.getElementById("log-description-input").value = "";
};
