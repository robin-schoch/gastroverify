import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {BehaviorSubject, Subscription} from 'rxjs';
import {SignUp} from '../sign-up';
import {AuthenticationService} from '../authentication.service';


@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignupComponent implements OnInit, OnDestroy {

    /***************************************************************************
     *                                                                         *
     * Fields                                                                  *
     *                                                                         *
     **************************************************************************/

    public newUser$: BehaviorSubject<SignUp> = new BehaviorSubject<SignUp>(new SignUp());

    private _subscriptions: Subscription[] = [];


    /***************************************************************************
     *                                                                         *
     * Constructor                                                             *
     *                                                                         *
     **************************************************************************/

    constructor(
        private authService: AuthenticationService
    ) { }


    /***************************************************************************
     *                                                                         *
     * Lifecycle                                                               *
     *                                                                         *
     **************************************************************************/
    ngOnInit() {
        let a = this.authService.isAuthenticated$.subscribe();
    }

    ngOnDestroy(): void {
        this._subscriptions.forEach(sub => sub.unsubscribe());
    }

    /***************************************************************************
     *                                                                         *
     * Public API                                                              *
     *                                                                         *
     **************************************************************************/

    public clearForm() {
        this.newUser$.next(new SignUp());
    }

    public signUp() {
        this.authService.signUp(this.newUser$.getValue());
    }

    public confirmSignUp(value: string) {
        const confirmation = this.authService.confirmSignUp(value, this.newUser$.getValue()).subscribe(value => {
            if (value === 'sucess') console.log('yes');
            confirmation.unsubscribe();
        });
        this._subscriptions.push(confirmation);
    }


}
