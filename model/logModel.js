export class LogModel{
    constructor(date, description, image){
        this.date = date;
        this.description = description;
        this.image = image;
    }

    getDate(){
        return this.date;
    }

    getDescription(){
        return this.description;
    }

    getImage(){
        return this.image;
    }

    setDate(date){
        this.date = date;
    }

    setDescription(description){
        this.description = description;
    }

    setImage(image){
        this.image = image;
    }
}