class Bill {
    constructor(
        partnerId,
        from,
        to,
        complete,
        paidAt,
        total,
        distinctTotal,
    ) {
        this.partnerId = partnerId
        this.from = from
        this.to = to
        this.complete = complete
        this.paidAt = paidAt
        this.total = total
        this.distinctTotal = distinctTotal
    }

}

const billBuilder = (partnerId, from, to, total, distinct) => {
    return new Bill(partnerId, from, to, false, "", total, distinct)
}

module.exports = {
    Bill,
    billBuilder
}
