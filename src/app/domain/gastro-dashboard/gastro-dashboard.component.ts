import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {AuthenticationService} from '../auth/authentication.service';
import {ToolbarService} from '../main/toolbar.service';
import {EntryService} from '../entry-browser/entry.service';
import {Gastro, GastroService} from './gastro.service';
import {Observable} from 'rxjs';

@Component({
    selector: 'app-gastro-dashboard',
    templateUrl: './gastro-dashboard.component.html',
    styleUrls: ['./gastro-dashboard.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GastroDashboardComponent implements OnInit {

    public gastro$: Observable<Gastro>;

    public newGastro: Gastro = {
        email: '',
        barName: '',
        address: '',
        city: '',
        zipcode: '',
        bars: [],
        bills: []
    };

    constructor(
        private authenticationService: AuthenticationService,
        private toolbarService: ToolbarService,
        private entryService: EntryService,
        private gastroService: GastroService
    ) { }

    ngOnInit() {
        this.gastro$ = this.gastroService.gastro$;
        this.toolbarService.toolbarHidden = false;
        this.entryService.getData();
        //  this.authenticationService.signOut()
    }

    register() {
        this.gastroService.createGatro(this.newGastro);
    }
}
