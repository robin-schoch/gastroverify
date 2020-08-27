class Partner {
    constructor(
        email,
        firstName,
        lastName,
        address,
        city,
        zipcode,
        locations = [],
        bills = [],
    ) {
        this.email = email
        this.firstName = firstName
        this.lastName = lastName
        this.address = address
        this.city = city
        this.zipcode = zipcode
        this.locations = locations
        this.bills = bills
    }
}

class Location {
    constructor(
        locationId,
        name,
        street,
        city,
        zipcode,
        checkOutCode,
        checkInCode,
        active,
        payment,
        senderID
    ) {
        this.locationId = locationId
        this.name = name
        this.street = street
        this.city = city
        this.zipcode = zipcode
        this.checkOutCode = checkOutCode
        this.checkInCode = checkInCode

        this.active = active
        this.payment = payment
        this.senderID = senderID

    }

}

module.exports = {
    Partner: Partner,
    Location: Location
}
