class Gastro {
    constructor(
        email,
        barName,
        address,
        city,
        zipcode,
        checkOutCode,
        checkInCode,
        bills = [],
    ) {
        this.email = email
        this.barName = barName
        this.address = address
        this.city = city
        this.zipcode = zipcode
        this.checkOutCode = checkOutCode
        this.checkInCode = checkInCode
        this.bills = bills
    }
}

module.exports = Gastro
