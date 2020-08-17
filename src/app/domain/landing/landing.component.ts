import {AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {ToolbarService} from '../main/toolbar.service';
import {AuthenticationService} from '../auth/authentication.service';
import {Observable, Subscription} from 'rxjs';
import {Router} from '@angular/router';
import {GastroService} from '../gastro-dashboard/gastro.service';

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
        private router: Router
    ) { }


    ngOnInit() {
        let a = '';
        this.isAuthenticated$ = this.authenticationService.isAuthenticated$;
        console.log('landing page...');
        const sub = this.isAuthenticated$.subscribe(is => {
            console.log('User logged in: ' + is);
            if (is) {
                this.router.navigate(['gastro/personal']);
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
        let valueInVh = 90;
        console.log("scroll")
        document.querySelector('mat-sidenav-content').scrollTop = valueInVh * window.innerHeight / 100;

    }

}
