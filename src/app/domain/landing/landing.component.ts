import {AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {ToolbarService} from '../main/toolbar.service';
import {AuthenticationService} from '../auth/authentication.service';
import {Observable, Subscription} from 'rxjs';
import {Router} from '@angular/router';

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
        private router: Router
    ) { }

    ngOnInit() {
        this.isAuthenticated$ = this.authenticationService.isAuthenticated$;
        console.log('landing page...');
        const sub = this.isAuthenticated$.subscribe(is => {
            console.log('User logged in: ' + is);
            if (is) {
                this.router.navigate(['gastro']);
            } else {
                console.log('no user logged in');
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

}
