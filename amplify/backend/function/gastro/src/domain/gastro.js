class Gastro {
    constructor(
        email,
        firstName,
        lastName,
        address,
        city,
        zipcode,
        bars = [],
        bills = [],
    ) {
        this.email = email
        this.firstName = firstName
        this.lastName = lastName
        this.address = address
        this.city = city
        this.zipcode = zipcode
        this.bars = bars
        this.bills = bills
    }
}

class Bar {
    constructor(
        barid,
        name,
        street,
        city,
        zipcode,
        checkOutCode,
        checkInCode,
        active
    ) {
        this.barid = barid
        this.name = name
        this.street = street
        this.city = city
        this.zipcode = zipcode
        this.checkOutCode = checkOutCode
        this.checkInCode = checkInCode
        this.active = active

    }

}

module.exports = {
    Gastro,
    Bar
}
