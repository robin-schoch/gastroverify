import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {Bar} from '../../gastro-dashboard/gastro.service';
import {Entry, EntryService, Page} from '../entry.service';
import {BehaviorSubject, Observable} from 'rxjs';
import {PageEvent} from '@angular/material/paginator';
import {filter, map} from 'rxjs/operators';

@Component({
    selector: 'app-entry-browser',
    templateUrl: './entry-browser.component.html',
    styleUrls: ['./entry-browser.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EntryBrowserComponent implements OnInit {

    private _selectedBar$: BehaviorSubject<Bar> = new BehaviorSubject<Bar>(null);
    public data$: BehaviorSubject<Page<Entry>> = new BehaviorSubject<Page<Entry>>(null);
    public paginator$: Observable<Paginator>;
    displayedColumns = [
        'position',
        'name',
        'weight',
        'symbol'
    ];


    constructor(
        private entryService: EntryService
    ) {
        this.paginator$ = this.data$.pipe(
            filter(d => !!d),
            map(d => {
                console.log(d);
                return <Paginator>{
                    length: 10 + (d.LastEvaluatedKey ? d.Limit : 0),
                    pageSize: d.Limit,
                    pageSizeOptions: [
                        10,
                        50,
                        200
                    ]
                };
            })
        );
        this.paginator$.subscribe(elem => {
            console.log(elem);
        });
    }

    @Input()
    public set bar(bar: Bar) {
        if (!!bar) {
            console.log(bar);
            this._selectedBar$.next(bar);
            this.loadPage(bar);

        }
    }

    private loadPage(bar: Bar, page?: Page<Entry>) {
        this.entryService.loadNextPage(
            bar,
            page
        ).then(page => this.mergePages(page));
    }

    public get bar$(): Observable<Bar> {
        return this._selectedBar$.asObservable();
    }

    private mergePages(page: Page<Entry>): void {
        console.log(page);
        if (!this.data$.getValue()) {
            this.data$.next(page);
        } else {
            const p = Object.assign(
                <Page<Entry>>{},
                this.data$.getValue()
            );
            p.Data = p.Data.concat(page.Data);
            p.LastEvaluatedKey = page.LastEvaluatedKey;
            p.Count = page.Count;
            this.data$.next(p);
        }
    }

    onPageEvent(pagination: any) {
        const p = this.data$.getValue();
        p.Limit = pagination.pageSize;
        this.loadPage(
            this._selectedBar$.getValue(),
            p
        );
    }

    exportCSV() {
        this.entryService.exportCSV(this._selectedBar$.getValue());
    }


    ngOnInit() {

    }

}

export interface Paginator {
    length: number,
    pageSize: number,
    pageSizeOptions: number[]
}
