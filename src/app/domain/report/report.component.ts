import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Report, ReportService} from './report.service';
import {BehaviorSubject, Observable} from 'rxjs';
import {GastroService, Location} from '../gastro-dashboard/gastro.service';
import {filter, map} from 'rxjs/operators';
import {ToolbarService} from '../main/toolbar.service';
import * as moment from 'moment';

@Component({
    selector: 'app-report',
    templateUrl: './report.component.html',
    styleUrls: ['./report.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReportComponent implements OnInit {

    public locations$: Observable<Location[]>;

    public _selectedLocation$: BehaviorSubject<Location> = new BehaviorSubject<Location>(null);

    public reports$: Observable<Report[]>;

    displayedColumns = [
        'date',
        'distinctTotal',
        'total',
        'estimatedCost'

    ];

    constructor(
        private reportService: ReportService,
        private partnerService: GastroService,
        private toolbarService: ToolbarService
    ) {
        this.partnerService.getGastro();
        this.locations$ = this.partnerService.gastro$.pipe(
            filter(p => !!p),
            map(p => p.locations)
        );
        this.reports$ = this.reportService.reports$;
        this.toolbarService.toolbarTitle = 'Report';
    }

    ngOnInit(): void {


    }

    selectLocation(location) {
        console.log('hello');
        this.selectedLocation = location;
        this.loadReport(location);

    }

    loadReport(location) {
        this.reportService.loadReports(
            location,
            null
        ).then(r => this.reportService.reports = r.Data).catch(err => console.log(err));
    }

    subtractDay(isoTime: string): string {
        return moment(isoTime).subtract(
            1,
            'day'
        ).toISOString();
    }

    /***************************************************************************
     *                                                                         *
     * Getters / Setters                                                       *
     *                                                                         *
     **************************************************************************/

    get selectedLocation$(): Observable<Location> {
        return this._selectedLocation$.asObservable();
    }

    set selectedLocation(location: Location) {
        this._selectedLocation$.next(location);
    }

}
