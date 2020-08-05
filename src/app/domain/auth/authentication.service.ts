import {Injectable} from '@angular/core';
import {Auth} from 'aws-amplify';
import {BehaviorSubject} from 'rxjs';
import {CognitoUser} from 'amazon-cognito-identity-js';
import {SignUp} from './sign-up';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  public isAuthenticated$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public activeUser$: BehaviorSubject<CognitoUser | any> = new BehaviorSubject<CognitoUser | any>(null);

  constructor() { }

  public signOut(): void {
    Auth.signOut({global: true}).then(logout => {
      console.log(logout);
      this.isAuthenticated = false;
      this.activeUser = null;
    });
  }

  public signIn(username, password): void {
    Auth.signIn(username, password).then(user => {
      this.isAuthenticated = user;
      this.isAuthenticated = true;
    }).catch(error => {
        console.log(error);
      }
    );
  }

  public signUp(signUp: SignUp) {
    Auth.signUp(this.toAWSSignUp(signUp)).then(user => {
      this.activeUser = user.user;
    }).catch(error => console.log(error));
  }

  public confirmSignUp(code) {
    Auth.confirmSignUp(this.activeUser$.getValue().username, code)
        .then(elem => this.isAuthenticated = true)
        .catch(error => console.log(error));
  }

  public changePassword(oldPw, newPw) {
    Auth.changePassword(this.activeUser$.getValue(), oldPw, newPw)
        .then(elem => console.log(elem))
        .catch(elem => console.log(elem));
  }

  private set isAuthenticated(isAuthenticated: boolean) {
    this.isAuthenticated$.next(isAuthenticated);
  }

  private set activeUser(user: CognitoUser) {
    this.activeUser$.next(user);
  }

  private toAWSSignUp(signUp: SignUp): any {
    return {
      username: signUp.username,
      password: signUp.password,
      attributes: {
        email: signUp.email
      }
    };
  }
}
