"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DailyReport = void 0;
class DailyReport {
    constructor(locationId, reportDate, distinctTotal, total) {
        this.locationId = locationId;
        this.reportDate = reportDate;
        this.distinctTotal = distinctTotal;
        this.total = total;
    }
}
exports.DailyReport = DailyReport;
