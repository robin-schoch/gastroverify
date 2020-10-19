import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {GastroService} from '../gastro-dashboard/gastro.service';
import {filter, map} from 'rxjs/operators';
import {BehaviorSubject, Observable} from 'rxjs';
import {Location} from '../../model/Location';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ToolbarService} from '../main/toolbar.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-entry-counter',
  templateUrl: './entry-counter.component.html',
  styleUrls: ['./entry-counter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EntryCounterComponent implements OnInit {

  public locations$: Observable<Location[]>;

  public location: Location = null;

  public lastLoaded$: BehaviorSubject<Date> = new BehaviorSubject<Date>(null);

  public hours = 6;

  public in$: BehaviorSubject<number> = new BehaviorSubject<number>(null);

  public out$: BehaviorSubject<number> = new BehaviorSubject<number>(null);

  public selectedLocation$: BehaviorSubject<Location> = new BehaviorSubject<Location>(null);

  public count$: BehaviorSubject<number> = new BehaviorSubject<number>(null);

  constructor(
      private partnerService: GastroService,
      private _snackBar: MatSnackBar,
      private toolbarService: ToolbarService,
      private tranlate: TranslateService
  ) {
    this.toolbarService.toolbarTitle = 'Zähler'
  }

  ngOnInit(): void {
    this.partnerService.getPartner().subscribe(
        elem => this.partnerService.gastro = elem,
        error => this.partnerService.error = error
    );
    this.locations$ = this.partnerService.gastro$.pipe(
        filter(p => !!p),
        map(p => p.locations)
    );
  }

  selectLocation(value: any) {
    this.getCounter(value);
    this.location = value;


  }

  public reloadCounter(location) {
    this.getCounter(location);
  }


  getCounter(location: Location) {
    this.partnerService.getCounter(location, this.hours).subscribe((elem): any => {

      this.in$.next(elem.in);
      this.out$.next(elem.out);
      this.lastLoaded$.next(new Date());
      this.count$.next(elem.counter);
      this.selectedLocation$.next(location);
      console.log(elem);
    });
  }

  addPhantomExit(location: Location) {
    this.partnerService.addShadowCheckout(location).subscribe(elem => {
      this.reloadCounter(location);
      this._snackBar.open('Checkout hinzugefügt', 'ok', {
        duration: 2000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });
    }, error => {
      this._snackBar.open('Fehler', 'ok', {
        duration: 2000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });
    });
  }

}
