export class CropModel{
    constructor(cropCode,
                cropCommonName,
                cropScientificName,
                cropImage,
                category,
                cropSeason,
                fieldCode
    ) {
        this.cropCode = cropCode;
        this.cropCommonName = cropCommonName;
        this.cropScientificName = cropScientificName;
        this.cropImage = cropImage;
        this.category = category;
        this.cropSeason = cropSeason;
        this.fieldCode = fieldCode;
    }

    getCropCode() {
        return this.cropCode;
    }

    getCropCommonName() {
        return this.cropCommonName;
    }

    getCropScientificName() {
        return this.cropScientificName;
    }

    getCropImage() {
        return this.cropImage;
    }

    getCategory() {
        return this.category;
    }

    getCropSeason() {
        return this.cropSeason;
    }

    getFieldCode() {
        return this.fieldCode;
    }

    setCropId(cropCode) {
        this.cropId = cropCode;
    }

    setCropCommonName(cropCommonName) {
        this.cropCommonName = cropCommonName;
    }

    setCropScientificName(cropScientificName) {
        this.cropScientificName = cropScientificName;
    }

    setCropImage(cropImage) {
        this.cropImage = cropImage;
    }

    setCategory(category) {
        this.category = category;
    }

    setCropSeason(cropSeason) {
        this.cropSeason = cropSeason;
    }

    setFieldCode(fieldCode) {
        this.fieldCode = fieldCode;
    }
}