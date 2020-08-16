import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {AuthenticationService} from '../auth/authentication.service';
import {ToolbarService} from '../main/toolbar.service';
import {EntryService} from '../entry-browser/entry.service';
import {Partner, GastroService} from '../gastro-dashboard/gastro.service';
import {MatDialog} from '@angular/material/dialog';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
    selector: 'app-personal',
    templateUrl: './personal.component.html',
    styleUrls: ['./personal.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PersonalComponent implements OnInit {

    public partner$: Observable<Partner>;
    public newGastro$: Observable<boolean>;

    constructor(
        private authenticationService: AuthenticationService,
        private toolbarService: ToolbarService,
        private entryService: EntryService,
        private gastroService: GastroService,
        public dialog: MatDialog
    ) { }

    ngOnInit() {
        this.partner$ = this.gastroService.gastro$;
        this.toolbarService.toolbarTitle = 'Dashboard';
        this.newGastro$ = this.gastroService.gastro$.pipe(map(g => !!g.email));
        this.toolbarService.toolbarHidden = false;
        this.gastroService.getGastro();

    }



    register() {
        this.gastroService.createGatro();
    }

}
