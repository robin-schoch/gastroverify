const {v4: uuidv4} = require('uuid');

class CheckIn {
    constructor(
        barid,
        firstName,
        surName,
        email,
        address,
        city,
        zipcode,
        checkIn,
        timestamp,
        phonenumber
    ) {
        this.id = uuidv4()
        this.barid = barid
        this.firstname = firstName
        this.surName = surName
        this.email = email
        this.address = address
        this.city = city
        this.zipcode = zipcode
        this.checkIn = checkIn
        this.timestmap = timestamp
        this.phonenumber = phonenumber
    }


}


module.exports = CheckIn
