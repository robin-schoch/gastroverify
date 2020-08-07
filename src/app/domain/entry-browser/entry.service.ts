import {Injectable} from '@angular/core';
import API from '@aws-amplify/api';

@Injectable({
    providedIn: 'root'
})
export class EntryService {

    apiName = 'v1';
    private myInit = { // OPTIONAL

    };

    constructor() { }


    public getData() {
        console.log('asfd');
        API.get(
            this.apiName,
            '/gastro',
            this.myInit
        ).then(res => console.log(res)).catch(error => console.log(error));
    }
}
