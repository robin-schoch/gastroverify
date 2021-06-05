import {Injectable} from '@angular/core';
import {Location} from '../../model/Location';
import {DefaultDataService, HttpUrlGenerator} from '@ngrx/data';
import {HttpClient} from '@angular/common/http';
import {AmplifyHttpClientService} from '../../util/amplify-http-client.service';

@Injectable({
  providedIn: 'root'
})
export class LocationDataService extends DefaultDataService<Location> {

  constructor(private amplifyHttp: AmplifyHttpClientService, http: HttpClient, httpUrlGenerator: HttpUrlGenerator) {
    super('Location', http, httpUrlGenerator);
  }
}
