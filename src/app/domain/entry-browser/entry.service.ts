import {Injectable} from '@angular/core';
import API from '@aws-amplify/api';
import {Auth} from 'aws-amplify';

@Injectable({
    providedIn: 'root'
})
export class EntryService {

    apiName = 'v1';
    private myInit = { // OPTIONAL
        headers: {}
    };

    constructor() { }


    public getData() {
        Auth.currentSession().then(session => {
            console.log(session.getIdToken().getJwtToken());

            API.get(
                this.apiName,
                '/v1/gastro',
                this.myInit
            ).then(res => console.log(res)).catch(error => console.log(error));
        });
        console.log('asfd');

    }
}
