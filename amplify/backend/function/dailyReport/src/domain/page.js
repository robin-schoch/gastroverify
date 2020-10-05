"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Page = void 0;
class Page {
    constructor(Data, Limit, Count, ScannedCount, LastEvaluatedKey = null) {
        this.Data = Data;
        this.Limit = Limit;
        this.Count = Count;
        this.ScannedCount = ScannedCount;
        this.LastEvaluatedKey = LastEvaluatedKey;
    }
}
exports.Page = Page;
Page.pageBuilder = (data, queryParams) => {
    return new Page(data.Items, queryParams.Limit, data.Count, data.ScannedCount, data.LastEvaluatedKey);
};
