import {Injectable} from '@angular/core';
import RestApi from '@aws-amplify/api-rest';
import {from, Observable, Observer} from 'rxjs';

export interface IOptionalRequestParams {
  headers?: any
  queryStringParameters?: any
  response?: boolean
  body?: any,
  responseType?: string
}


@Injectable({
  providedIn: 'root'
})
export class AmplifyHttpClientService {

  private initOptionalRequestParams: IOptionalRequestParams = {
    headers: {},
    queryStringParameters: {},
    response: false,
    body: {},
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
    init['responseType'] = optionalRequestParams.responseType;

    return from(RestApi.get(api, path, init));
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

    return from(RestApi.head(api, path, init));
  }

  public post<T>(
      api: string,
      path: string,
      optionalRequestParams: IOptionalRequestParams = this.initOptionalRequestParams,
  ): Observable<T> {
    const init = {};
    init['headers'] = optionalRequestParams.headers;
    init['queryStringParameters'] = optionalRequestParams.queryStringParameters;
    init['response'] = optionalRequestParams.response;
    init['body'] = optionalRequestParams.body;
    return from(RestApi.post(api, path, init));

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
    init['body'] = optionalRequestParams.body;
    return from(RestApi.put(api, path, init));
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
    return from(RestApi.del(api, path, init));
  }

}
