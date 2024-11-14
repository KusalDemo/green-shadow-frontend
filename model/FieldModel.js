export class FieldModel {
    constructor(
        fieldCode,
        fieldName,
        fieldLocation,
        extentSizeOfField,
        image1,
        image2,
        logCode
    ) {
        this.fieldCode = fieldCode;
        this.fieldName = fieldName;
        this.fieldLocation = fieldLocation;
        this.extentSizeOfField = extentSizeOfField;
        this.image1 = image1;
        this.image2 = image2;
        this.logCode = logCode;
    }

    getFieldCode() {
        return this.fieldCode;
    }

    getFieldName() {
        return this.fieldName;
    }

    getFieldLocation() {
        return this.fieldLocation;
    }

    getExtentSizeOfField() {
        return this.extentSizeOfField;
    }

    getImage1() {
        return this.image1;
    }

    getImage2() {
        return this.image2;
    }

    getLogCode() {
        return this.logCode;
    }

    setFieldCode(fieldCode) {
        this.fieldCode = fieldCode;
    }

    setFieldName(fieldName) {
        this.fieldName = fieldName;
    }

    setFieldLocation(fieldLocation) {
        this.fieldLocation = fieldLocation;
    }

    setExtentSizeOfField(extentSizeOfField) {
        this.extentSizeOfField = extentSizeOfField;
    }

    setImage1(image1) {
        this.image1 = image1;
    }

    setImage2(image2) {
        this.image2 = image2;
    }

    setLogCode(logCode) {
        this.logCode = logCode;
    }
}