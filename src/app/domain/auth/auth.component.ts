import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {FormFieldTypes, onAuthUIStateChange} from '@aws-amplify/ui-components';
import {AuthenticationService} from './authentication.service';
import {CognitoUser} from "amazon-cognito-identity-js";


@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthComponent implements OnInit , OnDestroy{
    formFields: FormFieldTypes;

    constructor(
        private authService: AuthenticationService,
        private ref: ChangeDetectorRef
    ) {
        this.formFields = [
            {
                type: 'email',
                label: 'Email',
                placeholder: 'Email',
                required: true,
            },
            {
                type: 'password',
                label: 'Password',
                placeholder: 'Password',
                required: true,
            },
        ];

    }

    ngOnInit() {

        onAuthUIStateChange((authState, authData) => {

            if (authState === 'signedin') {
                this.authService.isAuthenticated = true;
                this.authService.activeUser = authData as CognitoUser;
            }
            this.ref.detectChanges();
        });


    }

    ngOnDestroy() {
        return onAuthUIStateChange;
    }


}
