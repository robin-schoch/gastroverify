import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {Location, Partner} from '../../gastro-dashboard/gastro.service';
import {Report} from '../../report/report.service';
import {Page} from '../../entry-browser/entry.service';
import {AdminService} from '../admin.service';
import * as moment from 'moment';
import {Observable} from 'rxjs';

@Component({
    selector: 'app-admin-report',
    templateUrl: './admin-report.component.html',
    styleUrls: ['./admin-report.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminReportComponent implements OnInit {

    constructor(
        private adminService: AdminService
    ) {
        this.reports$ = this.adminService.reports$;
    }

    displayedColumns = [
        'date',
        'distinctTotal',
        'total',
        'estimatedCost'

    ];

    public reports$: Observable<Page<Report>>;

    @Input()
    public partner: Partner;

    public location: Location;

    ngOnInit(): void {
        this.adminService.reports = null
    }

    loadReports(location: string, page: Page<Report> = null) {
        this.adminService.loadReports(
            location,
            this.partner.email,
            page
        );


    }

    selectLocation(location: Location) {
        console.log("location changed")
        console.log(location)
        if (location != this.location) {
            this.location = location;
            this.adminService.reports = null;
            this.loadReports(location.locationId);

        }

    }

    subtractDay(isoTime: string): string {
        return moment(isoTime).subtract(
            1,
            'day'
        ).toISOString();
    }

    getPrice(element: any) {
        if (element.hasOwnProperty('pricePerEntry')) {
            return element.distinctTotal * element.pricePerEntry;
        } else {
            return element.distinctTotal * 0.15;
        }
    }
}
