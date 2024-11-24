document.addEventListener("DOMContentLoaded", () => {
    console.log("Monitor loaded");

    const jwtToken = getCookie("token");

    loadCropsSelector(jwtToken);
    loadFieldSelector(jwtToken);
    loadFieldSelectorMonitor(jwtToken);

    let monitorCropSelector = document.getElementById("monitor-crop-select");
    if (monitorCropSelector) {
        monitorCropSelector.addEventListener('change', () => loadRelatedLogDivs(jwtToken));
    }

    let monitorFieldSelector = document.getElementById("monitor-field-select");
    if (monitorFieldSelector) {
        monitorFieldSelector.addEventListener('change', () => loadRelatedStaffDivs(jwtToken));
    }
})

const loadCropsSelector = (jwtToken) => {
    let cropSelector = document.getElementById("monitor-crop-select");
    if (!cropSelector) return;

    $.ajax({
        url: "http://localhost:8082/api/v1/crop",
        method: "GET",
        headers: {
            "Authorization": `Bearer ${jwtToken}`
        },
        success: (data) => {
            data.forEach((crop) => {
                let option = document.createElement("option");
                option.innerHTML = crop.cropCommonName;
                option.value = crop.cropCode;
                cropSelector.appendChild(option);
            })
        }
    })
}
const loadFieldSelector = (jwtToken) => {
    let monitorFieldSelector = document.getElementById("monitor-field-select");
    if (!monitorFieldSelector) return;

    $.ajax({
        url: "http://localhost:8082/api/v1/field",
        method: "GET",
        headers: {
            "Authorization": `Bearer ${jwtToken}`
        },
        success: (data) => {
            data.forEach((field) => {
                let option = document.createElement("option");
                option.innerHTML = field.fieldName;
                option.value = field.fieldCode;
                monitorFieldSelector.appendChild(option);
            })
        }
    })
}

const loadRelatedLogDivs = (jwtToken) => {
    let relatedLogDivs = document.getElementById("related-monitoring-div");
    if (!relatedLogDivs) return;

    relatedLogDivs.innerHTML = "";

    let monitorCropSelector = document.getElementById("monitor-crop-select");
    if (!monitorCropSelector) return;

    let cropCode = monitorCropSelector.value;
    if (!cropCode) return;

    $.ajax({
        url: `http://localhost:8082/api/v1/log/crop/${cropCode}`,
        method: "GET",
        headers: {
            "Authorization": `Bearer ${jwtToken}`
        },
        success: (data) => {
            data.forEach((log) => {
                let staffListHTML = "<ul>";
                if (log.staff && log.staff.length > 0) {
                    log.staff.forEach((staffMember) => {
                        staffListHTML += `<li>${staffMember.name} (${staffMember.role})</li>`;
                    });
                } else {
                    staffListHTML += "<li>No staff assigned</li>";
                }
                staffListHTML += "</ul>";

                let fieldListHTML = "<ul>";
                if (log.fields && log.fields.length > 0) {
                    log.fields.forEach((field) => {
                        fieldListHTML += `<li>${field.fieldCode} (${field.fieldName})</li>`;
                    });
                } else {
                    fieldListHTML += "<li>No staff assigned</li>";
                }
                fieldListHTML += "</ul>";

                relatedLogDivs.innerHTML += `
                    <div class="card mb-3" style="width: 100%;">
                        <p class="card-header">Log Code: ${log.logCode}</p>
                        <div class="card-body">
                            <small class="card-title">Date: ${new Date(log.logDate).toLocaleDateString()}</small><br><br>
                            <small class="card-text">${log.logDetails}</small><br><br>
                            <img src="data:image/jpeg;base64,${log.observedImage}" width="200" height="200" alt="no_image"/><br><br>
                            <small class="card-text">Related Staff</small>
                          <small class="card-text">${staffListHTML}</small><br>
                          <small class="card-text">Related Field</small>
                          <small class="card-text">${fieldListHTML}</small>
                        </div>
                    </div>
                `;
            })
        }
        , error: (error) => {
            console.error(error);
            const errorMessage = error.responseText || "An unexpected error occurred.";
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: `${errorMessage}`,
            })
        }
    })
}

const loadRelatedStaffDivs = (jwtToken) => {
    let relatedStaffDivs = document.getElementById("related-monitoring-div");
    if (!relatedStaffDivs) return;

    relatedStaffDivs.innerHTML = "";

    let monitorFieldSelector = document.getElementById("monitor-field-select");
    if (!monitorFieldSelector) return;

    let fieldCode = monitorFieldSelector.value;
    if (!fieldCode) return;

    $.ajax({
        url: `http://localhost:8082/api/v1/staff/field/${fieldCode}`,
        method: "GET",
        headers: {
            "Authorization": `Bearer ${jwtToken}`
        },
        success: (data) => {
            data.forEach((staff) => {
                const card = document.createElement('div');
                card.className = 'card mb-3';
                card.style.width = '100%';

                card.innerHTML = `
            <p class="card-header">Staff Code: ${staff.id}</p>
            <div class="card-body">
                <small class="card-title">Name: ${staff.firstName} ${staff.lastName}</small><br>
                <small class="card-text">Role: ${staff.role}</small><br>
                <small class="card-text">Email: ${staff.email}</small><br>
                <small class="card-text">Phone: ${staff.contactNumber}</small><br><br>
            </div>
        `;

                const button = document.createElement('button');
                button.className = 'btn btn-primary';
                button.textContent = 'Release';
                button.onclick = () => releaseStaffFromField(staff.id, fieldCode, jwtToken);

                card.querySelector('.card-body').appendChild(button);
                relatedStaffDivs.appendChild(card);
            })
        }
        , error: (error) => {
            const errorMessage = error.responseText || "An unexpected error occurred.";
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: `${errorMessage}`,
            })
        }
    })
}

const releaseStaffFromField = (staffId, fieldCode, jwtToken) => {
    staffId = decodeURIComponent(staffId);
    fieldCode = decodeURIComponent(fieldCode);
    jwtToken = decodeURIComponent(jwtToken);

    console.log(staffId, " ", fieldCode, " ", jwtToken);

    const formData = new FormData();
    formData.append("staffId", staffId);
    formData.append("fieldCode", fieldCode);

    $.ajax({
        url: "http://localhost:8082/api/v1/staff",
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${jwtToken}`
        },
        data: formData,
        processData: false,
        contentType: false,
        success: () => {
            loadRelatedStaffDivs(jwtToken);
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Staff released successfully',
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


const loadFieldSelectorMonitor = (jwtToken) => {
    let fieldSelectorMonitor = document.getElementById("field-select-2");
    if (!fieldSelectorMonitor) return;

    $.ajax({
        url: "http://localhost:8082/api/v1/field",
        method: "GET",
        headers: {
            "Authorization": `Bearer ${jwtToken}`
        },
        success: (data) => {
            data.forEach((field) => {
                let option = document.createElement("option");
                option.innerHTML = field.fieldName;
                option.value = field.fieldCode;
                fieldSelectorMonitor.appendChild(option);
            })
        }
        , error: (error) => {
            const errorMessage = error.responseText || "An unexpected error occurred.";
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: `${errorMessage}`,
            })
        }
    })
}


const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    return parts.length === 2 ? parts.pop().split(';').shift() : null;
};

const showImageModal = (base64Image) => {
    const modalImage = document.getElementById("modalImage");
    modalImage.src = `data:image/jpeg;base64,${base64Image}`;
};