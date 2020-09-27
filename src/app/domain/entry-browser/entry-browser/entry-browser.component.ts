import {ChangeDetectionStrategy, Component, Inject, OnInit} from '@angular/core';
import {Location} from '../../gastro-dashboard/gastro.service';
import {Entry, EntryService, Page} from '../entry.service';
import {BehaviorSubject, Observable} from 'rxjs';
import {filter, map} from 'rxjs/operators';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {animate, state, style, transition, trigger} from '@angular/animations';


export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
];

@Component({
  selector: 'app-entry-browser',
  templateUrl: './entry-browser.component.html',
  styleUrls: ['./entry-browser.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class EntryBrowserComponent implements OnInit {

  private _selectedBar$: BehaviorSubject<Location> = new BehaviorSubject<Location>(null);
  public data$: BehaviorSubject<Page<Entry>> = new BehaviorSubject<Page<Entry>>(null);
  public paginator$: Observable<Paginator>;

  allColumns = [
    'Checkin',
    'Zeit',
    'Name',
    'Strasse',
    'Nr.',
    'Email'
  ];
  displayedColumns$: Observable<string[]>;
  displayedColumns2: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = ELEMENT_DATA;
  expandedElement: any | null;


  constructor(
      @Inject(MAT_DIALOG_DATA) public location: Location,
      private entryService: EntryService,
      private breakpointObserver: BreakpointObserver
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

    console.log('dialog ', location);

    this.setLocation(location);
    this.displayedColumns$ = breakpointObserver.observe([
      Breakpoints.XSmall,
      Breakpoints.Small,
      Breakpoints.Medium,
      Breakpoints.Large
    ]).pipe(map(point => {
      if (point.breakpoints[Breakpoints.XSmall]) {
        return this.allColumns.slice(0, 3);
      } else if (point.breakpoints[Breakpoints.Small]) {
        return this.allColumns.slice(0, 4);
      } else if (point.breakpoints[Breakpoints.Medium]) {
        return this.allColumns.slice(0, 5);
      } else if (point.breakpoints[Breakpoints.Large]) {
        return this.allColumns;
      } else {
        return this.allColumns;
      }
    }));
  }

  /*
   if (result.breakpoints[Breakpoints.XSmall]) {
   this.displayedColumns = this.allColumns.slice(0, 2);
   } else if (result.breakpoints[Breakpoints.Small]) {
   this.displayedColumns = this.allColumns.slice(0, 3);
   } else if (result.breakpoints[Breakpoints.Medium]) {
   this.displayedColumns = this.allColumns.slice(0, 4);
   } else if (result.breakpoints[Breakpoints.Large]) {
   this.displayedColumns = this.allColumns;
   }
   */
  public setLocation(bar: Location) {
    if (!!bar) {
      console.log(bar);
      this.data$.next(null);
      this._selectedBar$.next((bar));
      this.loadPage(bar);
    }
  }

  public get selectedBar$(): Observable<Location> {
    return this._selectedBar$.asObservable();
  }

  private loadPage(bar: Location, page?: Page<Entry>) {
    this.entryService.loadNextPage(
        bar,
        page
    ).subscribe(page => this.mergePages(page));
  }

  public get bar$(): Observable<Location> {
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
    p.Limit = 100;
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

  reload(selectedbar: Location) {
    this.setLocation(selectedbar);
  }

  mapNumber(tableNumber: number) {
    return tableNumber === -1 ? 'Keine Angabe' : tableNumber;

  }

  expanedElemet(row: any) {
    console.log("hurra")
    this.expandedElement = this.expandedElement === row ? null : row
    console.log(this.expandedElement)

  }
}

export interface Paginator {
  length: number,
  pageSize: number,
  pageSizeOptions: number[]
}

