import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {AdminService} from '../admin.service';
import {Observable} from 'rxjs';
import {Page} from '../../entry-browser/entry.service';
import {Partner} from '../../gastro-dashboard/gastro.service';
import {IPartnerOverview, PartnerOverviewComponent} from '../partner-overview/partner-overview.component';
import {MatDialog} from '@angular/material/dialog';

@Component({
    selector: 'app-admin-dashbaord',
    templateUrl: './admin-dashbaord.component.html',
    styleUrls: ['./admin-dashbaord.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminDashbaordComponent implements OnInit {

    public partners$: Observable<Page<Partner>>;


    displayedColumns = [
        'detail',
        'email',
        'firstName',
        'lastName',
        'address',
        'city',
        'zip',
    ];


    constructor(
        private adminService: AdminService,
        private dialog: MatDialog
    ) { }

    ngOnInit(): void {
        this.adminService.loadPartners();
        this.partners$ = this.adminService.partners$;
    }

    onPageEvent(page: Page<Partner>) {
        this.adminService.loadPartners(page);
    }

    openPartnerDetail(parnter: Partner) {
        const dialogRef = this.dialog.open(
            PartnerOverviewComponent,
            {
                panelClass: 'no-padding-dialog',
                height: '95vh',
                width: '98vw',
                data: <IPartnerOverview>{partner: parnter}
            }
        );
    }
}
