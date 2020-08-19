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
        table = -1
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
        this.table = table
    }


}


module.exports = CheckIn
/*
patrtionkey = phone and sortkey = time
 */
// checkin
