import {LogModel} from "../model/logModel.js";

document.addEventListener("DOMContentLoaded", () => {
    console.log("Logs loaded");
    const jwtToken = getCookie("token");
    console.log("JWTToken: ", `Bearer ${jwtToken}`);
    loadTable(jwtToken);
    loadCropsList(jwtToken);
    loadAllLogs(jwtToken);

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
            const errorMessage = error.responseText || "An unexpected error occurred.";
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: `${errorMessage}`,
            })
        }
    });
};

const loadCropsList = (jwtToken) => {
    let cropsSelector = document.getElementById("crops-select");
    let cropsSelectorInMergeCrops = document.getElementById("crops-select-2");
    if (!cropsSelector || !cropsSelectorInMergeCrops) return;

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
                cropsSelector.appendChild(option);
                cropsSelectorInMergeCrops.appendChild(option);
            });
        },
        error: (error) => {
            console.error(error);
            const errorMessage = error.responseText || "An unexpected error occurred.";
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: `${errorMessage}`,
            })
        }
    });
}

const loadAllLogs = (jwtToken) => {
    let logSelectorInObservedImage = document.getElementById("logs-select-1");
    let logSelectorInMergeCrops = document.getElementById("logs-select-2");
    if (!logSelectorInObservedImage || !logSelectorInMergeCrops) return;

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
        error: (error) => {
            console.error(error);
            const errorMessage = error.responseText || "An unexpected error occurred.";
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: `${errorMessage}`,
            })
        }
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
                loadTable(jwtToken);
            },
            error: (error) => {
                const errorMessage = error.responseText || "An unexpected error occurred.";
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: `${errorMessage}`,
                })
            }
        });
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong!',
        });
    }

};

const uploadObservedImage = (jwtToken, data) => {
    const observedImageInput = document.getElementById("observed-image-input");


    try {
        $.ajax({
            url: "http://localhost:8082/api/v1/log",
            method: "POST",
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
    if (selectedFile.type !== "image/jpeg" || selectedFile.type !== "image/png") {
        Swal.fire({
            icon: 'error',
            title: 'Invalid File Type',
            text: 'Please upload a JPEG or PNG image!',
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
            Swal.fire({
                icon: 'success',
                title: 'Uploaded successfully',
                text: 'Observed image uploaded successfully!'
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
    });
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
                error: (error) => {
                    const errorMessage = error.responseText || "An unexpected error occurred.";
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: `${errorMessage}`,
                    })
                }
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
                error: (error) => {
                    const errorMessage = error.responseText || "An unexpected error occurred.";
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: `${errorMessage}`,
                    })
                }
            });
        }catch (error) {
            console.log(error);
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

