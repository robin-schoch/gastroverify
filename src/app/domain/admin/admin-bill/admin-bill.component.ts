import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {AdminService} from '../admin.service';
import {Observable} from 'rxjs';
import {Bill} from '../../bill/bill.service';
import {Page} from '../../entry-browser/entry.service';

@Component({
    selector: 'app-admin-bill',
    templateUrl: './admin-bill.component.html',
    styleUrls: ['./admin-bill.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminBillComponent implements OnInit {

    public bills$: Observable<Page<Bill>>

    displayedColumns = [
        'date',
        'distinctTotal',
        'total',
        'price'

    ];

    @Input()
    public partnerId: string;


    constructor(
        private adminService: AdminService
    ) {
        this.bills$ = this.adminService.bills$;

    }

    ngOnInit(): void {
        this.adminService.loadBills(this.partnerId)
    }

}
