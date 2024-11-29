import {FieldModel} from "../model/FieldModel.js";
import {getCookie,showErrorAlert,destroyDataTable} from "../utils/utils.js";

document.addEventListener("DOMContentLoaded", () => {
    console.log("Field loaded");
    const jwtToken = getCookie("token");

    loadTable(jwtToken)
    logCodeSelector(jwtToken)

    window.globalMap = L.map('map').setView([7.8731, 80.7718], 7);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(window.globalMap);

    let selectedMarker;

    window.globalMap.on('click', (event) => {
        const lat = event.latlng.lat;
        const lng = event.latlng.lng;

        document.getElementById('latitude-input').value = lat;
        document.getElementById('longitude-input').value = lng;

        if (selectedMarker) {
            window.globalMap.removeLayer(selectedMarker);
        }
        selectedMarker = L.marker([lat, lng])
            .addTo(window.globalMap)
            .bindPopup("Selected Location")
            .openPopup();
    });

    let btnSaveField = document.getElementById("field-save-btn");
    if (btnSaveField) {
        btnSaveField.addEventListener('click', () => saveField(jwtToken));
    }

    let btnUpdateField = document.getElementById("field-update-btn");
    if (btnUpdateField) {
        btnUpdateField.addEventListener('click', () => updateField(jwtToken));
    }

    let btnClearFieldForm = document.getElementById("field-clear-btn");
    if (btnClearFieldForm) {
        btnClearFieldForm.addEventListener('click', () => clearFieldForm());
    }

    let btnDeleteField = document.getElementById("field-delete-btn");
    if (btnDeleteField) {
        btnDeleteField.addEventListener('click', () => deleteField(jwtToken));
    }
    let btnUploadFieldImages = document.getElementById("btn-upload-field-images");
    if (btnUploadFieldImages) {
        btnUploadFieldImages.addEventListener('click', () => uploadFieldImages(jwtToken));
    }
})

const loadTable = (jwtToken) => {
    let fieldTable = document.getElementById("field-table-body");
    if (!fieldTable) return;

    destroyDataTable('#field-table');

    $.ajax({
        url: "http://localhost:8082/api/v1/field",
        method: "GET",
        headers: {
            "Authorization": `Bearer ${jwtToken}`
        },
        success: (data) => {
            fieldTable.innerHTML = "";
            data.forEach((field, index) => {
                const {
                    fieldCode,
                    fieldName,
                    fieldLocation,
                    extentSizeOfField,
                    image1,
                    image2,
                    logCode
                } = field;

                const locationText = fieldLocation ? `${fieldLocation.x}, ${fieldLocation.y}` : "N/A";
                let row = document.createElement("tr");
                row.innerHTML = `
                    <td>${fieldCode}</td>
                    <td>${fieldName}</td>
                    <td>${locationText}</td>
                    <td>${extentSizeOfField}</td>
                    <td>
                       <button class="btn btn-primary view-btn" data-image="${image1}" data-bs-toggle="modal" data-bs-target="#observedImageModal">View</button>
                    </td>
                    <td>
                       <button class="btn btn-primary view-btn" data-image="${image2}" data-bs-toggle="modal" data-bs-target="#observedImageModal">View</button>
                    </td>
                    <td>${logCode}</td>
                `;
                fieldTable.appendChild(row);
                row.addEventListener('click', () => populateFieldFields(field));
            })
            new DataTable('#field-table', {paging: true, pageLength: 10, destroy: true});

            document.querySelectorAll('.view-btn').forEach(button => {
                button.addEventListener('click', (event) => {
                    const base64Image = event.target.getAttribute('data-image');
                    showImageModal(base64Image);
                });
            });
        }
    })
}

