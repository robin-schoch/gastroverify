const moment = require('moment');

class CheckIn {
    constructor(
        locationId,
        firstName,
        surName,
        email,
        address,
        city,
        zipcode,
        checkIn,
        timestamp,
        phonenumber,
        birthdate,
        firstUse,
        tableNumber = -1
    ) {
        this.locationId = locationId
        this.entryTime = timestamp
        this.firstName = firstName
        this.lastName = surName
        this.email = email
        this.street = address
        this.city = city
        this.zipCode = zipcode
        this.checkIn = checkIn
        this.phoneNumber = phonenumber
        this.birthdate = birthdate
        this.firstUse = firstUse
        this.tableNumber = tableNumber
        this.ttl = moment().add(14, "days").unix()
    }


}


module.exports = CheckIn
/*
patrtionkey = phone and sortkey = time
 */
// checkin
