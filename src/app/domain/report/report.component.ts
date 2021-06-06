import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Report, ReportService} from './report.service';
import {BehaviorSubject, Observable} from 'rxjs';
import {GastroService} from '../../service/gastro.service';
import {Location} from '../../model/Location';
import {filter, map} from 'rxjs/operators';

import * as moment from 'moment';
import {Store} from '@ngrx/store';
import {setToolbarTitle} from '../../store/context/context.action';
import {selectPartnerLocation} from '../../store/partner/partner.selector';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReportComponent implements OnInit {

  public locations$: Observable<Location[]> = this.store.select(selectPartnerLocation);
  public date$ = new BehaviorSubject(moment());


  public _selectedLocation$: BehaviorSubject<Location> = new BehaviorSubject<Location>(null);

  public reports$: Observable<Report[]>;
  public totalReports$: Observable<any>;

  displayedColumns = [
    'date',
    'distinctTotal',
    'total',
    'estimatedCost'

  ];

  constructor(
      private reportService: ReportService,
      private partnerService: GastroService,
      private store: Store
  ) {

    this.reports$ = this.reportService.reports$;
    this.totalReports$ = this.reports$.pipe(map(reports => {
      return {

        distinctTotal: reports.reduce(
            (acc, elem) => acc + elem.distinctTotal,
            0
        ),
        total: reports.reduce(
            (acc, elem) => acc + elem.total,
            0
        ),
        price: reports.reduce(
            (acc, elem) => acc + this.getPrice(elem),
            0
        )
      };
    }));
    this.store.dispatch(setToolbarTitle({title: "Rapport"}))
  }

  ngOnInit(): void {
    this.reportService.reports = [];

  }

  selectLocation(location) {

    this.selectedLocation = location;
    this.loadReport(location);

  }

  loadReport(location) {
    this.reportService.loadReports(
        location,
        null,
        this.date$.value
    ).subscribe(
        r => this.reportService.reports = r.Data,
        err => console.log(err)
    );
  }

  subtractDay(isoTime: string): string {
    return moment(isoTime).subtract(
        1,
        'day'
    ).toISOString();
  }


  public dateForward() {
    this.date$.next(Object.assign(
        moment(),
        this.date$.value.add(
            1,
            'month'
        )
    ));
    if (this._selectedLocation$.value) this.loadReport(this._selectedLocation$.value);
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
    if (this._selectedLocation$.value) this.loadReport(this._selectedLocation$.value);
  }

  /***************************************************************************
   *                                                                         *
   * Getters / Setters                                                       *
   *                                                                         *
   **************************************************************************/


  set selectedLocation(location: Location) {
    this._selectedLocation$.next(location);
  }

  getPrice(element: any): number {
    if (element.hasOwnProperty('pricePerEntry')) {
      return element.distinctTotal * element.pricePerEntry;
    } else {
      return element.distinctTotal * 0.12;
    }
  }


}
