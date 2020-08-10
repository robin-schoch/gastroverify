import {Injectable} from '@angular/core';
import API from '@aws-amplify/api';
import {BehaviorSubject} from 'rxjs';
import {Bar} from '../gastro-dashboard/gastro.service';

export interface Entry {
    BarId,
    EntryTime,
    CheckIn,
    City,
    Email,
    FirstName,
    LastName,
    PhoneNumber,
    Street,
    Zipcode
}

export interface Page<T> {
    Data: T[],
    Limit: number,
    Count: number,
    ScannedCount: number
    LastEvaluatedKey: T
}

@Injectable({
    providedIn: 'root'
})
export class EntryService {

    apiName = 'verifyGateway';
    private pagedData: BehaviorSubject<Entry[]> = new BehaviorSubject<Entry[]>(null);
    private myInit = { // OPTIONAL
    };

    constructor() { }

    public loadNextPage(bar: Bar, page?: Page<Entry>): Promise<Page<Entry>> {
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
            '/v1/entry/' + bar.barid,
            init
        );
    }

    public exportCSV(bar: Bar) {
        API.endpoint(this.apiName).then(url => {
            const myInit = { // OPTIONAL
                response: true, // OPTIONAL (return the entire Axios response object instead of only response.data)
                responseType: 'text/csv'
            };
            API.get(
                this.apiName,
                `/v1/entry/${bar.barid}/export`,
                myInit
            ).then(elem => {
                const csvContent = 'data:text/csv;charset=utf-8,' + elem.data;
                const encodedUri = encodeURI(csvContent);
                console.log(encodedUri);
                const hiddenElement = document.createElement('a');
                hiddenElement.href =  encodedUri;
                hiddenElement.target = '_blank';
                hiddenElement.download = 'output.csv';
                hiddenElement.click();
            }).catch(error => console.log(error));
        });

    }

}

/*
 API.get(
 this.apiName,
 '/v1/entry',
 this.myInit
 ).then(res => console.log(res)).catch(error => console.log(error));
 });
 */
