import {VehicleModel} from "../model/VehicleModel.js";

document.addEventListener("DOMContentLoaded", () => {
    console.log("Vehicle loaded");
    const jwtToken = getCookie("token");

    loadTable(jwtToken);
    loadStaffList(jwtToken);


    let btnSaveVehicle = document.getElementById("vehicle-save-btn");
    if (btnSaveVehicle) {
        btnSaveVehicle.addEventListener('click', () => saveVehicle(jwtToken));
    }
})

const loadStaffList = (jwtToken) => {
    let vehicleResponsibleStaffSelector = document.getElementById("vehicle-staff-select");
    if (!vehicleResponsibleStaffSelector) return;

    $.ajax({
        url: "http://localhost:8082/api/v1/staff",
        method: "GET",
        headers: {
            "Authorization": `Bearer ${jwtToken}`
        },
        success: (data) => {
            data.forEach((staff) => {
                let option = document.createElement("option");
                option.innerHTML = `${staff.firstName} ${staff.lastName} - ${staff.designation}`;
                option.value = staff.id;
                vehicleResponsibleStaffSelector.appendChild(option);
            })
        }
    })
}

const loadTable = (jwtToken) => {
    let vehicleTable = document.getElementById("vehicle-table-body");
    if (!vehicleTable) return;

    $.ajax({
        url: "http://localhost:8082/api/v1/vehicle",
        method: "GET",
        headers: {
            "Authorization": `Bearer ${jwtToken}`
        },
        success: (data) => {
            vehicleTable.innerHTML = "";
            data.forEach((vehicle, index) => {
                const {
                    vehicleCode,
                    licensePlateNumber,
                    vehicleCategory,
                    fuelType,
                    status,
                    remarks,
                    staff
                } = vehicle;

                let row = document.createElement("tr");
                row.innerHTML = `
                    <td>${vehicleCode}</td>
                    <td>${licensePlateNumber}</td>
                    <td>${vehicleCategory}</td>
                    <td>${fuelType}</td>
                    <td>${status}</td>
                    <td>${remarks}</td>
                    <td>${staff.id}</td>
                `;

                row.addEventListener("click", () => updateFormFields(vehicle));

                vehicleTable.appendChild(row);
            });
            new DataTable("#vehicle-table", {paging: true, pageLength: 10, destroy: true});
        },
        error: (error) => {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: `Something went wrong! ${error}`,
            })
        }
    })
}
const saveVehicle = async (jwtToken) => {
    let vehicleToSave = await getValuesInVehicleForm();
    if (!vehicleToSave) return;

    try {
        $.ajax({
            url: "http://localhost:8082/api/v1/vehicle",
            method: "POST",
            headers: {
                "Authorization": `Bearer ${jwtToken}`
            },
            data: JSON.stringify(vehicleToSave),
            contentType: "application/json",
            success: (data) => {
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Vehicle saved successfully'
                })
                loadTable(jwtToken);
            },
            error: (error) => {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: `Something went wrong! ${error}`,
                })
            }
        })
    } catch (error) {
        console.error(error);
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: `Something went wrong! try again!`,
        })
    }
}


const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    return parts.length === 2 ? parts.pop().split(';').shift() : null;
};

const updateFormFields = (vehicle) => {
    document.getElementById("vehicle-code").innerText = vehicle.vehicleCode || "";
    document.getElementById("license-plate-number-input").value = vehicle.licensePlateNumber || "";
    document.getElementById("vehicle-category-select").value = vehicle.vehicleCategory || "";
    document.getElementById("fuel-type-select").value = vehicle.fuelType || "";
    document.getElementById("vehicle-status-select").value = vehicle.status || "";
    document.getElementById("vehicle-staff-select").value = vehicle.staff.id || "";
}

const getValuesInVehicleForm = () => {
    let licensePlateNumber = document.getElementById("license-plate-number-input").value;
    let vehicleCategory = document.getElementById("vehicle-category-select").value;
    let fuelType = document.getElementById("fuel-type-select").value;
    let vehicleStatus = document.getElementById("vehicle-status-select").value;
    let remarks = document.getElementById("remarks-input").value;
    let vehicleResponsibleStaff = document.getElementById("vehicle-staff-select").value;

    let vehicleModel = new VehicleModel();

    vehicleModel.setLicensePlateNumber(licensePlateNumber);
    vehicleModel.setVehicleCategory(vehicleCategory);
    vehicleModel.setFuelType(fuelType);
    vehicleModel.setStatus(vehicleStatus);
    vehicleModel.setRemarks(remarks);
    vehicleModel.setStaff(vehicleResponsibleStaff);

    return vehicleModel;
}