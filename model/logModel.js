export class LogModel{
    constructor(logDate, logDetails, observedImage){
        this.logDate = logDate;
        this.logDetails = logDetails;
        this.observedImage = observedImage;
    }

    getLogDate() {
        return this.logDate;
    }

    getLogDetails() {
        return this.logDetails;
    }

    getObservedImage() {
        return this.observedImage;
    }

    setLogDate(logDate) {
        this.logDate = logDate;
    }

    setLogDetails(logDetails) {
        this.logDetails = logDetails;
    }

    setObservedImage(observedImage) {
        this.observedImage = observedImage;
    }

}