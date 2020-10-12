export class DailyReport {

    public locationId;
    public reportDate;
    public distinctTotal;
    public total;

    public constructor(
        locationId,
        reportDate,
        distinctTotal,
        total
    ) {
        this.locationId = locationId
        this.reportDate = reportDate
        this.distinctTotal = distinctTotal
        this.total = total
    }
}

