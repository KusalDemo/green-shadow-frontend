import {CropModel} from "../model/CropModel.js";
import {getCookie,showErrorAlert} from "../utils/utils.js";

document.addEventListener("DOMContentLoaded", () => {
    const jwtToken = getCookie("token");

    loadTable(jwtToken);
    loadFieldCodes(jwtToken);
    loadCropCodes(jwtToken);

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

    let btnUploadCropImage = document.getElementById("btn-upload-crop-images");
    if (btnUploadCropImage) {
        btnUploadCropImage.addEventListener('click', () => uploadCropImages(jwtToken));
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
                            <img src="data:image/jpeg;base64,${cropImage}" class="img-thumbnail rounded" style="width: 100px; height: 80px;" alt="crop image">
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
            ,error: (error) => showErrorAlert(error)
        })
    } catch (error) {
        console.log(error);
    }
}

const loadCropCodes = (jwtToken) => {
    let cropCodeSelector = document.getElementById("crop-select-2");
    if (!cropCodeSelector) return;

    try {
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
                    cropCodeSelector.appendChild(option);
                })
            }
            , error: (error) => showErrorAlert(error)
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
                    error: (error) => showErrorAlert(error)
                })
            } catch (error) {
                console.log(error);
            }
        }
    }
}

const updateCrop = (jwtToken) => {
    if (document.getElementById("crop-code").innerText === "") {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Please select a crop to update',
        })
    } else {
        let cropToUpdate = getValuesInCropForm();
        if (cropToUpdate) {
            try {
                $.ajax({
                    url: "http://localhost:8082/api/v1/crop/" + document.getElementById("crop-code").innerText,
                    method: "PUT",
                    headers: {
                        "Authorization": `Bearer ${jwtToken}`
                    },
                    data: JSON.stringify(cropToUpdate),
                    contentType: "application/json",
                    success: () => {
                        Swal.fire({
                            icon: 'success',
                            title: 'Crop updated successfully',
                            text: 'Crop updated successfully',
                        })
                        loadTable(jwtToken);
                        clearCropForm();
                    },
                    error: (error) => showErrorAlert(error)
                })
            } catch (error) {
                console.log(error);
            }
        }
    }
}

const deleteCrop = (jwtToken) => {
    let cropToDelete = document.getElementById("crop-code");
    if (cropToDelete.innerText === "") {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Please select a crop to delete',
        })
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
                        url: "http://localhost:8082/api/v1/crop/" + document.getElementById("crop-code").innerText,
                        method: "DELETE",
                        headers: {
                            "Authorization": `Bearer ${jwtToken}`
                        },
                        success: () => {
                            Swal.fire({
                                icon: 'success',
                                title: 'Crop deleted successfully',
                                text: 'Crop deleted successfully',
                            })
                            loadTable(jwtToken);
                            clearCropForm();
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

const uploadCropImages = (jwtToken) => {
    let selectedCropToUploadImage = document.getElementById("crop-select-2").value;
    if (selectedCropToUploadImage === "") {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Please select a crop to upload image',
        })
    } else {
        let cropImageToSave = document.getElementById("crop-image-input-1").files[0];
        if (cropImageToSave === undefined) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please select an image to upload',
            })
        } else {
            let formData = new FormData();
            formData.append("cropCode", selectedCropToUploadImage);
            formData.append("image", cropImageToSave);

            $.ajax({
                url: "http://localhost:8082/api/v1/crop",
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
                        text: 'Image uploaded successfully!'
                    })
                    loadTable(jwtToken);
                    clearCropImageForm();
                },
                error: (error) => showErrorAlert(error)
            })
        }
    }
}
const getValuesInCropForm = () => {
    let cropCommonName = document.getElementById("crop-common-name-input").value;
    let cropScientificName = document.getElementById("crop-scientific-name-input").value;
    let cropSeason = document.getElementById("crop-season-select").value;
    let cropField = document.getElementById("crop-field-select").value;
    let category = document.getElementById("crop-category-select").value;

    let cropModel = new CropModel();

    cropModel.setCropCommonName(cropCommonName);
    cropModel.setCropScientificName(cropScientificName);
    cropModel.setCropSeason(cropSeason);
    cropModel.setFieldCode(cropField);
    cropModel.setCategory(category);

    return cropModel;
}

const populateCropFields = (crop) => {
    document.getElementById("crop-code").innerText = crop.cropCode;
    document.getElementById("crop-common-name-input").value = crop.cropCommonName;
    document.getElementById("crop-scientific-name-input").value = crop.cropScientificName;
    document.getElementById("crop-season-select").value = crop.cropSeason;
    document.getElementById("crop-field-select").value = crop.fieldCode;
    document.getElementById("crop-category-select").value = crop.category;
}

const clearCropForm = () => {
    document.getElementById("crop-code").innerText = "";
    document.getElementById("crop-common-name-input").value = "";
    document.getElementById("crop-scientific-name-input").value = "";
    document.getElementById("crop-season-select").value = "";
    document.getElementById("crop-field-select").value = "";
    document.getElementById("crop-category-select").value = "";
}

const clearCropImageForm = () => {
    document.getElementById("crop-select-2").value = "";
    document.getElementById("crop-image-input-1").value = "";
}

