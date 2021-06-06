import {Injectable} from '@angular/core';
import {Auth} from 'aws-amplify';
import {from, Observable} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor() {}

  public getCurrentUserFromAws(): Observable<any> {
    return from(Auth.currentAuthenticatedUser());
  }

  public signOutObservable(): Observable<any> {
    return from(Auth.signOut({global: true}));
  }


}