const logCodeSelector = (jwtToken) => {
    let fieldsLogs = document.getElementById("field-log-select");
    if (!fieldsLogs) return;

    $.ajax({
        url: "http://localhost:8082/api/v1/log",
        method: "GET",
        headers: {
            "Authorization": `Bearer ${jwtToken}`
        },
        success: (data) => {
            data.forEach((log) => {
                let option = document.createElement("option");
                option.innerHTML = log.logDetails;
                option.value = log.logCode;
                fieldsLogs.appendChild(option);
            })
        }
    })
}
const saveField = (jwtToken) => {
    const fieldCode = document.getElementById("field-code").innerText;
    if (fieldCode !== "") {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Please select a field to edit!'
        });
    } else {
        let fieldToSave = getFieldFormDetails();

        if (fieldToSave) {
            try {
                $.ajax({
                    url: "http://localhost:8082/api/v1/field",
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${jwtToken}`
                    },
                    data: JSON.stringify(fieldToSave),
                    contentType: "application/json",
                    success: (data) => {
                        Swal.fire({
                            icon: 'success',
                            title: 'Success',
                            text: 'Field saved successfully!'
                        })
                    },
                    error: (error) => showErrorAlert(error)
                })
            } catch (error) {
                console.log(error);
            }
        }
    }
}

const updateField = (jwtToken) => {
    const fieldCode = document.getElementById("field-code").innerText;
    if (fieldCode === "") {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Please select a field to edit!'
        });
    } else {
        let fieldToUpdate = getFieldFormDetails();
        if (fieldToUpdate) {
            try {
                $.ajax({
                    url: "http://localhost:8082/api/v1/field/" + fieldCode,
                    method: "PUT",
                    headers: {
                        "Authorization": `Bearer ${jwtToken}`
                    },
                    data: JSON.stringify(fieldToUpdate),
                    contentType: "application/json",
                    success: (data) => {
                        Swal.fire({
                            icon: 'success',
                            title: 'Success',
                            text: 'Field updated successfully!'
                        })
                        loadTable(jwtToken);
                    },
                    error: (error) => showErrorAlert(error)
                })
            } catch (error) {
                console.log(error);
            }
        }
    }
}

const uploadFieldImages = (jwtToken) => {
    let selectedFieldToUploadImages = document.getElementById("field-select-2").value;
    if (selectedFieldToUploadImages === "") {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Please select a field to upload images!'
        })
    } else {
        let image1 = document.getElementById("field-image-input-1").files[0];
        let image2 = document.getElementById("field-image-input-2").files[0];
        if (image1 === undefined || image2 === undefined) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: '2 images are required to upload!'
            })
        } else {
            let formData = new FormData();
            formData.append("fieldCode", selectedFieldToUploadImages);
            formData.append("image1", image1);
            formData.append("image2", image2);
            $.ajax({
                url: "http://localhost:8082/api/v1/field",
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${jwtToken}`
                },
                data: formData,
                processData: false,
                contentType: false,
                success: (data) => {
                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: 'Images uploaded successfully!'
                    })
                    loadTable(jwtToken);
                    clearFieldImageForm();
                },
                error: (error) => showErrorAlert(error)
            })
        }
    }
}

const clearFieldForm = () => {
    document.getElementById("field-code").innerText = "";
    document.getElementById("field-name-input").value = "";
    document.getElementById("extent-size-of-field-input").value = "";
    document.getElementById("latitude-input").value = "";
    document.getElementById("longitude-input").value = "";
    document.getElementById("field-log-select").value = "";
}
const clearFieldImageForm = () => {
    document.getElementById("field-select-2").value = "";
    document.getElementById("field-image-input-1").value = "";
    document.getElementById("field-image-input-2").value = "";
}

const deleteField = (jwtToken) => {
    const fieldCode = document.getElementById("field-code").innerText;
    if (fieldCode === "") {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Please select a field to delete!'
        });
    } else {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#0D9F4F',
            confirmButtonText: 'Yes, Delete!'
        }).then((result) => {
            if (result.isConfirmed) {
                try {
                    $.ajax({
                        url: "http://localhost:8082/api/v1/field/" + fieldCode,
                        method: "DELETE",
                        headers: {
                            "Authorization": `Bearer ${jwtToken}`
                        },
                        success: () => {
                            Swal.fire({
                                icon: 'success',
                                title: 'Success',
                                text: 'Field deleted successfully!'
                            })
                            loadTable(jwtToken);
                            clearFieldForm();
                        },
                        error: (error) => showErrorAlert(error)
                    })
                } catch (error) {
                    console.log(error);
                }
            }
        })
    }
}
const populateFieldFields = (field) => {
    document.getElementById("field-code").innerText = field.fieldCode;
    document.getElementById("field-name-input").value = field.fieldName;
    document.getElementById("extent-size-of-field-input").value = field.extentSizeOfField;
    document.getElementById("field-log-select").value = field.logCode;

    const lat = field.fieldLocation.x;
    const lng = field.fieldLocation.y;

    document.getElementById("latitude-input").value = lat;
    document.getElementById("longitude-input").value = lng;

    const map = window.globalMap;
    if (!map) {
        console.error("Map instance not initialized. Please ensure the map is loaded before populating fields.");
        return;
    }

    map.setView([lat, lng], 15);

    if (window.selectedMarker) {
        map.removeLayer(window.selectedMarker);
    }
    window.selectedMarker = L.marker([lat, lng])
        .addTo(map)
        .bindPopup("Selected Location")
        .openPopup();
};


const getFieldFormDetails = () => {
    let fieldCode = document.getElementById("field-code").innerText;
    let fieldName = document.getElementById("field-name-input").value;
    let extentSizeOfField = document.getElementById("extent-size-of-field-input").value;
    let logCode = document.getElementById("field-log-select").value;

    let latitude = document.getElementById("latitude-input").value;
    let longitude = document.getElementById("longitude-input").value;

    let fieldLocation = {
        x: parseFloat(latitude),
        y: parseFloat(longitude)
    };

    let fieldModel = new FieldModel();

    fieldModel.fieldCode = fieldCode;
    fieldModel.fieldName = fieldName;
    fieldModel.fieldLocation = fieldLocation;
    fieldModel.extentSizeOfField = extentSizeOfField;
    fieldModel.logCode = logCode;

    return fieldModel
}

const showImageModal = (base64Image) => {
    const modalImage = document.getElementById("modalImage");
    modalImage.src = `data:image/jpeg;base64,${base64Image}`;
};


