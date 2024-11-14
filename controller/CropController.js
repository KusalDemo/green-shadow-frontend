import {CropModel} from "../model/CropModel.js";

document.addEventListener("DOMContentLoaded", () => {
    console.log("Crop loaded");
    const jwtToken = getCookie("token");

    loadTable(jwtToken);
    loadFieldCodes(jwtToken);

    let btnSaveCrop = document.getElementById("crop-save-btn");
    if (btnSaveCrop) {
        btnSaveCrop.addEventListener('click', () => saveCrop(jwtToken));
    }

    let btnUpdateCrop = document.getElementById("crop-update-btn");
    if (btnUpdateCrop) {
        btnUpdateCrop.addEventListener('click', () => updateCrop(jwtToken));
    }

    let btnClearCropForm = document.getElementById("crop-clear-btn");
    if (btnClearCropForm) {
        btnClearCropForm.addEventListener('click', () => clearCropForm());
    }

    let btnDeleteCrop = document.getElementById("crop-delete-btn");
    if (btnDeleteCrop) {
        btnDeleteCrop.addEventListener('click', () => deleteCrop(jwtToken));
    }
})

const loadTable = (jwtToken) => {

    let cropTable = document.getElementById("crop-table-body");
    if (!cropTable) return;

    try {
        $.ajax({
            url: "http://localhost:8082/api/v1/crop",
            method: "GET",
            headers: {
                "Authorization": `Bearer ${jwtToken}`
            },
            success: (data) => {
                cropTable.innerHTML = "";
                data.forEach((crop, index) => {
                    const {
                        cropCode,
                        cropCommonName,
                        cropScientificName,
                        cropSeason,
                        category,
                        fieldCode,
                        cropImage
                    } = crop;

                    let row = document.createElement("tr");
                    row.innerHTML = `
                        <td>${cropCode}</td>
                        <td>${cropCommonName}</td>
                        <td>${cropScientificName}</td>
                         <td>${category}</td>
                        <td>${cropSeason}</td>
                        <td>${fieldCode}</td>
                        <td>
                            <img src="${cropImage}" width="100" height="100" alt="crop_image">
                        </td>
                    `;

                    cropTable.appendChild(row);

                    row.addEventListener("click", () => populateCropFields(crop));
                })
                new DataTable('#crop-table', {paging: true, pageLength: 10, destroy: true});
            }
        })
    } catch (error) {
        console.log(error);
    }
}

const loadFieldCodes = (jwtToken) => {
    let cropFieldSelector = document.getElementById("crop-field-select");
    if (!cropFieldSelector) return;

    try {
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
                    cropFieldSelector.appendChild(option);
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
    } catch (error) {
        console.log(error);
    }
}

const saveCrop = (jwtToken) => {
    if (document.getElementById("crop-code").innerText !== "") {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'crop is already added. Please update the crop details',
        })
    } else {
        let cropModel = getValuesInCropForm();
        if (cropModel) {
            try {
                $.ajax({
                    url: "http://localhost:8082/api/v1/crop",
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${jwtToken}`
                    },
                    data: JSON.stringify(cropModel),
                    contentType: "application/json",
                    success: () => {
                        Swal.fire({
                            icon: 'success',
                            title: 'Crop added successfully',
                            text: 'Crop added successfully',
                        })
                        loadTable(jwtToken);
                        clearCropForm();
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

const getValuesInCropForm = () => {
    let cropCommonName = document.getElementById("crop-common-name-input").value;
    let cropScientificName = document.getElementById("crop-scientific-name-input").value;
    let cropSeason = document.getElementById("crop-season-select").value;
    let cropField = document.getElementById("crop-field-select").value;

    let cropModel = new CropModel();

    cropModel.setCropCommonName(cropCommonName);
    cropModel.setCropScientificName(cropScientificName);
    cropModel.setCropSeason(cropSeason);
    cropModel.setFieldCode(cropField);

    return cropModel;
}

const populateCropFields = (crop) => {
    document.getElementById("crop-code").innerText = crop.cropCode;
    document.getElementById("crop-common-name-input").value = crop.cropCommonName;
    document.getElementById("crop-scientific-name-input").value = crop.cropScientificName;
    document.getElementById("crop-season-select").value = crop.cropSeason;
    document.getElementById("crop-field-select").value = crop.fieldCode;
}

const clearCropForm = () => {
    document.getElementById("crop-code").innerText = "";
    document.getElementById("crop-common-name-input").value = "";
    document.getElementById("crop-scientific-name-input").value = "";
    document.getElementById("crop-season-select").value = "";
    document.getElementById("crop-field-select").value = "";
}