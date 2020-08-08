import {Injectable} from '@angular/core';
import {Auth} from 'aws-amplify';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {CognitoUser} from 'amazon-cognito-identity-js';
import {SignUp} from './sign-up';
import {filter} from 'rxjs/operators';
import {Router} from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {

    /***************************************************************************
     *                                                                         *
     * Fields                                                                  *
     *                                                                         *
     **************************************************************************/

    private _isAuthenticated$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
    private _activeUser$: BehaviorSubject<CognitoUser | any> = new BehaviorSubject<CognitoUser | any>(null);

    private _signUpUser$: BehaviorSubject<CognitoUser | any> = new BehaviorSubject<CognitoUser | any>(null);

    /***************************************************************************
     *                                                                         *
     * Constructor                                                             *
     *                                                                         *
     **************************************************************************/

    constructor(
        private router: Router
    ) {

        Auth.currentAuthenticatedUser().then(user => {
            this.activeUser = user;
            this.isAuthenticated = true;
            console.log('Active user: ' + user.username);
        }).catch(elem => console.log('no active user'));
    }

    /***************************************************************************
     *                                                                         *
     * Public API                                                              *
     *                                                                         *
     **************************************************************************/

    public signOut(): void {
        Auth.signOut({global: true}).then(logout => {
            this.isAuthenticated = false;
            this.activeUser = null;
            this.router.navigate(['/']);
        });
    }

    public signIn(username, password): void {
        Auth.signIn(
            username,
            password
        ).then(user => {
            this.isAuthenticated = user;
            this.isAuthenticated = true;
        }).catch(error => {
                console.log(error);
            }
        );
    }

    public signUp(signUp: SignUp): boolean {
        if (signUp.email && signUp.password) {
            Auth.signUp(this.toAWSSignUp(signUp)).then(user => {
                this.signUpUser = user.user;
            }).catch(error => this.signUpUser = error);
            return true;
        }
        return false;

    }

    public confirmSignUp(code, user: SignUp): Observable<any> {
        const confirmationSucceded = new Subject();
        Auth.confirmSignUp(
            this._signUpUser$.getValue().username,
            code
        )
            .then(elem => {
                confirmationSucceded.next('success');
                const signUpUserSnapshto = this._signUpUser$.getValue();

                this.signIn(
                    user.email,
                    user.password
                );
                confirmationSucceded.complete();
            })
            .catch(error => {
                confirmationSucceded.next('error');
                confirmationSucceded.complete();
                console.log(error);
            });
        return confirmationSucceded.asObservable();
    }

    public changePassword(oldPw, newPw) {
        Auth.changePassword(
            this._activeUser$.getValue(),
            oldPw,
            newPw
        )
            .then(elem => console.log(elem))
            .catch(elem => console.log(elem));
    }

    /***************************************************************************
     *                                                                         *
     * Getters / Setters                                                       *
     *                                                                         *
     **************************************************************************/

    public get isAuthenticated$(): Observable<boolean> {
        return this._isAuthenticated$.pipe(filter(state => state !== null));
    }

    public get activeUser$(): Observable<CognitoUser> {
        return this._activeUser$.pipe(filter(user => !!user));
    }

    public get isAuthenticated(): boolean {
        return this._isAuthenticated$.getValue();
    }

    public set isAuthenticated(isAuthenticated: boolean) {
        this._isAuthenticated$.next(isAuthenticated);
    }

    public set activeUser(user: CognitoUser) {
        this._activeUser$.next(user);
    }

    public set signUpUser(user: CognitoUser | any) {
        this._signUpUser$.next(user);
    }

    /***************************************************************************
     *                                                                         *
     * Private methods                                                         *
     *                                                                         *
     **************************************************************************/



    private toAWSSignUp(signUp: SignUp): any {
        return {
            username: signUp.email,
            password: signUp.password,
            attributes: {
                email: signUp.email
            }
        };
    }
}
