document.addEventListener("DOMContentLoaded", () => {
    console.log("Monitor loaded");

    const jwtToken = getCookie("token");

    loadCropsSelector(jwtToken);

    let monitorCropSelector = document.getElementById("monitor-crop-select");
    if (monitorCropSelector) {
        monitorCropSelector.addEventListener('change', () => loadRelatedLogDivs(jwtToken));
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

const loadRelatedLogDivs = (jwtToken) => {
    let relatedLogDivs = document.getElementById("related-crop-logs-div");
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
                            <img src="${log.observedImage}" width="100" height="100" alt="observed_image"/><br><br>
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




const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    return parts.length === 2 ? parts.pop().split(';').shift() : null;
};