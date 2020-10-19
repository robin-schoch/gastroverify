import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  ContentChildren,
  Input,
  OnInit,
  QueryList,
  TemplateRef,
  ViewChild
} from '@angular/core';
import {EntryCheckTableToolbarDirective} from './entry-check-table-toolbar.directive';
import {BehaviorSubject, combineLatest, merge, Observable} from 'rxjs';
import {filter, map, startWith} from 'rxjs/operators';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {MatColumnDef, MatRowDef, MatTable} from '@angular/material/table';
import {CdkColumnDef, CdkRowDef, CdkTable} from '@angular/cdk/table';

export interface IColumn {
  name: string,
  weight: number
}

export type Column = string | IColumn


@Component({
  selector: 'app-entry-check-table',
  templateUrl: './entry-check-table.component.html',
  styleUrls: ['./entry-check-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EntryCheckTableComponent implements OnInit, AfterContentInit {


  @Input()
  public loading = false;

  @Input()
  public dataSource: any[];

  @Input()
  public responsive = true;

  private allowedRows: Observable<number>;

  @Input()
  public displayColumns: Column[];


  private _displayColumns$: BehaviorSubject<IColumn[]> = new BehaviorSubject<IColumn[]>([]);

  @ContentChild(EntryCheckTableToolbarDirective, {read: TemplateRef, static: true})
  public toolbarTemplate: TemplateRef<any>;

  @ContentChildren(MatColumnDef)
  public columnDefs: QueryList<CdkColumnDef>;

  @ContentChildren(MatRowDef)
  public rowDefs: QueryList<CdkRowDef<any>>;

  @ViewChild(MatTable, {static: true})
  public matTable: CdkTable<any>;

  constructor(private breakpointObserver: BreakpointObserver) {
    this.createBreakPointObserver();
  }

  ngOnInit(): void {
    this._displayColumns$.subscribe(elem => console.log(elem));
    this.displayedColumns$.subscribe(elem => console.log(elem));

  }

  ngAfterContentInit(): void {
    this.columnDefs.toArray().forEach(def => this.matTable.addColumnDef(def));
    this.rowDefs.toArray().forEach(def => this.matTable.addRowDef(def));
    this._displayColumns$.next(
        this.displayColumns.map(column => typeof column === 'string' ? {name: column, weight: 1} : column)
    );
  }


  get displayedColumns$() {
    if (!this.responsive) {
      return this._displayColumns$.pipe(map(columns => columns.map(column => column.name)));
    }
    return combineLatest([
          this._displayColumns$.pipe(),
          this.allowedRows
        ]
    ).pipe(map(([columns, rows]) => {
      if (columns.length <= rows) return columns.map(column => column.name);
      const sortedRows = columns.sort((r1, r2) => r1.weight - r2.weight)
                                .slice(0, rows)
                                .map(column => column.name);
      return columns.filter(column => !sortedRows.includes(column.name)).map(column => column.name);
    }));

  }

  private createBreakPointObserver(): void {
    const breaks = [];
    breaks.push(this.breakpointObserver.observe([Breakpoints.XSmall])
                    .pipe(filter(result => result.matches), map(_ => 2)));
    breaks.push(this.breakpointObserver.observe([Breakpoints.Small])
                    .pipe(filter(result => result.matches), map(_ => 4)));
    breaks.push(this.breakpointObserver.observe([Breakpoints.Medium])
                    .pipe(filter(result => result.matches), map(_ => 9)));
    breaks.push(this.breakpointObserver.observe([Breakpoints.Large])
                    .pipe(filter(result => result.matches), map(_ => 14)));
    this.allowedRows = merge(breaks).pipe(startWith(20));
  }


}
