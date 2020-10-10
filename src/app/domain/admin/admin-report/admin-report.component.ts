import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';

import {Location} from '../../../model/Location';
import {Partner} from '../../../model/Partner';
import {Report} from '../../report/report.service';
import {Page} from '../../entry-browser/entry.service';
import {AdminService} from '../admin.service';
import * as moment from 'moment';
import {BehaviorSubject, Observable} from 'rxjs';
import {filter, map} from 'rxjs/operators';

@Component({
  selector: 'app-admin-report',
  templateUrl: './admin-report.component.html',
  styleUrls: ['./admin-report.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminReportComponent implements OnInit {

  public totalReports$: Observable<any>;

  constructor(
      private adminService: AdminService
  ) {
    this.reports$ = this.adminService.reports$;

    this.totalReports$ = this.reports$.pipe(
        filter(elem => !!elem),
        map(reports => {
          return {

            distinctTotal: reports.Data.reduce(
                (acc, elem) => acc + elem.distinctTotal,
                0
            ),
            total: reports.Data.reduce(
                (acc, elem) => acc + elem.total,
                0
            ),
            price: reports.Data.reduce(
                (acc, elem) => acc + this.getPrice(elem),
                0
            )
          };
        })
    );
  }

  displayedColumns = [
    'date',
    'distinctTotal',
    'total',
    'estimatedCost'

  ];

  public reports$: Observable<Page<Report>>;

  public date$ = new BehaviorSubject(moment());

  @Input()
  public partner: Partner;

  public locations: BehaviorSubject<Location[]> = new BehaviorSubject<Location[]>(null);

  public location: Location;

  ngOnInit(): void {
    this.adminService.reports = null;
    this.adminService.loadLocations(this.partner.email).subscribe(locations => {
      this.locations.next(locations.Data);
    });
  }

  loadReports(location: string, page: Page<Report> = null) {
    this.adminService.loadReports(
        location,
        this.partner.email,
        this.date$.value,
        page
    ).subscribe(elem => {
      this.adminService.mergeReports(elem);
    });


  }

  selectLocation(location: Location) {
    console.log('location changed');
    console.log(location);
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

  public dateForward() {
    this.date$.next(Object.assign(
        moment(),
        this.date$.value.add(
            1,
            'month'
        )
    ));
    if (this.location) this.loadReports(this.location.locationId);
  }

  public dateBackwards() {

    const newDate = this.date$.value.subtract(
        1,
        'month'
    );
    this.date$.next(Object.assign(
        moment(),
        newDate
    ));
    if (this.location) this.loadReports(this.location.locationId);
  }

}
