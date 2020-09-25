export class DailyReport {
    public locationId;
    public reportDate;
    public distinctTotal;
    public total;
    public pricePerEntry;

    constructor(
        locationId,
        reportDate,
        distinctTotal,
        total,
        pricePerEntry
    ) {
        this.locationId = locationId;
        this.reportDate = reportDate;
        this.distinctTotal = distinctTotal;
        this.total = total;
        this.pricePerEntry = pricePerEntry;
    }
}


