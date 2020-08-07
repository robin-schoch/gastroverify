import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {AuthenticationService} from '../authentication.service';

@Component({
    selector: 'app-signin',
    templateUrl: './signin.component.html',
    styleUrls: ['./signin.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SigninComponent implements OnInit {

    /***************************************************************************
     *                                                                         *
     * Fields                                                                  *
     *                                                                         *
     **************************************************************************/

    public loginUser$: BehaviorSubject<{ username: string, password: string }> = new BehaviorSubject<{ username: string; password: string }>({
        username: null,
        password: null
    });

    constructor(
        private authentiactionService: AuthenticationService
    ) { }

    ngOnInit() {
    }

    public signIn() {
        const userSnapshot = this.loginUser$.getValue();
        this.authentiactionService.signIn(
            userSnapshot.username,
            userSnapshot.password
        );

    }
}
