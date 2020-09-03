import {Injectable} from '@angular/core';
import RestApi from '@aws-amplify/api-rest';
import {Observable, Observer} from 'rxjs';

export interface IOptionalRequestParams {
    headers?: any
    queryStringParameters?: any
    response?: boolean
    body?: any
}


@Injectable({
    providedIn: 'root'
})
export class AmplifyHttpClientService {

    private initOptionalRequestParams: IOptionalRequestParams = {
        headers: {},
        queryStringParameters: {},
        response: false,
        body: {}
    };

    constructor() { }

    public get<T>(
        api: string,
        path: string,
        optionalRequestParams: IOptionalRequestParams = this.initOptionalRequestParams,
    ): Observable<T> {
        const init = {};
        init['headers'] = optionalRequestParams.headers;
        init['queryStringParameters'] = optionalRequestParams.queryStringParameters;
        init['response'] = optionalRequestParams.response;

        return new Observable((observer: Observer<T>) => {
            RestApi.get(
                api,
                path,
                init
            ).then(
                res => {
                    observer.next(res);
                    observer.complete();
                }
            ).catch(error => observer.error(error));
        });
    }


    public head<T>(
        api: string,
        path: string,
        optionalRequestParams: IOptionalRequestParams = this.initOptionalRequestParams,
    ): Observable<T> {
        const init = {};
        init['headers'] = optionalRequestParams.headers;
        init['queryStringParameters'] = optionalRequestParams.queryStringParameters;
        init['response'] = optionalRequestParams.response;

        return new Observable((observer: Observer<T>) => {
            RestApi.head(
                api,
                path,
                init
            ).then(
                res => {
                    observer.next(res);
                    observer.complete();
                }
            ).catch(error => observer.error(error));
        });
    }

    public post<T>(
        api: string,
        path: string,
        body: any,
        optionalRequestParams: IOptionalRequestParams = this.initOptionalRequestParams,
    ): Observable<T> {
        const init = {};
        init['headers'] = optionalRequestParams.headers;
        init['queryStringParameters'] = optionalRequestParams.queryStringParameters;
        init['response'] = optionalRequestParams.response;
        init['body'] = optionalRequestParams.body;

        return new Observable((observer: Observer<T>) => {
            RestApi.post(
                api,
                path,
                init
            ).then(
                res => {
                    observer.next(res);
                    observer.complete();
                }
            ).catch(error => observer.error(error));
        });
    }

    public put<T>(
        api: string,
        path: string,
        optionalRequestParams: IOptionalRequestParams = this.initOptionalRequestParams,
    ): Observable<T> {
        const init = {};
        init['headers'] = optionalRequestParams.headers;
        init['queryStringParameters'] = optionalRequestParams.queryStringParameters;
        init['response'] = optionalRequestParams.response;

        return new Observable((observer: Observer<T>) => {
            RestApi.put(
                api,
                path,
                init
            ).then(
                res => {
                    observer.next(res.data);
                    observer.complete();
                }
            ).catch(error => observer.error(error));
        });
    }

    public delete<T>(
        api: string,
        path: string,
        optionalRequestParams: IOptionalRequestParams = this.initOptionalRequestParams,
    ): Observable<T> {
        const init = {};
        init['headers'] = optionalRequestParams.headers;
        init['queryStringParameters'] = optionalRequestParams.queryStringParameters;
        init['response'] = optionalRequestParams.response;

        return new Observable((observer: Observer<T>) => {
            RestApi.del(
                api,
                path,
                init
            ).then(
                res => {
                    observer.next(res.data);
                    observer.complete();
                }
            ).catch(error => observer.error(error));
        });
    }

}
