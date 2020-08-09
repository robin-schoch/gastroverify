class Page {
    constructor(Data, Limit, Count,ScannedCount, LastEvaluatedKey = null) {
        this.Data = Data
        this.Limit = Limit
        this.Count = Count
        this.ScannedCount = ScannedCount
        this.LastEvaluatedKey = LastEvaluatedKey

    }
}

module.exports = {
    Page
}
