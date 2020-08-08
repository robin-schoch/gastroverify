import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {Bar} from '../../gastro-dashboard/gastro.service';
import {EntryService} from '../entry.service';
import {BehaviorSubject, Observable} from 'rxjs';

@Component({
    selector: 'app-entry-browser',
    templateUrl: './entry-browser.component.html',
    styleUrls: ['./entry-browser.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EntryBrowserComponent implements OnInit {

    private _selectedBar$: BehaviorSubject<Bar> = new BehaviorSubject<Bar>(null);

    constructor(
        private entryService: EntryService
    ) { }

    @Input()
    public set bar(bar: Bar) {
        if (!!bar) {
            console.log(bar);
            this._selectedBar$.next(bar);
            this.entryService.getEntriesPaged(bar);
        }
    }

    public get bar$(): Observable<Bar> {
        return this._selectedBar$.asObservable();
    }

    ngOnInit() {

    }

}
