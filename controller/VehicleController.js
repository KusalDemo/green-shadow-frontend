import {VehicleModel} from "../model/VehicleModel.js";
import {getCookie, showErrorAlert, destroyDataTable} from "../utils/utils.js";
import {isValidSriLankanNumberPlate} from "../utils/validations.js";


document.addEventListener("DOMContentLoaded", () => {
    const jwtToken = getCookie("token");
    loadTable(jwtToken);

    let btnNavigateToVehicle = document.getElementById("nav-vehicle");
    if (btnNavigateToVehicle) {
        btnNavigateToVehicle.addEventListener('click', () => {
            loadStaffList(jwtToken);
        });
    }

    let btnSaveVehicle = document.getElementById("vehicle-save-btn");
    if (btnSaveVehicle) {
        btnSaveVehicle.addEventListener('click', () => saveVehicle(jwtToken));
    }

    let btnUpdateVehicle = document.getElementById("vehicle-update-btn");
    if (btnUpdateVehicle) {
        btnUpdateVehicle.addEventListener('click', () => updateVehicle(jwtToken));
    }

    let btnClearVehicleForm = document.getElementById("vehicle-clear-btn");
    if (btnClearVehicleForm) {
        btnClearVehicleForm.addEventListener('click', () => clearVehicleForm());
    }

    let btnDeleteVehicle = document.getElementById("vehicle-delete-btn");
    if (btnDeleteVehicle) {
        btnDeleteVehicle.addEventListener('click', () => deleteVehicle(jwtToken));
    }


})

const loadStaffList = (jwtToken) => {
    let vehicleResponsibleStaffSelector = document.getElementById("vehicle-staff-select");
    if (!vehicleResponsibleStaffSelector) return;

    vehicleResponsibleStaffSelector.innerHTML = "";

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

    destroyDataTable('#vehicle-table');

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
                    <td>${staff}</td>
                `;

                row.addEventListener("click", () => updateFormFields(vehicle));

                vehicleTable.appendChild(row);
            });
            new DataTable("#vehicle-table", {paging: true, pageLength: 10, destroy: true});
        },
        error: (error) => showErrorAlert(error)
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
                clearVehicleForm();
            },
            error: (error) => showErrorAlert(error)
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


const updateVehicle = async (jwtToken) => {
    let vehicleToUpdate = await getValuesInVehicleForm();
    if (!vehicleToUpdate) return;

    let vehicleCodeToUpdate = document.getElementById("vehicle-code").innerText;
    if (!vehicleCodeToUpdate) return ;

    try {
        $.ajax({
            url: "http://localhost:8082/api/v1/vehicle/" + vehicleCodeToUpdate,
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${jwtToken}`
            },
            data: JSON.stringify(vehicleToUpdate),
            contentType: "application/json",
            success: (data) => {
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Vehicle updated successfully'
                })
                loadTable(jwtToken);
                clearVehicleForm();
            },
            error: (error) => showErrorAlert(error)
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

const deleteVehicle = (jwtToken) => {
    let vehicleCodeToDelete = document.getElementById("vehicle-code").innerText;
    if (vehicleCodeToDelete) {
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
                        url: "http://localhost:8082/api/v1/vehicle/" + vehicleCodeToDelete,
                        method: "DELETE",
                        headers: {
                            "Authorization": `Bearer ${jwtToken}`
                        },
                        success: (data) => {
                            Swal.fire({
                                icon: 'success',
                                title: 'Success',
                                text: 'Vehicle deleted successfully'
                            })
                            loadTable(jwtToken);
                            clearVehicleForm();
                        },
                        error: (error) => showErrorAlert(error)
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
        })
    }else {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: `Select a vehicle to delete!`,
        })
    }
}
const updateFormFields = (vehicle) => {
    document.getElementById("vehicle-code").innerText = vehicle.vehicleCode || "";
    document.getElementById("license-plate-number-input").value = vehicle.licensePlateNumber || "";
    document.getElementById("vehicle-category-select").value = vehicle.vehicleCategory || "";
    document.getElementById("fuel-type-select").value = vehicle.fuelType || "";
    document.getElementById("vehicle-status-select").value = vehicle.status || "";
    document.getElementById("remarks-input").value = vehicle.remarks || "";
    document.getElementById("vehicle-staff-select").value = vehicle.staff.id || "";
}

const getValuesInVehicleForm = () => {
    let licensePlateNumber = document.getElementById("license-plate-number-input").value;
    let vehicleCategory = document.getElementById("vehicle-category-select").value;
    let fuelType = document.getElementById("fuel-type-select").value;
    let vehicleStatus = document.getElementById("vehicle-status-select").value;
    let remarks = document.getElementById("remarks-input").value;
    let vehicleResponsibleStaff = document.getElementById("vehicle-staff-select").value;

    if (!licensePlateNumber || !vehicleCategory || !fuelType || !vehicleStatus || !remarks || !vehicleResponsibleStaff) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Please fill in all the fields',
        })
        return;
    }
    if (!isValidSriLankanNumberPlate(licensePlateNumber)) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Please enter a valid license plate number',
        })
        return;
    }

    let vehicleModel = new VehicleModel();

    vehicleModel.setLicensePlateNumber(licensePlateNumber);
    vehicleModel.setVehicleCategory(vehicleCategory);
    vehicleModel.setFuelType(fuelType);
    vehicleModel.setStatus(vehicleStatus);
    vehicleModel.setRemarks(remarks);
    vehicleModel.setStaff(vehicleResponsibleStaff);

    return vehicleModel;
}

const clearVehicleForm = () => {
    document.getElementById("license-plate-number-input").value = "";
    document.getElementById("vehicle-category-select").value = "";
    document.getElementById("fuel-type-select").value = "";
    document.getElementById("vehicle-status-select").value = "";
    document.getElementById("remarks-input").value = "";
    document.getElementById("vehicle-staff-select").value = "";
    document.getElementById("vehicle-code").innerText = "";
}