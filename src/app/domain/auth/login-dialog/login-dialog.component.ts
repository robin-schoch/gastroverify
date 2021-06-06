import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {FormFieldTypes, onAuthUIStateChange} from '@aws-amplify/ui-components';
import {AuthenticationService} from '../authentication.service';
import {Store} from '@ngrx/store';
import {successLogin} from '../../../store/authentication/authentication.action';

@Component({
    selector: 'app-login-dialog',
    templateUrl: './login-dialog.component.html',
    styleUrls: ['./login-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginDialogComponent implements OnInit, OnDestroy {

    formFields: FormFieldTypes;

    constructor(
        public dialogRef: MatDialogRef<LoginDialogComponent>,
        private authService: AuthenticationService,
        private ref: ChangeDetectorRef,
        private store: Store
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

    ngOnInit(): void {
        onAuthUIStateChange((authState, authData) => {
            if (authState === 'signedin') {
              this.store.dispatch(successLogin())
                this.dialogRef.close();
            }
            this.ref.detectChanges();
        });
    }

    ngOnDestroy() {
        return onAuthUIStateChange;
    }


}
