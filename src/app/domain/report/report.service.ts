import {Injectable} from '@angular/core';
import {DatePipe} from '@angular/common';
import {BehaviorSubject, Observable} from 'rxjs';
import API from '@aws-amplify/api';
import {Page} from '../entry-browser/entry.service';
import {AmplifyHttpClientService} from '../../util/amplify-http-client.service';


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
        private datepipe: DatePipe,
        private amplifyHttpClient: AmplifyHttpClientService
    ) { }

    /***************************************************************************
     *                                                                         *
     * Public API                                                              *
     *                                                                         *
     **************************************************************************/

    public loadReports(location, page, date): Observable<Page<Report>> {
        let iso = date.toISOString()
        const init = {
        }
        if (!!page) {
            console.log(page.LastEvaluatedKey);
            init['queryStringParameters'] = {  // OPTIONAL
                Limit: page.Limit,
                LastEvaluatedKey: JSON.stringify(page.LastEvaluatedKey),
                date: iso
            };
        } else {
            init['queryStringParameters'] = {  // OPTIONAL
                Limit: 100,
                date: iso
            };
        }
        return this.amplifyHttpClient.get<Page<Report>>(this.apiName,
            '/v1/report/daily/' + location.locationId,
            init)

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
