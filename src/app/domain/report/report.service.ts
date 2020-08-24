import {Injectable} from '@angular/core';
import {DatePipe} from '@angular/common';
import {BehaviorSubject, Observable} from 'rxjs';
import API from '@aws-amplify/api';

export interface Report {
    locationId: string;
    reportDate: string;
    distinctTotal: number;
    total: number;
}

@Injectable({
    providedIn: 'root'
})
export class ReportService {

    /***************************************************************************
     *                                                                         *
     * Fields                                                                  *
     *                                                                         *
     **************************************************************************/

    private _reports$: BehaviorSubject<Report[]> = new BehaviorSubject<Report[]>([]);
    private myInit = { // OPTIONAL
    };
    private apiName: string = "verifyGateway";

    /***************************************************************************
     *                                                                         *
     * Constructor                                                             *
     *                                                                         *
     **************************************************************************/

    constructor(
        private datepipe: DatePipe
    ) { }

    /***************************************************************************
     *                                                                         *
     * Public API                                                              *
     *                                                                         *
     **************************************************************************/

    public loadReports(location, page): Promise<Report[]> {
        const init = Object.assign(
            {},
            this.myInit
        );

        if (!!page) {
            console.log(page.LastEvaluatedKey);
            init['queryStringParameters'] = {  // OPTIONAL
                Limit: page.Limit,
                LastEvaluatedKey: JSON.stringify(page.LastEvaluatedKey)
            };
        } else {
            init['queryStringParameters'] = {  // OPTIONAL
                Limit: 100,
            };
        }
        return API.get(
            this.apiName,
            '/v1/report/daily' + location.locationId,
            init
        );
    }

    /***************************************************************************
     *                                                                         *
     * Getters / Setters                                                       *
     *                                                                         *
     **************************************************************************/

    get reports$() {
        return this._reports$.asObservable();
    }

    set reports(reports: Report[]) {
        this._reports$.next(reports);
    }
}
