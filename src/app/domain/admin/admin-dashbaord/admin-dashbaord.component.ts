import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {AdminService} from '../admin.service';
import {Observable} from 'rxjs';
import {Page} from '../../entry-browser/entry.service';
import {Partner} from '../../gastro-dashboard/gastro.service';
import {IPartnerOverview, PartnerOverviewComponent} from '../partner-overview/partner-overview.component';
import {MatDialog} from '@angular/material/dialog';
import {filter, map} from 'rxjs/operators';

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
        'hide'
    ];

    /*
     let part = partners;
     part.Data = partners.Data.filter(elem => elem.hidden || elem.hidden === undefined);
     return part;
     */

    constructor(
        private adminService: AdminService,
        private dialog: MatDialog
    ) { }

    ngOnInit(): void {
        this.adminService.partners = null;
        this.loadPartners();
        this.partners$ = this.adminService.partners$.pipe(
            filter(elem => !!elem),
            map(partners => Object.assign(
                partners,
                {Data: partners.Data.filter(elem => elem.hidden || elem.hidden === undefined)}
            ))
        );

    }

    private loadPartners() {
        this.adminService.loadPartners().subscribe(elem => this.adminService.mergePartners(elem));
    }

    onPageEvent(page: Page<Partner>) {
        this.adminService.loadPartners(page).subscribe(elem => this.adminService.mergePartners(elem));
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

    public hidePartner(partner: Partner) {
        this.adminService.hideUser(partner.email).subscribe(elem => {
            this.loadPartners();
        });
    }
}
