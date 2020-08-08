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

export interface Page {
    data,

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


    public getData() {
        API.get(
            this.apiName,
            '/v1/entry',
            this.myInit
        ).then(res => console.log(res)).catch(err => console.log(err));
        API.get(
            this.apiName,
            '/v1/gastro',
            this.myInit
        ).then(res => console.log(res)).catch(err => console.log(err));
    }

    public getEntriesPaged(bar: Bar) {
        console.log(bar);
        API.get(
            this.apiName,
            '/v1/entry/' + bar.barid,
            this.myInit
        ).then(elem => {
            console.log(elem);
        }).catch(error => {
            console.log(error);
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
