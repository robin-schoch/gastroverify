class Page {
    constructor(Data, Count, LastEvaluatedKey = null) {
        this.Data = Data
        this.Count = Count
        this.LastEvaluatedKey = LastEvaluatedKey
    }
}

module.exports = {
    Page
}
