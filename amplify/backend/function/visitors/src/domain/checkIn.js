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
        phonenumber,
        firstUse
    ) {
        this.BarId = barid
        this.EntryTime = timestamp
        this.FirstName = firstName
        this.LastName = surName
        this.Email = email
        this.Street = address
        this.City = city
        this.Zipcode = zipcode
        this.CheckIn = checkIn
        this.PhoneNumber = phonenumber
        this.firstUse = firstUse
    }


}


module.exports = CheckIn
/*
patrtionkey = phone and sortkey = time
 */
// checkin
