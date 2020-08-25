import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {Partner} from '../../gastro-dashboard/gastro.service';
import {Report} from '../../report/report.service';
import {Page} from '../../entry-browser/entry.service';
import {Location} from '../../gastro-dashboard/gastro.service';
import {AdminService} from '../admin.service';

@Component({
    selector: 'app-admin-report',
    templateUrl: './admin-report.component.html',
    styleUrls: ['./admin-report.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminReportComponent implements OnInit {

    constructor(
        private adminService: AdminService
    ) { }

    @Input()
    public partner: Partner;

    public location: Location;

    ngOnInit(): void {
    }

    loadReports(location: string, page: Page<Report> = null) {


    }

    selectLocation(location: Location) {
        this.location = location;
        this.loadReports(location.locationId);

    }
}
