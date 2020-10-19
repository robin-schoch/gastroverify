import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {Location} from '../../model/Location';
import {DatePipe} from '@angular/common';
import {AmplifyHttpClientService} from '../../util/amplify-http-client.service';

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
  Zipcode,
  tableNumber
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

  constructor(
      private datepipe: DatePipe,
      private amplifyHttpClient: AmplifyHttpClientService
  ) { }

  public loadNextPage(location: Location, page?: Page<Entry>): Observable<Page<Entry>> {
    const init = {};
    if (!!page) {
      init['queryStringParameters'] = {  // OPTIONAL
        Limit: page.Limit,
        LastEvaluatedKey: JSON.stringify(page.LastEvaluatedKey)
      };
    } else {
      init['queryStringParameters'] = {  // OPTIONAL
        Limit: 100,
      };
    }
    return this.amplifyHttpClient.get<Page<Entry>>(this.apiName, `/v1/entry/${location.locationId}`, init);

  }

  public exportCSV(bar: Location) {
    const myInit = { // OPTIONAL
      response: true, // OPTIONAL (return the entire Axios response object instead of only response.data)
      responseType: 'text/csv'
    };
    this.amplifyHttpClient.get<any>(this.apiName, `/v1/entry/${bar.locationId}/export`, myInit).subscribe(elem => {
      const csvContent = 'data:text/csv;charset=utf-8,' + elem.data;
      const encodedUri = encodeURI(csvContent);
      const hiddenElement = document.createElement('a');
      hiddenElement.href = encodedUri;
      hiddenElement.target = '_blank';
      hiddenElement.download = `${this.datepipe.transform(
          new Date(),
          'dd-MM-yyy-hh-mm'
      )}_entry-check.csv`;
      hiddenElement.click();
    }, error => console.log(error));
  }

}
