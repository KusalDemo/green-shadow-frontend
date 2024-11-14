import {EquipmentModel} from "../model/EquipmentModel.js";

document.addEventListener("DOMContentLoaded", () => {
    console.log("Equipment loaded");

    const jwtToken = getCookie("token");
    loadTable(jwtToken);
    loadStaffs(jwtToken);
    loadFieldCodes(jwtToken);

    let btnEquipmentSave = document.getElementById("equipment-save-btn");
    if (btnEquipmentSave) {
        btnEquipmentSave.addEventListener('click', () => saveEquipment(jwtToken));
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
            new DataTable('#equipment-table',{paging: true, pageLength: 10, destroy: true});
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
    })
}
const loadStaffs = (jwtToken) => {

    let equipmentStaffSelector = document.getElementById("equipment-staff-select");
    if (!equipmentStaffSelector) return;

    $.ajax({
      url : "http://localhost:8082/api/v1/staff",
      method : "GET",
      headers: {
        "Authorization": `Bearer ${jwtToken}`
      },
      success : (data) => {
        data.forEach((staff) => {
          let option = document.createElement("option");
            option.innerHTML = `${staff.firstName} ${staff.lastName} - ${staff.designation}`;
            option.value = staff.id;
          equipmentStaffSelector.appendChild(option);
        })
      },
      error : (error) => {
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




const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    return parts.length === 2 ? parts.pop().split(';').shift() : null;
};

const updateFormFields = (equipment) => {
    document.getElementById("equipment-id").innerHTML=equipment.equipmentId
    document.getElementById("equipment-name-input").value = equipment.name;
    document.getElementById("equipment-type-select").value = equipment.type;
    document.getElementById("equipment-status-select").value = equipment.status;
    document.getElementById("equipment-staff-select").value=equipment.staffId;
    document.getElementById("equipment-field-select").value=equipment.fieldCode;
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
    }else{
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