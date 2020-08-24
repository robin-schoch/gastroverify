class Page {
    constructor(Data, Limit, Count, ScannedCount, LastEvaluatedKey = null) {
        this.Data = Data
        this.Limit = Limit
        this.Count = Count
        this.ScannedCount = ScannedCount
        this.LastEvaluatedKey = LastEvaluatedKey

    }
}

const pageBuilder = (data, queryParams) => {
    return new Page(data.Items, queryParams.Limit, data.Count, data.ScannedCount, data.LastEvaluatedKey)
}

module.exports = {
    Page,
    pageBuilder
}
