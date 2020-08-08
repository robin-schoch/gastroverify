import {Injectable} from '@angular/core';
import API from '@aws-amplify/api';

@Injectable({
    providedIn: 'root'
})
export class EntryService {

    apiName = 'verifyGateway';
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

}

/*
 API.get(
 this.apiName,
 '/v1/entry',
 this.myInit
 ).then(res => console.log(res)).catch(error => console.log(error));
 });
 */
