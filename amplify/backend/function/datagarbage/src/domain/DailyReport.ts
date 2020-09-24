export class DailyReport {
    locationId;
    reportDate;
    distinctTotal;
    total;

    constructor(
        locationId,
        reportDate,
        distinctTotal,
        total
    ) {
        this.locationId = locationId;
        this.reportDate = reportDate;
        this.distinctTotal = distinctTotal;
        this.total = total;
    }
}
