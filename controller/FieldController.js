document.addEventListener("DOMContentLoaded", () => {
    console.log("Field loaded");
    const jwtToken = getCookie("token");

    loadTable(jwtToken)
    logCodeSelector(jwtToken)

    const map = L.map('map').setView([7.8731, 80.7718], 7);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    map.on('click', function(e) {
        const lat = e.latlng.lat;
        const lng = e.latlng.lng;

        document.getElementById('latitude-input').value = lat;
        document.getElementById('longitude-input').value = lng;
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



const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    return parts.length === 2 ? parts.pop().split(';').shift() : null;
};

const populateFieldFields = (field) => {
    document.getElementById("field-code").innerText = field.fieldCode;
    document.getElementById("field-name-input").value = field.fieldName;
    //document.getElementById("field-location-input").value = field.fieldLocation;
    document.getElementById("extent-size-of-field-input").value = field.extentSizeOfField;
    document.getElementById("field-log-select").value = field.logCode;
}


