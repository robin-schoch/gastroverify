class Bill {
    constructor(
        partnerId,
        from,
        to,
        complete,
        paidAt,
        total,
        distinctTotal,
        price
    ) {
        this.partnerId = partnerId
        this.billingDate = to
        this.from = from
        this.to = to
        this.complete = complete
        this.paidAt = paidAt
        this.total = total
        this.distinctTotal = distinctTotal
        this.price = price
    }

}

const billBuilder = (partnerId, from, to, total, distinct, price) => {
    return new Bill(partnerId, from, to, false, "", total, distinct, price)
}

module.exports = {
    Bill,
    billBuilder
}
