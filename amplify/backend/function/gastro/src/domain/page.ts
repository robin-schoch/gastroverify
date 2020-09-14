export class Page {
    public Data;
    public Limit;
    public Count;
    public ScannedCount;
    public LastEvaluatedKey;

    public static pageBuilder = (data, queryParams) => {
        return new Page(
            data.Items,
            queryParams.Limit,
            data.Count,
            data.ScannedCount,
            data.LastEvaluatedKey
        );
    }

    constructor(Data, Limit, Count, ScannedCount, LastEvaluatedKey = null) {
        this.Data = Data;
        this.Limit = Limit;
        this.Count = Count;
        this.ScannedCount = ScannedCount;
        this.LastEvaluatedKey = LastEvaluatedKey;

    }
}
