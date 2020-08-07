import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {AuthenticationService} from '../auth/authentication.service';
import {ToolbarService} from '../main/toolbar.service';

@Component({
    selector: 'app-gastro-dashboard',
    templateUrl: './gastro-dashboard.component.html',
    styleUrls: ['./gastro-dashboard.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GastroDashboardComponent implements OnInit {

    constructor(
        private authenticationService: AuthenticationService,
        private toolbarService: ToolbarService
    ) { }

    ngOnInit() {
        this.toolbarService.toolbarHidden = false;
      //  this.authenticationService.signOut()
    }

}
