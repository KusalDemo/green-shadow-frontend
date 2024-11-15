import {FieldModel} from "../model/FieldModel.js";

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

    let btnSaveField = document.getElementById("field-save-btn");
    if (btnSaveField) {
        btnSaveField.addEventListener('click', () => saveField(jwtToken));
    }

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
})

const loadTable = (jwtToken) => {

    let fieldTable = document.getElementById("field-table-body");
    if (!fieldTable) return;

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
                    <td>${image1}</td>
                    <td>${image2}</td>
                    <td>${logCode}</td>
                `;
                fieldTable.appendChild(row);
                row.addEventListener('click', () => populateFieldFields(field));
            })
            new DataTable('#field-table', {paging: true, pageLength: 10, destroy: true});
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
    }else{
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
                })
            } catch (error) {
                console.log(error);
            }
        }
    }
}




const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    return parts.length === 2 ? parts.pop().split(';').shift() : null;
};

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


