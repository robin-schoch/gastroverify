class DailyReport {
    constructor(
        locationId,
        reportDate,
        distinctTotal,
        total,
        pricePerEntry
    ) {
        this.locationId = locationId
        this.reportDate = reportDate
        this.distinctTotal = distinctTotal
        this.total = total
        this.pricePerEntry = pricePerEntry
    }
}

module.exports = {
    DailyReport
}
