import {AfterViewInit, ChangeDetectionStrategy, Component, NgZone, OnDestroy, OnInit} from '@angular/core';
import {ToolbarService} from '../main/toolbar.service';
import {AuthenticationService} from '../auth/authentication.service';
import {Observable, Subscription} from 'rxjs';
import {Router} from '@angular/router';
import {GastroService} from '../gastro-dashboard/gastro.service';
import {MatDialog} from '@angular/material/dialog';
import {LoginDialogComponent} from '../auth/login-dialog/login-dialog.component';

@Component({
    selector: 'app-landing',
    templateUrl: './landing.component.html',
    styleUrls: ['./landing.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LandingComponent implements OnInit, AfterViewInit, OnDestroy {

    private _subscritpion: Subscription[] = [];
    public isAuthenticated$: Observable<boolean>;


    constructor(
        private toolbarService: ToolbarService,
        private authenticationService: AuthenticationService,
        private gastroService: GastroService,
        private router: Router,
        private ngZone: NgZone,
        public dialog: MatDialog,
    ) { }


    ngOnInit() {
        let a = '';
        this.isAuthenticated$ = this.authenticationService.isAuthenticated$;
        const sub = this.isAuthenticated$.subscribe(is => {
            console.log('User logged in: ' + is);
            if (is) {
                this.ngZone.run(() => this.router.navigate(['location/dashboard']));
            } else {
                console.log('no user logged in');
                this.router.navigate(['']);
            }
        });
        this._subscritpion.push(sub);

    }

    ngAfterViewInit(): void {
        this.toolbarService.toolbarHidden = true;
    }

    ngOnDestroy(): void {
        this._subscritpion.forEach(sub => sub.unsubscribe());
    }


    public scrollToLogin(): void {
        this.openConfirmDialog();
        /*
         let valueInVh = 90;
         console.log('scroll');
         document.querySelector('mat-sidenav-content').scrollTop = valueInVh * window.innerHeight / 100;

         */

    }


    openConfirmDialog(): void {
        const dialogRef = this.dialog.open(
            LoginDialogComponent,
            {panelClass: 'no-padding-dialog'}
        );
    }

}
