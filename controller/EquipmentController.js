import {EquipmentModel} from "../model/EquipmentModel.js";
import {getCookie,showErrorAlert,destroyDataTable} from "../utils/utils.js";

document.addEventListener("DOMContentLoaded", () => {
    destroyDataTable('#equipment-table')

    const jwtToken = getCookie("token");
    loadTable(jwtToken);
    loadStaffs(jwtToken);
    loadFieldCodes(jwtToken);

    let btnEquipmentSave = document.getElementById("equipment-save-btn");
    if (btnEquipmentSave) {
        btnEquipmentSave.addEventListener('click', () => saveEquipment(jwtToken));
    }

    let btnEquipmentUpdate = document.getElementById("equipment-update-btn");
    if (btnEquipmentUpdate) {
        btnEquipmentUpdate.addEventListener('click', () => updateEquipment(jwtToken));
    }

    let btnClearEquipmentForm = document.getElementById("equipment-clear-btn");
    if (btnClearEquipmentForm) {
        btnClearEquipmentForm.addEventListener('click', () => clearEquipmentForm());
    }

    let btnDeleteEquipment = document.getElementById("equipment-delete-btn");
    if (btnDeleteEquipment) {
        btnDeleteEquipment.addEventListener('click', () => deleteEquipment(jwtToken));
    }
})

const loadTable = (jwtToken) => {

    let equipmentTable = document.getElementById("equipment-table-body");
    if (!equipmentTable) return;

    $.ajax({
        url: "http://localhost:8082/api/v1/equipment",
        method: "GET",
        headers: {
            "Authorization": `Bearer ${jwtToken}`
        },
        success: (data) => {
            document.getElementById("equipments-count").innerText = data.length+' + ';
            equipmentTable.innerHTML = "";
            data.forEach((equipment, index) => {
                const {
                    equipmentId,
                    name,
                    type,
                    status,
                    staffId,
                    fieldCode
                } = equipment;

                let row = document.createElement("tr");
                row.innerHTML = `
                    <td>${equipmentId}</td>
                    <td>${name}</td>
                    <td>${type}</td>
                    <td>${status}</td>
                    <td>${staffId}</td>
                    <td>${fieldCode}</td>
                `;

                row.addEventListener("click", () => updateFormFields(equipment));
                equipmentTable.appendChild(row);
            })
            new DataTable('#equipment-table', {paging: true, pageLength: 10, destroy: true});
        },
        error: (error) => showErrorAlert(error)
    })
}
const loadStaffs = (jwtToken) => {

    let equipmentStaffSelector = document.getElementById("equipment-staff-select");
    if (!equipmentStaffSelector) return;

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
                equipmentStaffSelector.appendChild(option);
            })
        },
        error: (error) => showErrorAlert(error)
    })
}

const loadFieldCodes = (jwtToken) => {

    let equipmentFieldSelector = document.getElementById("equipment-field-select");
    if (!equipmentFieldSelector) return;

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
                equipmentFieldSelector.appendChild(option);
            })
        }
    })
}


const saveEquipment = async (jwtToken) => {
    if (document.getElementById("equipment-id").innerText !== "") {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Equipment is already added. Please update the equipment details',
        });
    } else {
        let equipmentToSave = await getValuesInEquipmentForm();
        if (!equipmentToSave) return;

        try {
            $.ajax({
                url: "http://localhost:8082/api/v1/equipment",
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${jwtToken}`
                },
                data: JSON.stringify(equipmentToSave),
                contentType: "application/json",
                success: () => {
                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: 'Equipment added successfully',
                    })
                    loadTable(jwtToken);
                    clearEquipmentForm();
                },
                error: (error) => showErrorAlert(error)
            })
        } catch (error) {
            console.log(error);
        }
    }
}

const updateEquipment = async (jwtToken) => {
    if (document.getElementById("equipment-id").innerText === "") {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Please select an equipment first',
        })
    } else {
        let equipmentToUpdate = await getValuesInEquipmentForm();
        if (!equipmentToUpdate) return;

        try {
            $.ajax({
                url: "http://localhost:8082/api/v1/equipment/" + equipmentToUpdate.equipmentId,
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${jwtToken}`
                },
                data: JSON.stringify(equipmentToUpdate),
                contentType: "application/json",
                success: () => {
                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: 'Equipment updated successfully',
                    })
                    loadTable(jwtToken);
                    clearEquipmentForm();
                },
                error: (error) => showErrorAlert(error)
            })
        } catch (error) {
            console.log(error);
        }
    }
}

const deleteEquipment = (jwtToken) => {
    let equipmentToDelete = document.getElementById("equipment-id").innerText;
    if (equipmentToDelete) {
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
                $.ajax({
                    url: "http://localhost:8082/api/v1/equipment/" + document.getElementById("equipment-id").innerText,
                    method: "DELETE",
                    headers: {
                        "Authorization": `Bearer ${jwtToken}`
                    },
                    success: () => {
                        Swal.fire({
                            icon: 'success',
                            title: 'Success',
                            text: 'Equipment deleted successfully',
                        })
                        loadTable(jwtToken);
                        clearEquipmentForm();
                    },
                    error: (error) => showErrorAlert(error)
                })
            }
        })
    }
}

const clearEquipmentForm = () => {
    document.getElementById("equipment-id").innerHTML = "";
    document.getElementById("equipment-name-input").value = "";
    document.getElementById("equipment-type-select").value = "";
    document.getElementById("equipment-status-select").value = "";
    document.getElementById("equipment-staff-select").value = "";
    document.getElementById("equipment-field-select").value = "";
}
const updateFormFields = (equipment) => {
    document.getElementById("equipment-id").innerHTML = equipment.equipmentId
    document.getElementById("equipment-name-input").value = equipment.name;
    document.getElementById("equipment-type-select").value = equipment.type;
    document.getElementById("equipment-status-select").value = equipment.status;
    document.getElementById("equipment-staff-select").value = equipment.staffId;
    document.getElementById("equipment-field-select").value = equipment.fieldCode;
}
const getValuesInEquipmentForm = async () => {
    let equipmentId = document.getElementById("equipment-id").innerText;
    let name = document.getElementById("equipment-name-input").value;
    let type = document.getElementById("equipment-type-select").value;
    let status = document.getElementById("equipment-status-select").value;
    let staffId = document.getElementById("equipment-staff-select").value;
    let fieldCode = document.getElementById("equipment-field-select").value;

    if (!name || !type || !status || !staffId || !fieldCode) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Please fill all the fields',
        })
        return;
    } else {
        let equipmentModel = new EquipmentModel();

        equipmentModel.setEquipmentId(equipmentId);
        equipmentModel.setName(name);
        equipmentModel.setType(type);
        equipmentModel.setStatus(status);
        equipmentModel.setStaffId(staffId);
        equipmentModel.setFieldCode(fieldCode);

        return equipmentModel;
    }
}